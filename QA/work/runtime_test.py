import asyncio, json, pathlib, time
from playwright.async_api import async_playwright

QA=pathlib.Path('/mnt/data/QA')
EVID=QA/'evidence'
LOG=QA/'logs'/'run.log'
BUNDLE=(QA/'work/runtime/bundle.html').read_text(encoding='utf-8')
STORAGE_SHIM="""
(() => {
  const d = {};
  const storage = {
    getItem: (k) => Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null,
    setItem: (k, v) => { d[k] = String(v); },
    removeItem: (k) => { delete d[k]; },
    clear: () => { Object.keys(d).forEach((k) => delete d[k]); },
    key: (i) => Object.keys(d)[i] || null,
    _dump: () => ({ ...d })
  };
  Object.defineProperty(storage, 'length', { get: () => Object.keys(d).length });
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
})();
"""

async def load_bundle(page):
    await page.set_content(BUNDLE, wait_until='load')
    await page.wait_for_selector('#playButton')

async def main():
    lines=[]
    def log(msg):
        stamp=time.strftime('%Y-%m-%d %H:%M:%S')
        lines.append(f'[{stamp}] {msg}')
        print(msg)
    try:
      async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context=await browser.new_context(viewport={'width':1440,'height':900})
        page=await context.new_page()
        await page.evaluate(STORAGE_SHIM)
        console=[]; page_errors=[]; failed=[]
        page.on('console', lambda m: console.append(f'{m.type}: {m.text}'))
        page.on('pageerror', lambda e: page_errors.append(str(e)))
        page.on('requestfailed', lambda r: failed.append(f'{r.url} :: {r.failure}'))
        await load_bundle(page)
        log(f'Title: {await page.title()}')
        await page.screenshot(path=str(EVID/'BVT-001_initial_menu.png'), full_page=True)
        log(f'Menu visible: {await page.locator("#menuScreen").is_visible()}')
        log(f'Play visible: {await page.locator("#playButton").is_visible()}')
        selftest=await page.evaluate('window.lightSudokuSelfTest(12)')
        log('Self-test: '+json.dumps(selftest, ensure_ascii=False))
        await page.click('#playButton')
        await page.wait_for_selector('.mode-card')
        log(f'Mode cards: {await page.locator(".mode-card").count()}')
        await page.screenshot(path=str(EVID/'TC-UI-LEVELS_desktop.png'), full_page=True)
        classic=page.locator('.mode-card.mode-classic')
        await classic.locator('.mode-play').click()
        await page.wait_for_selector('#gameScreen:not([hidden])')
        cells=page.locator('#board .cell')
        log(f'Classic cells: {await cells.count()}')
        log(f'Classic givens: {await page.locator("#board .cell.given").count()}')
        log(f'Number pad buttons: {await page.locator("#numberPad button").count()}')
        active=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1')).active")
        idx=active['selected']; correct=active['solution'][idx]
        await cells.nth(idx).click()
        await page.locator('#numberPad button').nth(correct-1).click()
        active2=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1')).active")
        log(f'Correct entry persisted: {active2["board"][idx] == correct}; mistakes={active2["mistakes"]}')
        next_idx=next(i for i,v in enumerate(active2['board']) if v==0 and active2['givens'][i]==0)
        await cells.nth(next_idx).click()
        await page.click('#notesButton')
        await page.locator('#numberPad button').nth(0).click()
        await page.locator('#numberPad button').nth(1).click()
        notes=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1')).active.notes")
        log(f'Notes stored at {next_idx}: {notes[next_idx]}')
        await page.click('#pauseButton')
        log(f'Pause modal visible: {await page.locator("#messageModal").is_visible()}')
        log(f'Pause title: {await page.locator("#messageTitle").inner_text()}')
        await page.locator('#messageActions button').filter(has_text='Продолжить').click()
        log(f'Pause modal closed: {not await page.locator("#messageModal").is_visible()}')
        # re-create DOM in same window to imitate restart while retaining localStorage shim
        await load_bundle(page)
        log(f'Continue visible after simulated restart: {await page.locator("#continueButton").is_visible()}')
        await page.click('#continueButton')
        restored=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1')).active")
        log(f'Restored board cell {idx}: {restored["board"][idx]} expected {correct}')
        log(f'Restored notes at {next_idx}: {restored["notes"][next_idx]}')
        await page.click('#settingsButton')
        await page.locator('#soundToggle').uncheck()
        await page.click('#closeSettingsButton')
        stored_sound=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1')).settings.sound")
        log(f'Sound setting stored false: {stored_sound is False}')
        await page.evaluate('window.lightSudokuDebug.solveCurrent()')
        await page.wait_for_selector('#messageModal:not([hidden])')
        log(f'Win title: {await page.locator("#messageTitle").inner_text()}')
        data=await page.evaluate("JSON.parse(localStorage.getItem('light_sudoku_save_v1'))")
        log(f'Active cleared on win: {data.get("active") is None}; wins={data.get("stats",{}).get("wins")}; firstWin={data.get("achievements",{}).get("firstWin")}')
        await page.screenshot(path=str(EVID/'TC-CORE-WIN_classic.png'), full_page=True)
        mobile=await browser.new_context(viewport={'width':390,'height':844}, is_mobile=True, has_touch=True)
        mp=await mobile.new_page()
        await mp.evaluate(STORAGE_SHIM)
        m_errors=[]
        mp.on('pageerror', lambda e: m_errors.append(str(e)))
        await load_bundle(mp)
        await mp.click('#playButton')
        log(f'Mobile mode cards visible: {await mp.locator(".mode-card").count()}')
        await mp.screenshot(path=str(EVID/'TC-COMPAT-mobile_390x844.png'), full_page=True)
        await mp.locator('.mode-card.mode-mini .mode-play').click()
        await mp.wait_for_selector('#gameScreen:not([hidden])')
        board_box=await mp.locator('.board-wrap').bounding_box()
        log(f'Mobile mini board box: {board_box}; viewport={mp.viewport_size}')
        await mp.screenshot(path=str(EVID/'TC-CORE-mini_mobile.png'), full_page=True)
        log(f'Mobile page errors: {m_errors}')
        await mobile.close()
        log(f'Console messages: {console}')
        log(f'Page errors: {page_errors}')
        log(f'Failed requests: {failed}')
        await context.close(); await browser.close()
    finally:
      LOG.write_text('\n'.join(lines)+'\n', encoding='utf-8')

asyncio.run(main())
