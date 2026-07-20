import asyncio, json, pathlib, time
from playwright.async_api import async_playwright
QA=pathlib.Path('/mnt/data/QA')
BUNDLE=(QA/'work/runtime/bundle.html').read_text(encoding='utf-8')
OUT=QA/'logs/tests.log'
EVID=QA/'evidence'
KEY='light_sudoku_save_v1'

def shim(seed=None):
    d=seed or {}
    return f"""(() => {{ const d = {json.dumps(d)}; const s={{getItem:k=>Object.prototype.hasOwnProperty.call(d,k)?d[k]:null,setItem:(k,v)=>{{d[k]=String(v)}},removeItem:k=>{{delete d[k]}},clear:()=>{{Object.keys(d).forEach(k=>delete d[k])}},key:i=>Object.keys(d)[i]||null,_dump:()=>({{...d}})}}; Object.defineProperty(s,'length',{{get:()=>Object.keys(d).length}}); Object.defineProperty(window,'localStorage',{{value:s,configurable:true}}); }})()"""

async def new_page(browser, viewport, seed=None, mobile=False):
    ctx=await browser.new_context(viewport=viewport, is_mobile=mobile, has_touch=mobile)
    p=await ctx.new_page(); await p.evaluate(shim(seed)); await p.set_content(BUNDLE, wait_until='load'); await p.wait_for_selector('#playButton')
    return ctx,p

async def main():
    results=[]
    def rec(id,status,actual,evidence=''):
        results.append({'id':id,'status':status,'actual':actual,'evidence':evidence})
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        ctx,p=await new_page(browser, {'width':1440,'height':900})
        rec('BVT-001','PASS' if await p.title()=='Судоку без спешки' else 'FAIL',await p.title(),'evidence/BVT-001_initial_menu.png')
        st=await p.evaluate('window.lightSudokuSelfTest(50)')
        rec('TEST-GEN-001','PASS' if st['ok'] and st['testedPuzzles']==200 else 'FAIL',json.dumps(st,ensure_ascii=False))
        await p.click('#playButton')
        specs={'diagonal':(81,42,9,3),'irregular':(81,43,9,3),'classic':(81,44,9,4),'mini':(36,24,6,4)}
        for mode,(cells,givens,pad,hints) in specs.items():
            # clear active before each mode by using debug direct start
            await p.evaluate(f"window.lightSudokuDebug.newPuzzle('{mode}')")
            actual=(await p.locator('#board .cell').count(),await p.locator('#board .cell.given').count(),await p.locator('#numberPad button').count(),int(await p.locator('#hintsText').inner_text()))
            rec(f'TC-MODE-{mode.upper()}','PASS' if actual==(cells,givens,pad,hints) else 'FAIL',str(actual))
        # classic gameplay
        await p.evaluate("window.lightSudokuDebug.newPuzzle('classic')")
        active=await p.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).active")
        idx=active['selected']; solution=active['solution'][idx]
        await p.locator('#board .cell').nth(idx).click(); await p.locator('#numberPad button').nth(solution-1).click()
        a=await p.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).active")
        rec('TC-CORE-ENTRY-CORRECT','PASS' if a['board'][idx]==solution and a['mistakes']==0 else 'FAIL',f"board={a['board'][idx]}, mistakes={a['mistakes']}")
        # wrong entry on next empty
        wrong_idx=next(i for i,v in enumerate(a['board']) if v==0 and a['givens'][i]==0)
        wrong=1 if a['solution'][wrong_idx]!=1 else 2
        await p.locator('#board .cell').nth(wrong_idx).click(); await p.locator('#numberPad button').nth(wrong-1).click()
        a2=await p.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).active")
        rec('TC-CORE-ENTRY-WRONG','PASS' if a2['board'][wrong_idx]==wrong and a2['mistakes']==1 else 'FAIL',f"board={a2['board'][wrong_idx]}, mistakes={a2['mistakes']}")
        # Undo visibility after history exists
        undo_disabled=await p.locator('#undoButton').is_disabled(); undo_visible=await p.locator('#undoButton').is_visible(); display=await p.locator('#undoButton').evaluate("el=>getComputedStyle(el).display")
        rec('TC-CORE-UNDO','FAIL' if (not undo_disabled and not undo_visible) else 'PASS',f'disabled={undo_disabled}, visible={undo_visible}, display={display}','evidence/BUG-001_tools_without_undo.png')
        await p.screenshot(path=str(EVID/'BUG-001_tools_without_undo.png'), full_page=True)
        # desktop aria live
        tip_display=await p.locator('#tipText').evaluate("el=>getComputedStyle(el).display")
        rec('TC-ACC-LIVE-REGION','FAIL' if tip_display=='none' else 'PASS',f'aria-live={await p.locator("#tipText").get_attribute("aria-live")}, display={tip_display}')
        # keyboard arrow movement
        before=await p.locator('#board .cell.selected').get_attribute('aria-label'); await p.keyboard.press('ArrowRight'); after=await p.locator('#board .cell.selected').get_attribute('aria-label')
        rec('TC-INPUT-ARROWS','PASS' if before!=after else 'FAIL',f'before={before}; after={after}')
        # pause modal and focus
        await p.click('#pauseButton'); modal=await p.locator('#messageModal').is_visible(); focused=await p.evaluate('document.activeElement && document.activeElement.textContent.trim()')
        rec('TC-STATE-PAUSE','PASS' if modal and 'Продолжить' in focused else 'FAIL',f'modal={modal}, focus={focused}')
        await p.keyboard.press('Escape'); rec('TC-STATE-PAUSE-ESC','PASS' if not await p.locator('#messageModal').is_visible() else 'FAIL','modal closed via Escape')
        # persistence into a clean document/window using copied storage
        dump=await p.evaluate('localStorage._dump()')
        await ctx.close()
        ctx2,p2=await new_page(browser, {'width':1440,'height':900}, dump)
        cont=await p2.locator('#continueButton').is_visible(); await p2.click('#continueButton')
        restored=await p2.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).active")
        rec('TC-SAVE-RESTART','PASS' if cont and restored['board'][idx]==solution and restored['board'][wrong_idx]==wrong else 'FAIL',f'continue={cont}, correct={restored["board"][idx]}, wrong={restored["board"][wrong_idx]}')
        # settings persisted after new window
        await p2.click('#settingsButton'); await p2.locator('#highlightToggle').uncheck(); await p2.click('#closeSettingsButton')
        dump2=await p2.evaluate('localStorage._dump()'); await ctx2.close()
        ctx3,p3=await new_page(browser, {'width':1440,'height':900}, dump2)
        await p3.click('#menuSettingsButton'); checked=await p3.locator('#highlightToggle').is_checked(); rec('TC-SET-PERSIST','PASS' if not checked else 'FAIL',f'highlight checked={checked}')
        await p3.keyboard.press('Escape'); await ctx3.close()
        # responsive configurations
        for label,viewport in [('mobile-390x844',{'width':390,'height':844}),('small-320x568',{'width':320,'height':568}),('tablet-800x600',{'width':800,'height':600})]:
            c,m=await new_page(browser,viewport,mobile=viewport['width']<500)
            await m.click('#playButton'); await m.locator('.mode-card.mode-mini .mode-play').click(); await m.wait_for_selector('#gameScreen:not([hidden])')
            box=await m.locator('.board-wrap').bounding_box(); body_scroll=await m.evaluate('({sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,vw:innerWidth,vh:innerHeight})')
            ok=box and box['x']>=0 and box['x']+box['width']<=viewport['width']+1 and body_scroll['sw']<=body_scroll['vw']+1 and body_scroll['sh']<=body_scroll['vh']+1
            rec(f'TC-COMPAT-{label.upper()}','PASS' if ok else 'FAIL',f'board={box}; page={body_scroll}',f'evidence/{label}.png')
            tip=await m.locator('#tipText').evaluate("el=>getComputedStyle(el).display")
            if label=='mobile-390x844': rec('TC-ACC-LIVE-REGION-MOBILE','PASS' if tip!='none' else 'FAIL',f'display={tip}')
            await m.screenshot(path=str(EVID/f'{label}.png'),full_page=True); await c.close()
        await browser.close()
    counts={s:sum(1 for r in results if r['status']==s) for s in ['PASS','FAIL','BLOCKED','NOT_RUN']}
    OUT.write_text('\n'.join(json.dumps(r,ensure_ascii=False) for r in results)+'\nSUMMARY '+json.dumps(counts,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'results':results,'summary':counts},ensure_ascii=False,indent=2))
asyncio.run(main())
