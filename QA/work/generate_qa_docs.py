from pathlib import Path
import csv, json, textwrap, hashlib
from datetime import date

ROOT=Path('/mnt/data')
QA=ROOT/'QA'
CHK=QA/'checklists'
QA.mkdir(exist_ok=True); CHK.mkdir(exist_ok=True)
TODAY='2026-07-20'
BUILD='source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2'

def w(path, text):
    p=QA/path if not str(path).startswith('/') else Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text.strip()+"\n", encoding='utf-8')

def table(headers, rows):
    esc=lambda x:str(x).replace('|','\\|').replace('\n','<br>')
    return '| '+' | '.join(headers)+' |\n|'+ '|'.join(['---']*len(headers))+'|\n'+'\n'.join('| '+' | '.join(esc(c) for c in r)+' |' for r in rows)

sources='''
## Методологические и платформенные источники

Проверено 2026-07-20. Источники используются как методическая база; документ **не заявляет соответствие или сертификацию**.

- [ISTQB Certified Tester Foundation Level v4.0.1](https://istqb.org/sdm_downloads/istqb-certified-tester-foundation-level-syllabus-v4-0/) — терминология, риск-ориентированный подход, техники тест-дизайна.
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) — общие понятия тестирования.
- [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/obp/ui/en/) — процессы тестирования.
- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — тестовая документация.
- [Yandex Games SDK](https://yandex.com/dev/games/doc/en/sdk) — назначение и обязательность SDK для публикации.
- [Yandex Games: Player data](https://yandex.com/dev/games/doc/en/sdk/sdk-player) — облачные данные игрока.
- [Yandex Games: Advertising](https://yandex.com/dev/games/doc/en/sdk/sdk-adv) — rewarded video и рекламные callback-и.
- [Yandex Games: Game loading and gameplay markup](https://yandex.com/dev/games/doc/en/sdk/sdk-game-events) — ready/start/stop.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — доступность веб-интерфейса.
- [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines) — игровые accessibility-практики.
'''

inventory_rows=[
('Название','CONFIRMED','«Судоку без спешки» / Slow Sudoku','index(2).html: title; game(1).js translations'),
('Жанр','CONFIRMED','Однопользовательская логическая головоломка Sudoku','modes, rules, puzzle generator'),
('Целевая аудитория','INFERRED','Пользователи казуальных логических игр; короткие и спокойные сессии','subtitle, режим Mini, отсутствие тайм-лимита'),
('Основной цикл','CONFIRMED','Выбор режима → заполнение клеток → проверка → победа → статистика/новая сетка','showLevelSelect/startMode/enterValue/checkWin'),
('Победа','CONFIRMED','Все клетки совпадают с solution','checkWin'),
('Поражение','NOT_APPLICABLE','Отдельного состояния поражения нет; ошибки не блокируют продолжение','wrongNumber/errors modal'),
('Прогресс','CONFIRMED','Текущая партия, рекорды, статистика, достижения','state.data, local/cloud save'),
('Управление','CONFIRMED','Мышь/касание; клавиатура 1–9, 0/Delete/Backspace, N, стрелки','bindEvents/handleKey'),
('Обучение','CONFIRMED','Трёхшаговый tutorial для каждого режима','showModeTutorialStep'),
('Режимы','CONFIRMED','Диагонали, Острова, Классика, Мини 6x6','modes[]'),
('Главное меню','CONFIRMED','Play, Continue, Statistics, Achievements, Settings','index.html/renderMenu'),
('Пауза','CONFIRMED','Пользовательская, modal, blur, visibility, platform pause','pausedReasons'),
('Настройки','CONFIRMED','Sound, autoCheck, highlight; reset progress','settings modal'),
('Сохранения','CONFIRMED','localStorage + Yandex Player.setData/getData','SAVE_KEY, writeCloudData'),
('Аудио','CONFIRMED','Синтезированные WebAudio сигналы, музыка отсутствует','playTone'),
('Локализация','CONFIRMED','RU и EN','translations'),
('Сеть','INFERRED','Только Yandex SDK: player data, ads, platform events','YaGames SDK calls'),
('Достижения','CONFIRMED','5 достижений','achievementDefinitions'),
('Реклама','CONFIRMED','Rewarded video для дополнительной подсказки','showRewardedVideo'),
('Покупки','NOT_APPLICABLE','Код покупок отсутствует','static search'),
('Учётная запись','INFERRED','Опциональный Yandex Player без scopes','getPlayer({scopes:false})'),
('Аналитика','INFERRED','Только LoadingAPI/GamePlayAPI platform signals','markReady/notifyGameplayStart'),
('Пользовательский контент/моды','NOT_APPLICABLE','Не обнаружено','static analysis'),
('Контроллер','NOT_APPLICABLE','Поддержка не обнаружена','input handlers'),
('Сенсорное управление','CONFIRMED','Кнопки и touch-action manipulation','CSS/DOM events'),
('Несколько игроков','NOT_APPLICABLE','Не обнаружено','static analysis'),
]

w('00_PROJECT_INVENTORY.md', f'''# 00 — Project Inventory

- Дата анализа: {TODAY}
- Проверяемый идентификатор: `{BUILD}`
- Репозиторий/commit: `UNKNOWN` — Git metadata не предоставлена.
- Источники проекта: `index(2).html`, `game(1).js`, `style(2).css`.

## Краткое описание

«Судоку без спешки» — автономная браузерная Sudoku-игра с четырьмя вариантами правил. Проект написан без фреймворка на HTML/CSS/JavaScript и содержит генератор задач с проверкой единственности решения. Предполагаемая площадка — Yandex Games.

## Технический стек

| Область | Статус | Значение |
|---|---|---|
| Движок | CONFIRMED | Собственный browser DOM/Web API runtime, игровой движок отсутствует |
| Язык | CONFIRMED | JavaScript ES2020+, HTML5, CSS |
| Сборка | CONFIRMED | Сборка не требуется; статические файлы |
| Точка входа | CONFIRMED | `index.html` → `game.js`, `DOMContentLoaded` → `init()` |
| Целевая платформа | INFERRED | Современный web browser + Yandex Games |
| Runtime | CONFIRMED | DOM, localStorage, WebAudio, Promise, optional YaGames SDK |
| Зависимости | CONFIRMED | Внешних package dependencies нет; `/sdk.js` загружается на platform host |
| Сохранения | CONFIRMED | `light_sudoku_save_v1`, schema version 2 |
| Логи | UNKNOWN | Встроенного persistent logging нет; ошибки SDK подавляются |

## Инвентаризация продукта

{table(['Параметр','Статус','Вывод','Основание'], inventory_rows)}

## Игровые режимы

| ID | Размер | Правила | Givens | Free hints | Статус |
|---|---:|---|---:|---:|---|
| diagonal | 9x9 | rows/columns/3x3 + обе диагонали | 42 | 3 | CONFIRMED |
| irregular | 9x9 | rows/columns + 9 irregular regions | 43 | 3 | CONFIRMED |
| classic | 9x9 | rows/columns/3x3 | 44 | 4 | CONFIRMED |
| mini | 6x6 | rows/columns/2x3 | 24 | 4 | CONFIRMED |

## Основные системы

| Система | Главные функции/данные | Зависимости |
|---|---|---|
| Навигация | `showMenu`, `showLevelSelect`, `showGame`, modal stack | DOM/CSS |
| Generator/solver | `createPuzzle`, `digHoles`, `countSolutions` | deterministic RNG |
| Gameplay | `enterValue`, notes, hint, erase, undo, win | state/puzzle |
| State/pause | `pausedReasons`, visibility/blur/platform events | browser lifecycle |
| Persistence | migration/sanitize/local/cloud | localStorage, Yandex Player |
| UI/HUD | generated cells/number pad/progress | translations/CSS |
| Audio | oscillator tones | WebAudio |
| Platform | LoadingAPI, GameplayAPI, Player, Adv | YaGames SDK |

## Пользовательские потоки

1. Первый запуск → Play → выбор режима → tutorial/игра → заполнение → Victory → новая сетка/режим/menu.
2. Повторный запуск → Continue → восстановленная партия.
3. Settings → изменение sound/autoCheck/highlight → сохранение.
4. Подсказки исчерпаны → rewarded video → дополнительная подсказка (platform only).
5. Menu → Statistics/Achievements.

## Структура предоставленного артефакта

- `index(2).html` — DOM и статические тексты.
- `game(1).js` — вся логика, данные и интеграции.
- `style(2).css` — responsive UI.
- `icons/icon_512x512.png` — **ссылка присутствует, файл не предоставлен**.

## Неизвестные параметры

- Требования/дизайн-документ, manifest и параметры публикации Yandex Games.
- Минимальные версии браузеров и устройства.
- Полная комплектация релизного архива, включая icon.
- Намеренно ли скрыта кнопка Undo.
- Требуемый уровень WCAG и accessibility-аудит с assistive technology.
- Политика облачных конфликтов и миграции старых сохранений.

## Таблица предположений

| ID | Предположение | Риск |
|---|---|---|
| ASM-001 | Загруженные три исходных файла представляют основную игровую сборку | Может отсутствовать icon/manifest/platform wrapper |
| ASM-002 | Yandex Games является целевой площадкой | Требования другой площадки не покрыты |
| ASM-003 | Современные Chromium/WebKit/Firefox поддерживаются | Без browser matrix совместимость не подтверждена |
| ASM-004 | Отдельного lose state по дизайну нет | Тесты поражения отмечены N/A |
''')

w('01_TEST_ENVIRONMENT.md', f'''# 01 — Test Environment

| Параметр | Значение |
|---|---|
| Дата/время | 2026-07-20, UTC |
| OS | Debian GNU/Linux 13, Linux x86_64 |
| CPU | x86_64, 56 logical CPUs exposed; model unavailable |
| RAM | 4.0 GiB total, ~3.3 GiB available at start |
| GPU | Физический GPU не доступен; Chromium headless renderer |
| Browser | Chromium 144.0.7559.96 |
| Node.js | 22.16.0 |
| Python | 3.13.5 |
| Viewports | 1440x900; 800x600; 390x844; 320x568 |
| Input | Synthetic mouse, keyboard, touch via Playwright |
| Build | `{BUILD}` |

## Команды

- Проверка синтаксиса: `node --check game(1).js`
- Предусмотренный запуск: раздача статических `index.html`, `style.css`, `game.js` через HTTPS/Yandex host.
- Локальная попытка: `python3 -m http.server 8765` — заблокирована ограничениями контейнера/Chromium policy, не считается багом игры.
- Альтернативный запуск: неизменённые source copies объединены в `QA/work/runtime/bundle.html`; localStorage заменён in-memory shim только в QA runtime.

## Устройства ввода

- Mouse/keyboard: simulated.
- Touch: simulated viewport with `is_mobile/has_touch`.
- Controller: отсутствует и не заявлен.

## Логи

- `QA/logs/environment.log`
- `QA/logs/build.log`
- `QA/logs/run.log`
- `QA/logs/tests.log`

## Ограничения окружения

1. Chromium system policy блокирует URL navigation; поэтому exact network-host запуск и SDK script loading не проверены.
2. Headless browser не подтверждает реальное аудио, GPU performance и screen-reader announcements.
3. Нет Yandex Player, rewarded video и platform callbacks.
4. Полная партия не решалась вручную; victory transition вызван debug helper, который устанавливает solution.
5. FPS/CPU/GPU не измерялись; приведены только корректно зафиксированные duration self-test.
''')

w('02_BUILD_VERIFICATION_REPORT.md', f'''# 02 — Build Verification Report

- Build: `{BUILD}`
- Verdict: **PASS WITH LIMITATIONS**

## Результаты

| Проверка | Статус | Факт |
|---|---|---|
| Наличие HTML/CSS/JS | PASS | Все три основных файла доступны |
| JS syntax | PASS | `node --check` exit 0 |
| Package dependencies | PASS | package manager/dependencies отсутствуют |
| Инициализация DOM | PASS | Chromium отобразил menu, title и controls |
| Встроенные generator tests | PASS | 200 puzzles, 4 modes, 0 problems, 72 ms в данном окружении |
| Exact HTTP/Yandex launch | BLOCKED | Chromium URLBlocklist/container networking |
| Platform SDK | BLOCKED | YaGames environment недоступна |
| Referenced icon | WARNING | `icons/icon_512x512.png` отсутствует в предоставленном наборе |

## Предупреждения

- Релизный package completeness невозможно подтвердить.
- Отсутствующий icon зафиксирован как potential packaging defect до подтверждения состава репозитория.
- Ошибки SDK намеренно подавляются кодом, поэтому production diagnostics ограничены.

## Что не проверено

Публикация, moderation, SDK ready/gameplay signals, cloud save, rewarded ad, реальные браузеры Firefox/Safari, реальные mobile devices, network failures, sound output, long session и производительность rendering.
''')

w('03_PRODUCT_OVERVIEW.md', '''# 03 — Product Overview

## Назначение и идея

Неспешная Sudoku-головоломка без тайм-лимита. Игрок выбирает один из четырёх вариантов, заполняет пустые клетки, может использовать заметки и подсказки, а после решения получает статистику и достижения.

## Сущности и ресурсы

- `mode`: размер, область, givens и количество hints.
- `puzzle`: `solution`, `givens`, seed, generatorVersion.
- `board`: текущее число в каждой клетке.
- `notes`: candidate sets.
- `mistakes`, `hintsLeft`, `usedHints`, `elapsed`.
- `best`, `stats`, `achievements`.

## Правила

Число не должно повторяться в строке, столбце и области режима; в Diagonal дополнительно действуют две диагонали. Ошибочное число сохраняется. При включённом autoCheck оно подсвечивается и увеличивает mistakes. Полностью заполненное неверное поле открывает errors modal. Победа наступает только при полном совпадении с solution.

## Состояния

`menu` → `levels` → `game`; поверх состояний открываются `settingsModal` и `messageModal`. Игра может быть paused по причинам `user`, `modal`, `settings`, `hidden`, `blur`, `platform`, `ad`. Таймер продолжает идти только когда `pausedReasons` пуст.

## Экранные переходы

```text
Menu ─Play→ Mode Select ─Play→ Game ─Win→ Victory Modal
  └Continue──────────────────→ Game
Game ─Back→ Mode Select ─Back→ Menu
Game ─Pause→ Pause Modal ─Continue→ Game / To Menu→ Menu
```

## Ожидаемые реакции

- Given cell не изменяется.
- Correct value обновляет progress и удаляет candidate из peer notes.
- Wrong value увеличивает mistakes при autoCheck.
- Hint исправляет wrong/empty mutable cell.
- Reload восстанавливает active game.
- New grid требует подтверждения.
- Reset удаляет records/settings/active game.

## Нефункциональные ожидания

Responsive layout, keyboard operation, readable focus, сохранение при lifecycle events, отсутствие зависания generator, graceful degradation без SDK.
''')

features=[
('FEAT-CORE-001','Puzzle generation and uniqueness','game.js createPuzzle/countSolutions','CONFIRMED','Critical','mode data','unique solvable puzzle','generation failure','seed/givens','High','Yes','TC-GEN-001'),
('FEAT-CORE-002','Number entry and validation','enterValue/checkWin','CONFIRMED','Critical','board, settings','correct/wrong input','given cell, duplicate','1..size','High','Yes','TC-CORE-001, TC-CORE-002'),
('FEAT-CORE-003','Notes','toggleNotesMode/notes','CONFIRMED','Medium','board','add/remove candidates','invalid candidates','1..size','Medium','Yes','TC-CORE-003'),
('FEAT-CORE-004','Hints and rewarded hint','requestHint/showRewardedVideo','CONFIRMED','High','SDK/board','apply free hint','no SDK/ad error','0/99 hints','High','Yes','TC-HINT-001, TC-HINT-002, TC-HINT-003'),
('FEAT-CORE-005','Undo','undo/history + hidden CSS','CONFIRMED','Medium','history/UI','restore previous state','empty history','80 states','Medium','Yes','TC-CORE-UNDO'),
('FEAT-CORE-006','Completion/statistics','checkWin/updateCompletionStats','CONFIRMED','Critical','save/stats','victory','full incorrect board','time/mistakes','High','Yes','TC-WIN-001'),
('FEAT-UI-001','Menu/mode navigation/tutorial','HTML/renderMenu/tutorial','CONFIRMED','High','translations','normal navigation','rapid clicks/back','4 modes','Medium','Yes','TC-UI-001..004'),
('FEAT-UI-002','Statistics/achievements','showStats/showAchievements','CONFIRMED','Medium','persistence','display values','empty data','large counts','Medium','Yes','TC-UI-STAT-001'),
('FEAT-INPUT-001','Mouse/touch/keyboard','bindEvents/handleKey','CONFIRMED','High','DOM focus','all mapped input','simultaneous/focus loss','1..9','High','Yes','TC-INPUT-001, TC-INPUT-002, TC-INPUT-003, TC-INPUT-004'),
('FEAT-STATE-001','Pause and lifecycle','pausedReasons/listeners','CONFIRMED','High','timer/save/audio','pause/resume','nested reasons','blur/hidden/ad','High','Yes','TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004'),
('FEAT-SAVE-001','Local persistence/migration','localStorage/sanitize','CONFIRMED','Critical','browser storage','save/reload','corrupt/old save','v1/v2','High','Yes','TC-SAVE-001, TC-SAVE-002, TC-SAVE-003, TC-SAVE-004, TC-SAVE-005'),
('FEAT-SAVE-002','Cloud save','Player getData/setData','CONFIRMED','High','Yandex SDK','sync newer data','offline/conflict','timestamps','High','Yes','TC-CLOUD-001..004'),
('FEAT-SET-001','Settings/reset','settings functions','CONFIRMED','Medium','save/UI/audio','persist toggles','bad config/reset cancel','booleans','Medium','Yes','TC-SET-001..004'),
('FEAT-AUDIO-001','Sound cues','WebAudio playTone','CONFIRMED','Low','browser audio','tap/warn/win','blocked audio','on/off','Low','Yes','TC-AUDIO-001, TC-AUDIO-002, TC-AUDIO-003'),
('FEAT-LOC-001','RU/EN localization','translations/applyLanguage','CONFIRMED','Medium','SDK lang','RU/EN texts','unsupported lang','long strings','Medium','Yes','TC-LOC-001, TC-LOC-002, TC-LOC-003'),
('FEAT-PLAT-001','Yandex SDK lifecycle','initSdk/ready/gameplay','CONFIRMED','High','SDK host','ready/start/stop','SDK absent/error','pause/resume','High','Yes','TC-PLAT-001, TC-PLAT-002, TC-PLAT-003, TC-PLAT-004'),
('FEAT-ACC-001','Accessibility semantics/focus','ARIA/inert/focus trap','CONFIRMED','High','DOM/CSS','keyboard/focus','hidden live feedback','responsive','High','Yes','TC-ACC-001..006'),
('FEAT-COMPAT-001','Responsive layout','CSS media queries','CONFIRMED','High','viewport','desktop/mobile','small/landscape','320..1440','High','Yes','TC-COMPAT-001, TC-COMPAT-002, TC-COMPAT-003'),
]
w('04_FEATURE_MATRIX.md', '# 04 — Feature Matrix\n\n'+table(['Feature ID','Название','Источник','Статус','Критичность','Зависимости','Позитивный сценарий','Негативный','Границы','Риск','Regression','Tests'],features))

w('05_REQUIREMENTS_AND_ORACLES.md', f'''# 05 — Requirements and Oracles

## Иерархия oracle

1. Явные тексты интерфейса и tutorial.
2. Согласованное поведение внутри проекта.
3. Код/configuration как фактическая спецификация.
4. Правила Sudoku.
5. Публичные требования Yandex Games.
6. WCAG 2.2/Xbox accessibility best practices.
7. Общепринятые пользовательские ожидания.

| REQ ID | Ожидаемое поведение | Oracle | Уверенность |
|---|---|---|---|
| REQ-CORE-001 | Каждая созданная задача имеет ровно одно решение | `createPuzzle` explicit invariant/self-tests | High |
| REQ-CORE-002 | Given cells нельзя менять | UI message + code | High |
| REQ-CORE-003 | Победа только при полном совпадении с solution | code | High |
| REQ-SAVE-001 | Active game восстанавливается после перезапуска | Continue UI + persistence code | High |
| REQ-STATE-001 | Таймер останавливается на pause/blur/hidden | pause architecture | High |
| REQ-UI-001 | Undo должен быть доступен после хода | control exists, translation, handler, enabled logic | Medium; developer confirmation requested |
| REQ-ACC-001 | Status feedback должно быть доступно assistive technology | `aria-live=polite`, WCAG principles | High |
| REQ-PLAT-001 | SDK signals и saves должны работать на platform | Yandex docs + code | High, runtime unverified |
| REQ-LOC-001 | RU/EN строки не смешиваются и не обрезаются | translations + UI | Medium |

## Неоднозначные требования

- Undo: функция полностью реализована, но control скрыт CSS. Считается дефектом внутренней согласованности до решения разработчика.
- Нет defeat state: считается design choice, а не missing feature.
- Web accessibility: требуемый уровень conformance не задан; отчёт даёт применимые findings без заявления WCAG conformance.

{sources}
''')

w('06_TEST_STRATEGY.md', f'''# 06 — Risk-Based Test Strategy

## Цели

Подтвердить, что игрок может открыть игру, создать корректную задачу, управлять клетками, сохранить/возобновить прогресс и завершить партию без блокирующих ошибок. Вторичная цель — проверить responsive UI, accessibility и Yandex integrations.

## Scope

Включено: gameplay, generator, UI, input, state, local save, settings, localization static review, responsive layouts, SDK code review. Исключено на текущем окружении: moderation, real ads/cloud, physical devices, assistive technology, full browser matrix, real sound/GPU performance.

## Подход для одного разработчика

1. BVT + generator self-test.
2. Critical smoke: menu → mode → input → save → pause → win transition.
3. Targeted checks по изменённой системе.
4. Critical/Core regression.
5. 20–30 минут exploratory charter.
6. Release readiness update.

## Техники

Equivalence partitions (valid/invalid digits), boundary values (0,1,size, full board, 0 hints), state transitions, decision tables (autoCheck/value correctness), pairwise viewport/input/settings, negative/corrupt save, user journeys, error guessing and interruption heuristics.

## Entry criteria

Files complete, JS syntax valid, test build identifier known, no destructive setup, runtime opens.

## Suspension criteria

Startup crash, generator cannot create any critical mode, repeated data loss, environment invalidates observations, test artifacts differ from release files.

## Exit criteria

- BVT and critical smoke executed.
- No open S1/S2 for release decision.
- Critical risks have result or explicit accepted gap.
- Known issues and NOT_RUN are visible.
- Platform integration tested in platform preview before public release.

## Evidence

Screenshots in `QA/evidence`; command output in `QA/logs`; temporary runtime only in `QA/work`. Evidence names include test/bug ID.

## Severity/Priority

Use S1–S4 and P0–P3 from instruction. Severity = player impact; Priority = release/business ordering. Static suspicion is not a confirmed bug.

## Time-limited order

Generator/startup → critical gameplay → save → pause/lifecycle → win → navigation → input → responsive → accessibility → platform → extended negative/performance.

{sources}
''')

risks=[
('RISK-001','Startup','Игра не запускается','syntax/resource/SDK','no play','Low','Critical','High','P0','FEAT-UI-001','BVT-001','Keep BVT','Open'),
('RISK-002','Generator','Задача не создаётся/неуникальна','algorithm regression','mode blocked','Low','Critical','High','P0','FEAT-CORE-001','TC-GEN-001','Run 200 seeds per change','Mitigated'),
('RISK-003','Stability','Crash/hang','uncaught error/heavy recursion','session lost','Low','Critical','Medium','P0','All','Long session','Add error logging','Open'),
('RISK-004','Save','Потеря active game','storage/cloud failure','progress loss','Medium','Critical','Medium','P0','FEAT-SAVE-001, FEAT-SAVE-002','TC-SAVE-001, TC-SAVE-002, TC-SAVE-003, TC-SAVE-004, TC-SAVE-005, TC-CLOUD-001, TC-CLOUD-002, TC-CLOUD-003, TC-CLOUD-004','Platform tests','Open'),
('RISK-005','Save','Corrupt/old save','schema/migration','cannot continue','Medium','High','Medium','P1','FEAT-SAVE-001','TC-SAVE-003, TC-SAVE-004','Corrupt matrix','Open'),
('RISK-006','Core','Невозможно завершить puzzle','wrong solution/state','soft lock','Low','Critical','Low','P0','FEAT-CORE-006','TC-WIN-001, TC-WIN-002','Full manual solve','Open'),
('RISK-007','Core','Wrong win/incorrect board accepted','check regression','invalid completion','Low','High','High','P1','FEAT-CORE-006','TC-WIN-002','Full wrong board','Open'),
('RISK-008','Input','Input ignored/double fired','rapid clicks/focus','wrong board','Medium','High','Medium','P1','FEAT-INPUT-001','TC-INPUT-001, TC-INPUT-002, TC-INPUT-003, TC-INPUT-004','Chaos charter','Open'),
('RISK-009','State','Pause/timer incorrect','nested pauses','record unfair','Medium','Medium','Medium','P2','FEAT-STATE-001','TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004','Lifecycle matrix','Open'),
('RISK-010','Core','Undo недоступен','CSS hides control','cannot recover move','High','Medium','High','P1','FEAT-CORE-005','TC-CORE-UNDO','Fix/confirm design','Confirmed'),
('RISK-011','Core','Wrong notes cleanup','peer rules','misleading candidates','Medium','Medium','Medium','P2','FEAT-CORE-003','TC-CORE-003','Per-mode tests','Open'),
('RISK-012','Hints','Hints exhausted/ad failure','SDK callbacks','feature unavailable','Medium','Medium','Medium','P2','FEAT-CORE-004','TC-HINT-001, TC-HINT-002, TC-HINT-003','Preview test','Blocked'),
('RISK-013','UI','HUD values overflow/negative','long session/corrupt data','unreadable','Low','Medium','High','P2','FEAT-UI-002','TC-UI-HUD-001','Boundary data','Open'),
('RISK-014','Compatibility','Small viewport clipping','responsive rules','actions hidden','Medium','High','High','P1','FEAT-COMPAT-001','TC-COMPAT-001, TC-COMPAT-002, TC-COMPAT-003','Physical devices','Mitigated'),
('RISK-015','Accessibility','Critical feedback only visual/hidden','CSS/ARIA','screen reader user blocked','High','High','High','P1','FEAT-ACC-001','TC-ACC-001','Expose live region','Confirmed'),
('RISK-016','Accessibility','Color/contrast insufficient','palette','low vision difficulty','Medium','Medium','Medium','P2','FEAT-ACC-001','Contrast audit','Measure states','Open'),
('RISK-017','Performance','Generator/loading slow','pathological seed/device','abandonment','Low','High','Medium','P1','FEAT-CORE-001','TC-PERF-001','Low-end device','Open'),
('RISK-018','Performance','Memory growth long session','timers/audio/history','degradation','Medium','Medium','Low','P2','All','TC-PERF-002','60m session','Open'),
('RISK-019','Platform','SDK ready/gameplay signals incorrect','API change','moderation/metrics','Medium','High','Low','P1','FEAT-PLAT-001','TC-PLAT-001, TC-PLAT-002, TC-PLAT-003, TC-PLAT-004','Platform preview','Blocked'),
('RISK-020','Cloud','Clock conflict overwrites newer progress','updatedAt strategy','data loss','Medium','High','Low','P1','FEAT-SAVE-002','TC-CLOUD-004','Conflict tests','Open'),
('RISK-021','Audio','AudioContext blocked/silent','browser policy','no feedback','Medium','Low','Medium','P3','FEAT-AUDIO-001','TC-AUDIO-001, TC-AUDIO-002, TC-AUDIO-003','Physical browser','Open'),
('RISK-022','Localization','Mixed/trimmed text','fallback/viewport','confusion','Medium','Medium','High','P2','FEAT-LOC-001','TC-LOC-001, TC-LOC-002, TC-LOC-003','EN runtime','Open'),
('RISK-023','Security','Secrets/PII leak','SDK/data fields','privacy issue','Low','Critical','Medium','P0','FEAT-SAVE-002','Static review','No secrets found','Mitigated'),
('RISK-024','Package','Missing referenced icon','incomplete archive','404/cosmetic','Medium','Low','High','P2','FEAT-UI-001','Asset check','Confirm release package','Potential'),
('RISK-025','Physics/Collisions','Не применимо','no physics','none','Low','Low','High','P3','N/A','N/A','N/A','N/A'),
('RISK-026','Resources','Negative/overflow counters','corrupt data/long play','bad HUD/stats','Low','Medium','Medium','P2','FEAT-UI-002','Boundary tests','Sanitize more fields','Open'),
('RISK-027','Window','Alt+Tab/focus state race','blur+visibility order','timer/audio state','Medium','Medium','Medium','P2','FEAT-STATE-001','TC-STATE-003','Real browser','Open'),
('RISK-028','Progress','Mode replacement without intent','modal/rapid input','active game loss','Low','High','High','P1','FEAT-UI-001','TC-UI-REPLACE','Rapid click test','Open'),
('RISK-029','Save','Close during save','async cloud pending','cloud stale','Medium','High','Low','P1','FEAT-SAVE-002','TC-CLOUD-003','Throttle/network tests','Blocked'),
('RISK-030','External services','SDK/ad unavailable','network/platform outage','degraded hints/cloud','High','Medium','High','P2','FEAT-PLAT-001','TC-PLAT-003','Graceful fallback','Open'),
]
w('07_RISK_REGISTER.md','# 07 — Risk Register\n\n'+table(['Risk ID','Component','Risk','Cause','Impact','Probability','Impact level','Detectability','Test priority','Features','Tests','Action','Status'],risks))

w('08_TEST_PLAN.md', f'''# 08 — Test Plan

- Document ID: TP-LS-001
- Version: 1.0
- Date: {TODAY}
- Build: `{BUILD}`

## Objectives and scope

Validate critical user journey, puzzle integrity, state/persistence and presentation. Platform functions are in scope but blocked until Yandex preview. Controller, purchases, multiplayer and physics are out of scope because absent.

## Test objects

HTML structure, CSS responsive rules, game state, four generators, input, persistence v2/migration, SDK adapters, accessibility semantics.

## Platforms/environments

Current: Chromium headless Debian at 1440x900, 800x600, 390x844, 320x568. Future matrix: Chrome/Edge/Firefox desktop; Android Chrome; iOS Safari; Yandex embedded preview.

## Test data

Fresh storage; active saves for each mode; correct/wrong values; 0/max hints; corrupt/missing save; v1 save; large stats; SDK callback sequences; deterministic seeds.

## Execution order

1. BVT.
2. Smoke.
3. Critical path.
4. Functional and negative.
5. Exploratory.
6. Save/state.
7. UI/UX and accessibility.
8. Performance/compatibility.
9. Regression.
10. Release Candidate.

## Entry/exit/suspension

See `06_TEST_STRATEGY.md`. Public-release exit additionally requires Yandex preview smoke, real reload, cloud/ad checks, and no open S1/S2.

## Defect/reporting rules

Confirmed issue requires reproducible observation or deterministic static contradiction (for example control forced hidden despite active implementation). Suspicions go to Potential Defects. Retest fixes plus local regression. Evidence saved by ID.

## Smoke plan

Initial menu; mode list; Classic start; correct/wrong entry; pause/resume; persistence; completion transition; close. Platform smoke separately.

## Regression plan

- Critical: startup/generator/save/win.
- Core: all modes/input/settings/pause.
- Extended: localization/accessibility/responsive/platform.
- Full: all test cases and charters.

## Open questions

Undo intent, full package contents, browser support, platform requirements, accessibility target, telemetry policy.
''')

# Test cases
fields=['Test Case ID','Feature ID','Risk ID','Module','Title','Objective','Preconditions','Test Data','Steps','Expected Result','Actual Result','Status','Priority','Test Type','Test Technique','Platform','Build','Environment','Evidence','Related Bug','Notes']
TC=[]
def tc(id,feat,risk,module,title,obj,pre,data,steps,exp,actual='Not executed',status='NOT_RUN',priority='P2',typ='Functional',tech='Scenario',platform='Web',evidence='',bug='',notes=''):
    TC.append([id,feat,risk,module,title,obj,pre,data,steps,exp,actual,status,priority,typ,tech,platform,BUILD,'See 01_TEST_ENVIRONMENT.md',evidence,bug,notes])

tc('BVT-001','FEAT-UI-001','RISK-001','Build','Initial DOM launch','Verify app initializes','QA bundle prepared','Fresh storage','1. Open build. 2. Wait for initialization. 3. Observe title/menu.','Title and Play menu are visible.','Title/menu visible','PASS','P0','Smoke','User journey','Chromium','evidence/BVT-001_initial_menu.png')
tc('TC-GEN-001','FEAT-CORE-001','RISK-002','Generator','200 deterministic puzzle checks','Validate sizes/givens/solution uniqueness','Debug self-test enabled','50 seeds x 4 modes','1. Run lightSudokuSelfTest(50). 2. Review problems.','200 puzzles checked; zero problems.','ok=true; 200 puzzles; 72 ms; 0 problems','PASS','P0','Algorithm','Boundary/iteration')
for mid,cells,givens,pad,hints in [('DIAGONAL',81,42,9,3),('IRREGULAR',81,43,9,3),('CLASSIC',81,44,9,4),('MINI',36,24,6,4)]:
    tc(f'TC-MODE-{mid}',f'FEAT-CORE-001','RISK-002','Modes',f'Start {mid.title()}','Verify mode configuration','Mode list open',mid,f'1. Start {mid}. 2. Count cells/givens/pad. 3. Read hints.',f'{cells} cells, {givens} givens, {pad} digits, {hints} hints.',f'Observed ({cells},{givens},{pad},{hints})','PASS','P0','Smoke','Equivalence partition')
tc('TC-CORE-001','FEAT-CORE-002','RISK-006','Gameplay','Enter correct value','Verify correct move','Classic active','solution value','1. Select editable cell. 2. Enter its solution digit.','Value is stored; mistakes unchanged; progress updated.','Stored; mistakes=0','PASS','P0','Functional','Positive')
tc('TC-CORE-002','FEAT-CORE-002','RISK-007','Gameplay','Enter wrong value with autoCheck','Verify mistake handling','Classic active; autoCheck on','wrong digit','1. Select editable cell. 2. Enter wrong digit.','Wrong value retained, marked error, mistakes +1.','Wrong value stored; mistakes=1','PASS','P0','Negative','Decision table')
tc('TC-CORE-003','FEAT-CORE-003','RISK-011','Notes','Add two notes','Verify candidate storage','Active puzzle','1 and 2','1. Select empty cell. 2. Enable Notes. 3. Press 1 and 2.','Both candidate notes display and persist.','Notes [1,2] stored','PASS','P1','Functional','Positive')
tc('TC-CORE-UNDO','FEAT-CORE-005','RISK-010','Gameplay','Undo after a move','Verify player can revert move','At least one history entry','one move','1. Make move. 2. Observe Undo. 3. Activate Undo.','Undo control is visible/enabled and restores state.','Control enabled in DOM but display:none and not visible','FAIL','P1','Functional','State transition','Chromium','evidence/BUG-001_tools_without_undo.png','BUG-001')
tc('TC-WIN-001','FEAT-CORE-006','RISK-006','Completion','Solved board transition','Verify win processing','Active Classic','solution board','1. Set board to solution through debug test helper. 2. Observe modal/save.','Victory modal; active cleared; stats/achievement updated.','Victory; wins=1; firstWin=true; active=null','PASS','P0','Functional','State transition','','evidence/WIN_classic_result.png','','Transition tested; full manual solve not performed')
tc('TC-STATE-001','FEAT-STATE-001','RISK-009','State','Pause and continue','Verify user pause','Active game','N/A','1. Click Pause. 2. Observe modal/focus. 3. Continue.','Board paused; modal focused; resume works.','Modal visible, focus Continue, closed normally','PASS','P0','Functional','State transition')
tc('TC-STATE-002','FEAT-STATE-001','RISK-009','State','Close pause with Escape','Verify keyboard recovery','Pause modal open','Escape','1. Press Escape.','Modal closes and game resumes.','Modal closed','PASS','P1','Accessibility','Keyboard')
tc('TC-SAVE-001','FEAT-SAVE-001','RISK-004','Save','Restart persistence','Verify board restoration','Game with correct and wrong moves','serialized storage','1. Save state. 2. Create clean document window with same storage. 3. Continue.','Continue shown and exact board restored.','Both values restored','PASS','P0','Functional','Recovery')
tc('TC-SET-001','FEAT-SET-001','RISK-013','Settings','Setting persistence','Verify toggle persists','Fresh build','highlight=false','1. Disable Highlight. 2. Restart document. 3. Open settings.','Highlight remains off.','checked=false','PASS','P1','Functional','State transition')
tc('TC-INPUT-001','FEAT-INPUT-001','RISK-008','Input','Arrow navigation','Verify roving cell selection','Active game','ArrowRight','1. Focus selected cell. 2. Press ArrowRight.','Selection moves one column with wrap rules.','ARIA label changed to next column','PASS','P1','Accessibility','Keyboard')
tc('TC-ACC-001','FEAT-ACC-001','RISK-015','Accessibility','Live feedback exposure','Verify status messages are announced','Desktop and mobile builds','wrong move','1. Trigger status text. 2. Inspect aria-live and computed display.','aria-live region remains in accessibility tree.','aria-live=polite but computed display=none','FAIL','P1','Accessibility','Inspection','Chromium','','BUG-002')
for id,label,actual,evid in [('TC-COMPAT-001','390x844','No page overflow; board inside viewport','evidence/mobile-390x844.png'),('TC-COMPAT-002','320x568','No page overflow; board inside viewport','evidence/small-320x568.png'),('TC-COMPAT-003','800x600','No page overflow; board inside viewport','evidence/tablet-800x600.png')]:
    tc(id,'FEAT-COMPAT-001','RISK-014','Compatibility',f'Layout {label}','Verify critical controls fit','Fresh Mini game',label,'1. Open viewport. 2. Start Mini. 3. Check overflow and board bounds.','No horizontal/vertical document overflow; controls accessible.',actual,'PASS','P1','Compatibility','Boundary','Chromium',evid)
# not run / blocked cases
more=[
('TC-SAVE-002','FEAT-SAVE-001','RISK-005','Save','Missing save','Fresh storage returns defaults'),
('TC-SAVE-003','FEAT-SAVE-001','RISK-005','Save','Corrupt JSON','Invalid localStorage is handled'),
('TC-SAVE-004','FEAT-SAVE-001','RISK-005','Save','V1 migration','Legacy active save migrates'),
('TC-SAVE-005','FEAT-SAVE-001','RISK-004','Save','Close during save','No local progress loss'),
('TC-CLOUD-001','FEAT-SAVE-002','RISK-004','Cloud','Cloud load','Newer cloud data is merged'),
('TC-CLOUD-002','FEAT-SAVE-002','RISK-020','Cloud','Local newer than cloud','Local data retained'),
('TC-CLOUD-003','FEAT-SAVE-002','RISK-029','Cloud','Pending writes','Last snapshot reaches cloud'),
('TC-CLOUD-004','FEAT-SAVE-002','RISK-020','Cloud','Clock conflict','Conflict does not lose newest gameplay'),
('TC-HINT-001','FEAT-CORE-004','RISK-012','Hints','Free hint','One mutable cell solved and hints -1'),
('TC-HINT-002','FEAT-CORE-004','RISK-012','Hints','No free hints without SDK','Graceful noFreeHints message'),
('TC-HINT-003','FEAT-CORE-004','RISK-012','Hints','Rewarded ad callbacks','Reward once, pause/resume correctly'),
('TC-STATE-003','FEAT-STATE-001','RISK-027','State','Alt+Tab/blur','Timer/audio/save pause and resume once'),
('TC-STATE-004','FEAT-STATE-001','RISK-009','State','Nested modal and blur','All pause reasons cleared correctly'),
('TC-INPUT-002','FEAT-INPUT-001','RISK-008','Input','Rapid repeated input','No duplicate mistakes/actions'),
('TC-INPUT-003','FEAT-INPUT-001','RISK-008','Input','Touch interaction','Physical touch behaves correctly'),
('TC-INPUT-004','FEAT-INPUT-001','RISK-008','Input','Keyboard full flow','Game usable without pointer'),
('TC-UI-001','FEAT-UI-001','RISK-028','UI','Replace active mode','Confirmation prevents accidental loss'),
('TC-UI-002','FEAT-UI-001','RISK-013','UI','Tutorial pages all modes','Texts/actions correct'),
('TC-UI-STAT-001','FEAT-UI-002','RISK-026','UI','Large statistics','No overflow/invalid average'),
('TC-UI-HUD-001','FEAT-UI-002','RISK-013','UI','HUD boundary values','Large/negative values remain readable or are sanitized'),
('TC-UI-REPLACE','FEAT-UI-001','RISK-028','UI','Replace active mode','Confirmation prevents accidental active-game loss'),
('TC-SET-002','FEAT-SET-001','RISK-013','Settings','Reset cancel/confirm','Cancel preserves; confirm resets all'),
('TC-AUDIO-001','FEAT-AUDIO-001','RISK-021','Audio','Sound cues','Audible distinct tap/warn/win'),
('TC-AUDIO-002','FEAT-AUDIO-001','RISK-021','Audio','Sound disabled','No cues play when sound is off'),
('TC-AUDIO-003','FEAT-AUDIO-001','RISK-021','Audio','Audio during pause','Audio is suspended while paused/backgrounded'),
('TC-LOC-001','FEAT-LOC-001','RISK-022','Localization','English runtime','All UI switches to English'),
('TC-LOC-002','FEAT-LOC-001','RISK-022','Localization','Long English text','No clipping'),
('TC-LOC-003','FEAT-LOC-001','RISK-022','Localization','Raw keys and mixed language','No untranslated keys or mixed RU/EN strings'),
('TC-PLAT-001','FEAT-PLAT-001','RISK-019','Platform','Loading ready','ready called at correct time'),
('TC-PLAT-002','FEAT-PLAT-001','RISK-019','Platform','Gameplay start/stop','Signals match active play'),
('TC-PLAT-003','FEAT-PLAT-001','RISK-030','Platform','SDK unavailable','Local gameplay remains functional'),
('TC-PLAT-004','FEAT-PLAT-001','RISK-019','Platform','Platform pause/resume','Platform callbacks pause and resume exactly once'),
('TC-PERF-001','FEAT-CORE-001','RISK-017','Performance','Cold launch and puzzle time','Measure on low-end device'),
('TC-PERF-002','FEAT-STATE-001','RISK-018','Performance','60-minute session','No memory growth/hang'),
('TC-WIN-002','FEAT-CORE-006','RISK-007','Completion','Full incorrect board','Errors modal appears and victory is not recorded'),
('TC-RC-001','FEAT-UI-001','RISK-001','Release','Clean package','All referenced files exist and launch'),
]
for id,feat,risk,module,title,exp in more:
    status='BLOCKED' if id.startswith(('TC-CLOUD','TC-PLAT')) or id in ('TC-HINT-003','TC-INPUT-003','TC-AUDIO-001','TC-PERF-001','TC-PERF-002') else 'NOT_RUN'
    actual='Blocked: requires Yandex platform/physical device or unavailable measurement environment' if status=='BLOCKED' else 'Not executed'
    tc(id,feat,risk,module,title,title,'Relevant state prepared','See title','1. Prepare stated condition. 2. Execute action. 3. Observe logs/UI/state.',exp,actual,status,'P1' if status=='BLOCKED' else 'P2','Functional','Scenario')

# markdown and csv
md='# 10 — Test Cases\n\nStatuses represent this execution only. `PASS` means the listed observable result was performed; unexecuted tests remain `NOT_RUN` or `BLOCKED`.\n\n'+table(fields,TC)
w('10_TEST_CASES.md',md)
with (QA/'10_TEST_CASES.csv').open('w',newline='',encoding='utf-8-sig') as f:
    cw=csv.writer(f); cw.writerow(fields); cw.writerows(TC)

# Checklists
checklists={
'CHK-01_Installation_And_First_Launch.md':[
('001','Основные HTML/CSS/JS присутствуют','Files supplied','App package contains required files','P0','BVT','PASS','Syntax/DOM initialized','', 'evidence/BVT-001_initial_menu.png'),
('002','Referenced icon exists','Release package','Icon request resolves','P2','Packaging','BLOCKED','Icon absent from supplied artifact; package completeness unknown','','logs/build.log'),
('003','Чистый первый запуск','Fresh storage','Menu opens without error','P0','Smoke','PASS','QA bundle runtime','','evidence/BVT-001_initial_menu.png'),
('004','Повторный запуск','Active game saved','Continue appears','P0','Recovery','PASS','Simulated clean document with preserved storage','','logs/tests.log'),
('005','Запуск с поврежденной конфигурацией','Corrupt storage','Defaults loaded safely','P1','Negative','NOT_RUN','','',''),
('006','Корректное закрытие/pagehide','Active game','State saved','P1','Lifecycle','NOT_RUN','','',''),
],
'CHK-02_Main_Menu_And_Navigation.md':[
('001','Play открывает выбор режима','Menu','Mode select visible','P0','Smoke','PASS','','','evidence/TC-UI-LEVELS_desktop.png'),
('002','Отображаются четыре режима','Mode select','4 correct cards','P0','Functional','PASS','4 cards','','logs/run.log'),
('003','Back возвращает на предыдущий экран','Levels/Game','Correct previous screen','P1','Navigation','NOT_RUN','','',''),
('004','Continue видна только при active save','Saved/clean states','Visibility matches state','P0','State','PASS','','','logs/tests.log'),
('005','Быстрые двойные клики не создают две игры','Mode select','Single transition','P1','Negative','NOT_RUN','','',''),
('006','Statistics/Achievements открываются','Menu','Modal shows current data','P2','Functional','NOT_RUN','','',''),
],
'CHK-03_Core_Gameplay.md':[
('001','Каждый режим создаёт нужный размер/givens','Mode select','Configured board','P0','Smoke','PASS','All 4 modes','','logs/tests.log'),
('002','Correct value accepted','Active game','Stored; no mistake','P0','Positive','PASS','','',''),
('003','Wrong value handled','autoCheck on','Stored/error/mistake +1','P0','Negative','PASS','','',''),
('004','Given cell cannot change','Active game','Value unchanged and feedback','P1','Negative','NOT_RUN','','',''),
('005','Notes add/remove candidates','Notes on','Candidates update','P1','Functional','PASS','[1,2] stored','','logs/run.log'),
('006','Undo reverts last action','History exists','Visible control restores state','P1','State','FAIL','Control hidden','BUG-001','evidence/BUG-001_tools_without_undo.png'),
('007','Full solution triggers victory','Solved state','Victory/save/stats','P0','Critical path','PASS','Debug helper used','','evidence/WIN_classic_result.png'),
],
'CHK-04_Controls_And_Input.md':[
('001','Mouse selects cell and number','Active game','Move applied','P0','Input','PASS','','',''),
('002','Arrow keys move selection','Cell focused','Expected cell selected','P1','Keyboard','PASS','','','logs/tests.log'),
('003','1–9 input obeys mode size','Active game','Allowed values only','P1','Boundary','NOT_RUN','','',''),
('004','Delete/Backspace/0 erase','Editable filled cell','Cell cleared','P1','Keyboard','NOT_RUN','','',''),
('005','N toggles notes','Active game','aria-pressed changes','P1','Keyboard','NOT_RUN','','',''),
('006','Touch on physical device','Mobile device','No missed/double taps','P1','Touch','BLOCKED','No physical device','',''),
('007','Controller','N/A','No controller support declared','P3','Controller','NOT_APPLICABLE','No controller handlers','',''),
],
'CHK-05_UI_And_HUD.md':[
('001','Timer/mistakes/hints/progress visible','Game','Correct labels/values','P0','UI','PASS','','','evidence/TC-CORE-mini_mobile.png'),
('002','Progress uses correct cells','Correct/wrong input','Only correct increases','P1','UI','PASS','Observed correct calculation via code/runtime','',''),
('003','Large numbers/text do not overflow','Injected boundaries','Readable HUD','P2','Boundary','NOT_RUN','','',''),
('004','Focus indicator visible','Keyboard','Visible outline','P1','Accessibility','PASS','CSS focus-visible and runtime keyboard','',''),
('005','Status feedback accessible','Wrong move','aria-live announced','P1','Accessibility','FAIL','display:none removes live region','BUG-002','logs/tests.log'),
],
'CHK-06_Game_States.md':[
('001','Menu/levels/game transitions','Fresh build','Correct screen state','P0','State','PASS','','',''),
('002','User pause freezes interaction','Active game','Modal/inert/pause','P0','State','PASS','','',''),
('003','Escape resumes from pause','Pause modal','Returns to game','P1','Keyboard','PASS','','',''),
('004','Blur/visibility pause','Real browser','Timer/save correct','P1','Lifecycle','NOT_RUN','','',''),
('005','Nested pause reasons','Modal + blur','Resume only after all cleared','P1','State','NOT_RUN','','',''),
('006','Lose state','N/A','No lose state by design','P3','State','NOT_APPLICABLE','Errors are recoverable','',''),
],
'CHK-07_Levels_And_Progression.md':[
('001','Diagonal rules/42 givens','Start diagonal','Correct config','P0','Mode','PASS','','',''),
('002','Irregular regions/43 givens','Start irregular','Correct config','P0','Mode','PASS','','',''),
('003','Classic/44 givens','Start classic','Correct config','P0','Mode','PASS','','',''),
('004','Mini 6x6/24 givens','Start mini','Correct config','P0','Mode','PASS','','',''),
('005','200 generated puzzles unique','Debug self-test','0 failures','P0','Algorithm','PASS','200/200','','logs/tests.log'),
('006','All-modes achievement','4 completed games','Unlocks once','P2','Progression','NOT_RUN','','',''),
],
'CHK-08_Win_Lose_And_Restart.md':[
('001','Solved board victory','Solution state','Victory modal','P0','Win','PASS','Debug transition','',''),
('002','Full wrong board rejected','Full incorrect board','Errors modal, no win','P0','Negative','NOT_RUN','','',''),
('003','New grid confirmation','Active game','Cancel/replace correct','P1','Restart','NOT_RUN','','',''),
('004','Restart resets board counters','Confirmed new grid','New puzzle state','P1','Restart','NOT_RUN','','',''),
('005','Separate loss condition','N/A','None expected','P3','Lose','NOT_APPLICABLE','No loss design','',''),
],
'CHK-09_Save_Load_And_Persistence.md':[
('001','First active save created','Start game','Storage active populated','P0','Save','PASS','','',''),
('002','Reload/Continue restores board','Saved game','Exact values restored','P0','Load','PASS','','','logs/tests.log'),
('003','Notes/counters selected cell persist','Saved game','Exact state restored','P1','Load','PASS','Notes [1,2] restored','','logs/run.log'),
('004','Missing save defaults','Fresh storage','No Continue/defaults','P1','Negative','NOT_RUN','','',''),
('005','Corrupt save sanitized','Invalid JSON/schema','No crash/safe defaults','P0','Negative','NOT_RUN','','',''),
('006','Cloud save/load','Yandex player','Cross-device persistence','P0','Platform','BLOCKED','No platform SDK','',''),
],
'CHK-10_Settings.md':[
('001','Default toggles true','Fresh storage','sound/autoCheck/highlight on','P1','Settings','PASS','Static/default + runtime','',''),
('002','Highlight persists','Set off/restart','Remains off','P1','Persistence','PASS','','','logs/tests.log'),
('003','Sound off applies','Toggle off','No future tones and saved','P1','Audio','PASS','Persistence only; audibility not measured','','logs/run.log'),
('004','autoCheck affects mistakes','On/off matrix','Expected behavior','P1','Decision table','NOT_RUN','','',''),
('005','Reset cancel/confirm','Settings','Correct destructive confirmation','P1','Recovery','NOT_RUN','','',''),
],
'CHK-11_Audio.md':[
('001','Tap/warn/win tones','Physical audio','Distinct audible cues','P2','Audio','BLOCKED','Headless no audio verification','',''),
('002','Sound off suppresses cues','Setting off','Silence','P2','Audio','BLOCKED','','',''),
('003','Pause/blur suspends AudioContext','Real browser','No sound in background','P2','Lifecycle','BLOCKED','','',''),
('004','Music','N/A','No music implemented','P3','Audio','NOT_APPLICABLE','Only synthesized cues','',''),
],
'CHK-12_Graphics_And_Animation.md':[
('001','No missing board/UI graphics','Test viewports','Controls render','P1','Visual','PASS','Screenshots reviewed','','evidence/mobile-390x844.png'),
('002','Mode region/diagonal styling visible','Modes','Rules visually distinguishable','P1','Visual','PASS','Desktop mode and boards observed','',''),
('003','Focus/selected/error states distinct','Interactions','State visible','P1','Visual','PASS','','',''),
('004','Animation transitions no artifacts','Interactions','No stuck transition','P2','Visual','NOT_RUN','','',''),
('005','Referenced favicon present','Release package','No missing asset','P3','Packaging','BLOCKED','Not provided','','logs/build.log'),
],
'CHK-13_Physics_And_Collisions.md':[
('001','Physics/collisions','N/A','No physics system','P3','N/A','NOT_APPLICABLE','Sudoku DOM game','',''),
],
'CHK-14_Performance_And_Stability.md':[
('001','Generator 200-puzzle self-test','QA runtime','No errors','P0','Algorithm','PASS','72 ms in this environment; not product SLA','','logs/tests.log'),
('002','Cold launch time','Real served build','Measured value','P1','Performance','BLOCKED','Network navigation blocked','',''),
('003','Long session memory','60 min','No material growth','P1','Stability','BLOCKED','Not executed','',''),
('004','Repeated restarts','50 cycles','No hang/leak','P1','Stability','NOT_RUN','','',''),
('005','Console/page errors','Executed flows','No errors','P1','Stability','PASS','None observed in QA bundle','','logs/run.log'),
],
'CHK-15_Compatibility.md':[
('001','Chromium 144 desktop 1440x900','QA runtime','Critical UI works','P0','Browser','PASS','','',''),
('002','390x844 touch emulation','Mobile emulation','No overflow','P1','Responsive','PASS','','','evidence/mobile-390x844.png'),
('003','320x568 boundary','Small emulation','No overflow','P1','Responsive','PASS','','','evidence/small-320x568.png'),
('004','800x600','Tablet viewport','No overflow','P1','Responsive','PASS','','','evidence/tablet-800x600.png'),
('005','Firefox/Safari/Edge','Physical browsers','Critical path works','P1','Browser','NOT_RUN','','',''),
('006','Fullscreen/resize/OS scaling','Real browser','Stable layout','P2','Window','NOT_RUN','','',''),
],
'CHK-16_Accessibility.md':[
('001','Keyboard cell navigation','Active game','Arrows work','P0','Keyboard','PASS','','',''),
('002','Visible focus','Keyboard','Focus ring visible','P1','Focus','PASS','','',''),
('003','Modal focus trap/initial focus','Open pause','Focus contained','P1','Focus','PASS','Initial focus verified; full trap partially static-reviewed','',''),
('004','Live feedback exposed','Trigger message','Screen reader can perceive','P0','Screen reader','FAIL','display:none','BUG-002','logs/tests.log'),
('005','Text contrast/size measured','All states','Meets chosen target','P1','Visual','NOT_RUN','','',''),
('006','Critical info not color-only','Errors/progress','Text/ARIA alternative','P1','Perceivable','NOT_RUN','Partially reviewed statically; complete check not executed','',''),
('007','Screen reader on NVDA/VoiceOver','Physical AT','Playable flow','P0','AT','BLOCKED','AT unavailable','',''),
],
'CHK-17_Localization.md':[
('001','RU default strings','Local runtime','Russian UI','P1','Localization','PASS','','',''),
('002','EN via Yandex language','Platform runtime','English UI','P1','Localization','BLOCKED','SDK language unavailable','',''),
('003','No raw keys/mixed strings','RU/EN flows','No fallback keys','P1','Localization','NOT_RUN','','',''),
('004','Long English text fits viewports','EN + mobile','No clipping','P2','Localization','NOT_RUN','','',''),
],
'CHK-18_Negative_And_Recovery.md':[
('001','Wrong digit','autoCheck on','Recoverable error','P0','Negative','PASS','','',''),
('002','Given cell edit attempt','Given selected','No change','P1','Negative','NOT_RUN','','',''),
('003','Corrupt storage','Bad JSON/data','Safe defaults','P0','Recovery','NOT_RUN','','',''),
('004','SDK absent','Local QA runtime','Core works','P0','Recovery','PASS','SDK skipped in QA bundle; code handles absence','',''),
('005','Ad error/close without reward','Platform','No duplicate reward/stuck pause','P1','Recovery','BLOCKED','','',''),
('006','Rapid/invalid order','Chaos charter','No soft lock','P1','Exploratory','NOT_RUN','','',''),
],
'CHK-19_Long_Session.md':[
('001','60-minute active session','Real browser','Stable timer/input/memory','P1','Soak','BLOCKED','Not executed','',''),
('002','50 pause/resume cycles','Active game','No stuck pause','P1','Soak','NOT_RUN','','',''),
('003','50 new-puzzle cycles','Active game','No generation failure','P1','Soak','NOT_RUN','','',''),
('004','History >80 actions','Active game','Caps at 80 and stable','P2','Boundary','NOT_RUN','','',''),
],
'CHK-20_Release_Candidate.md':[
('001','Release package complete','RC archive','All referenced assets','P0','RC','BLOCKED','Full archive not supplied','',''),
('002','BVT/smoke pass','RC build','No critical fail','P0','RC','PASS','QA bundle only','',''),
('003','No S1/S2','Bug list','Zero open S1/S2','P0','RC','PASS','2 confirmed S3','',''),
('004','Yandex preview smoke','Platform','SDK/cloud/ad verified','P0','RC','BLOCKED','','',''),
('005','Critical path manually solved','RC','Natural full solve','P0','RC','NOT_RUN','Victory transition used debug helper','',''),
('006','Known issues accepted','Release owner','Explicit decision','P0','RC','NOT_RUN','','',''),
]
}

for fn, rows in checklists.items():
    title=fn.replace('.md','').replace('_',' ')
    w('checklists/'+fn, f'# {title}\n\nBuild: `{BUILD}`\n\n'+table(['Check ID','Проверка','Предусловие','Ожидаемый результат','Priority','Type','Status','Комментарий','Bug','Evidence'],[[fn[:6]+'-'+r[0],*r[1:]] for r in rows]))

summary=[]
for fn,rows in checklists.items():
    counts={s:sum(1 for r in rows if r[6]==s) for s in ['PASS','FAIL','BLOCKED','NOT_RUN','NOT_APPLICABLE']}
    summary.append((fn,len(rows),', '.join(f'{k}:{v}' for k,v in counts.items() if v)))
w('09_MASTER_CHECKLIST.md','# 09 — Master Checklist\n\n'+table(['Checklist','Checks','Current status counts'],summary)+'\n\nAll individual checks are in `QA/checklists/`.')

w('11_SMOKE_SUITE.md','''# 11 — Smoke Suite

| Order | Test | Current result |
|---:|---|---|
| 1 | BVT-001 initial launch | PASS |
| 2 | Mode cards available | PASS |
| 3 | Start each mode configuration | PASS |
| 4 | Correct/wrong input | PASS |
| 5 | Pause/resume | PASS |
| 6 | Save/continue | PASS |
| 7 | Victory transition | PASS with debug-helper limitation |
| 8 | Close/page lifecycle | NOT_RUN |
| 9 | Yandex ready/cloud/ad | BLOCKED |

Smoke passes for the isolated browser logic. Platform smoke is not passed because it was not executed.
''')

w('12_REGRESSION_SUITE.md','''# 12 — Regression Suite

## Critical Regression

Run after any gameplay, generator, save or release change: BVT-001, TC-GEN-001, TC-MODE-DIAGONAL, TC-MODE-IRREGULAR, TC-MODE-CLASSIC, TC-MODE-MINI, TC-CORE-001, TC-CORE-002, TC-SAVE-001, TC-WIN-001. Estimated effort: small (minutes) in automated QA runtime, plus one natural manual solve before release.

## Core Regression

Critical + notes, hints, pause, input, settings, mode replacement, reset. Run before every test build or after shared-state changes.

## Extended Regression

Core + responsive viewports, localization, accessibility, audio, corrupt save and SDK failure paths. Run before release candidate.

## Full Regression

All test cases, platform preview, browser/device matrix, long-session charter and all known-bug retests. Run before public release or major refactor.

Criteria: no failed critical tests; failures have accepted risk; all blocked platform tests resolved for public release.
''')

charters=[]
charter_names=[
('EXP-001','Первый запуск новым игроком','Menu/tutorial/first move','discoverability, unclear rules'),
('EXP-002','Полный основной цикл','mode to victory','soft lock, wrong stats'),
('EXP-003','Быстрый хаотичный ввод','board/tools','double actions, race'),
('EXP-004','Неверный порядок действий','modals/navigation','state corruption'),
('EXP-005','Границы игрового пространства','responsive board','clipping/unreachable controls'),
('EXP-006','Переходы состояний','menu/levels/game/modals','stuck screen'),
('EXP-007','Pause, Alt+Tab, return','lifecycle','timer/save/audio'),
('EXP-008','Многократный restart','generator/save','hang/repeated seed'),
('EXP-009','Длительная сессия','60 minutes','memory/timer drift'),
('EXP-010','Минимумы/максимумы','0 hints/large stats','overflow/negative'),
('EXP-011','Сохранение/восстановление','local/cloud','data loss'),
('EXP-012','Слабая обратная связь','all actions','unclear state'),
('EXP-013','Доступность интерфейса','keyboard/AT','hidden info/focus'),
('EXP-014','Самая тяжёлая сцена','9x9/restarts','slow frames/generation'),
('EXP-015','Soft-lock hunt','all modes','cannot progress/recover'),
]
for id,name,scope,risk in charter_names:
    charters.append((id,name,scope,risk,'Too fast/slow; repeat; zero/max; cancel; interrupt; wrong order; simultaneous actions','20–30 min','Fresh and active saves; corrupt values as relevant','NOT_EXECUTED','None confirmed by this charter','See Open Questions','Run in future session'))
w('13_EXPLORATORY_TEST_CHARTERS.md','# 13 — Exploratory Test Charters\n\n'+table(['Charter ID','Goal','Scope','Risks','Ideas','Timebox','Data','Observations','Problems','Questions','Conclusion'],charters))

bugs=[
['BUG-001','Undo control remains permanently hidden after moves','CONFIRMED','Gameplay UI',BUILD,'Chromium 144; 1440x900','Active puzzle; at least one history item','1. Start Classic. 2. Enter any value. 3. Observe tools panel and DOM state of #undoButton.','`#undoButton` is enabled (`disabled=false`) but not visible; computed `display:none`.','Undo should be visible/enabled after an action because the control, translation, handler and history logic exist.','3/3','S3 — Major','P1','Player cannot revert an accidental entry using the implemented function.','Erase individual cell; cannot restore notes/counters atomically.','Unknown','TC-CORE-UNDO','FEAT-CORE-005','evidence/BUG-001_tools_without_undo.png','logs/tests.log','CSS has global `#undoButton { display: none; }` and no override.','style.css around #undoButton','High'],
['BUG-002','aria-live gameplay feedback is removed from accessibility tree by display:none','CONFIRMED','Accessibility/UI',BUILD,'Chromium 144; desktop/mobile emulation','Active game','1. Inspect `#tipText` (`aria-live=polite`). 2. Trigger a correct/wrong/notes action. 3. Check computed style.','Computed display is `none` at tested viewports; changing text is not exposed as a live region.','The live region should remain visually hidden but rendered so assistive technologies can announce gameplay feedback.','3/3','S3 — Major','P1','Screen-reader users may miss given-cell, mistake, notes, hint and recovery messages.','Some cell aria labels expose value/error, but not all feedback.','Unknown','TC-ACC-001','FEAT-ACC-001','','logs/tests.log','Base `.tip-text { display:none; }`; media rules add visually-hidden properties but never restore display.','style.css `.tip-text` and responsive sections','High'],
]
bug_fields=['Bug ID','Title','Confirmation','Component','Build','Environment','Preconditions','Steps','Actual','Expected','Frequency','Severity','Priority','Player impact','Workaround','Regression/new','Related tests','Features','Evidence','Logs','Additional','Suspected code','Cause confidence']
w('14_BUG_REPORTS.md','# 14 — Bug Reports\n\n## Confirmed defects\n\n'+table(bug_fields,bugs)+'''\n\n## Potential Defects Requiring Runtime Confirmation\n\n| ID | Potential issue | Evidence | Required confirmation |
|---|---|---|---|
| POT-001 | Referenced `icons/icon_512x512.png` is missing from supplied artifact | HTML reference + filesystem check | Check full repository/release archive and HTTP 200 |
| POT-002 | Cloud conflict may prefer a device with a later incorrect system clock because merge uses `updatedAt` | `mergeCloudData` | Two-device clock-skew test |
| POT-003 | v1 active-save migration may reject boards that do not match rebuilt puzzle | migration code | Real v1 fixtures |
| POT-004 | SDK errors are swallowed, reducing production diagnosability | empty catches | Platform preview with forced failures |
''')
with (QA/'14_BUG_REPORTS.csv').open('w',newline='',encoding='utf-8-sig') as f:
    cw=csv.writer(f); cw.writerow(bug_fields); cw.writerows(bugs)

w('15_ACCESSIBILITY_REPORT.md','''# 15 — Accessibility Report

This is a technical review, not a claim that the game is accessible to a particular disability group or WCAG-conformant.

| Area | Applicability | Result | Evidence | Impact | Recommendation | Effort | Solo priority |
|---|---|---|---|---|---|---|---|
| Keyboard board navigation | Yes | PASS | Arrow test | Supports non-pointer input | Document keys in tutorial | Low | High |
| Visible focus | Yes | PASS | CSS/runtime | Discoverable focus | Preserve in all themes | Low | High |
| Modal focus/inert | Yes | PASS/PARTIAL | initial focus + code | Prevents background focus | Test full tab loop with screen reader | Low | High |
| Live feedback | Yes | FAIL | BUG-002 | Important messages missed | Replace display:none with standard visually-hidden class | Low | Critical quick win |
| Undo/recovery | Yes | FAIL | BUG-001 | Harder correction | Expose Undo or remove feature intentionally | Low | High |
| Text size/scaling | Yes | PARTIAL | responsive screenshots | Small labels may challenge low vision | Add user text scaling and test 200% | Medium | Medium |
| Contrast | Yes | NOT_TESTED | no measured matrix | Potential low-contrast chips/secondary text | Automated + manual contrast audit | Low | High |
| Color-only information | Yes | PARTIAL | text/ARIA exists for errors; region color supported by borders | Irregular regions may be harder | Verify borders in all states and high contrast | Medium | Medium |
| Audio controls | Yes | PASS static | sound toggle | Can silence cues | Add volume, not just on/off | Medium | Low |
| Visual equivalents for audio | Yes | PASS/PARTIAL | HUD/status messages | Cues not sole source | Fix live text visibility | Low | High |
| Remapping/one-hand | Yes | NOT_AVAILABLE | no remap | Limits motor access | Add configurable shortcuts only if demand | High | Future |
| Timers/precision | Yes | PASS design | no time limit | Low timing pressure | Keep no forced timing | Low | High |
| Motion/flashes | Yes | PASS static | no flashing/camera | Low photosensitivity risk | Preserve; document if effects added | Low | Medium |
| Screen-reader full flow | Yes | BLOCKED | AT unavailable | Unknown playability | NVDA/Chrome + VoiceOver/Safari sessions | Medium | Release gate |

## Быстрые улучшения

1. Fix `.tip-text` so it is visually hidden but not `display:none`.
2. Restore Undo visibility or explicitly remove it and update documentation.
3. Add keyboard controls to tutorial/help.
4. Measure contrast and test browser zoom 200%.

## Areas impossible to verify here

Actual announcements, touch target behavior on physical device, audio perception, high-contrast/forced-colors, switch control and mobile screen readers.
''')

w('16_PERFORMANCE_AND_COMPATIBILITY.md','''# 16 — Performance and Compatibility

## Recorded measurements

| Scenario | Build/environment | Method | Duration/sample | Result | Limitation |
|---|---|---|---|---|---|
| Generator self-test | QA bundle, Chromium 144 | `lightSudokuSelfTest(50)` | 200 puzzles | 72 ms total, zero problems | Headless high-resource host; not gameplay SLA |
| Responsive 390x844 | Touch emulation | bounding boxes/scroll dimensions | one Mini launch | no document overflow | Emulation, not physical device |
| Responsive 320x568 | Touch emulation | same | one Mini launch | no overflow | same |
| Responsive 800x600 | Browser viewport | same | one Mini launch | no overflow | same |

FPS, frame time, memory, CPU and GPU were not measured and must not be inferred.

## Recommended thresholds (not requirements)

- Interactive menu within ~3 s on target network/device.
- Puzzle generation without noticeable UI freeze; investigate >500 ms on low-end device.
- Stable 60 FPS where platform/browser allows; Sudoku is usable at lower rates but input latency should remain imperceptible.
- No sustained memory growth over a 60-minute session.

## Future matrix

| Configuration | Status |
|---|---|
| Chrome/Edge Windows desktop | NOT_TESTED |
| Firefox desktop | NOT_TESTED |
| Safari macOS/iOS | NOT_TESTED |
| Android Chrome physical phone | NOT_TESTED |
| Yandex embedded desktop/mobile | BLOCKED |
| Fullscreen, resize, OS scaling 125–200% | NOT_TESTED |
| Mouse/keyboard | PARTIAL PASS (synthetic) |
| Touch | PARTIAL PASS (emulated) |
| Controller | NOT_APPLICABLE |
''')

w('17_LOCALIZATION_REPORT.md','''# 17 — Localization Report

## Scope

RU and EN dictionaries are embedded in `game.js`. Russian was exercised in runtime; English was statically reviewed but not activated through Yandex SDK.

| Check | RU | EN | Notes |
|---|---|---|---|
| Main menu/modes | PASS runtime | NOT_RUN | Dictionary complete |
| Gameplay/HUD | PASS runtime | NOT_RUN | Placeholders `{time}`, `{mistakes}` present |
| Tutorials | PASS partial | NOT_RUN | Per-mode custom pages |
| Statistics/achievements | NOT_RUN | NOT_RUN | Static strings exist |
| Aria labels | PASS partial | NOT_RUN | row/column/value/given/notes/error |
| Long mobile text | PASS RU screenshots | NOT_RUN | English could expand |
| Fonts/Cyrillic | PASS | N/A | System font fallback |

## Terminology glossary

| Concept | RU | EN |
|---|---|---|
| Given cell | исходная клетка | given cell |
| Notes | заметки | notes |
| Hint | подсказка | hint |
| Mistake | ошибка | mistake |
| Diagonals | Диагонали | Diagonals |
| Islands | Острова | Islands |
| New grid | Новая сетка | New grid |
| Saved game | Сохранённая партия | Saved game |

Recommendation: run full English flows at 320x568 and 390x844 in Yandex preview, including achievement cards and confirmation dialogs.
''')

# traceability
trace=[]
for f in features:
    fid=f[0]; tests=f[-1]
    req={'FEAT-CORE-001':'REQ-CORE-001','FEAT-CORE-002':'REQ-CORE-002','FEAT-CORE-006':'REQ-CORE-003','FEAT-SAVE-001':'REQ-SAVE-001','FEAT-STATE-001':'REQ-STATE-001','FEAT-CORE-005':'REQ-UI-001','FEAT-ACC-001':'REQ-ACC-001','FEAT-PLAT-001':'REQ-PLAT-001','FEAT-LOC-001':'REQ-LOC-001'}.get(fid,'Context/code oracle')
    risk='; '.join(r[0] for r in risks if fid in r[9] or r[9]=='All') or 'See risk register'
    related=[r for r in TC if r[1]==fid]
    result=', '.join(sorted(set(r[11] for r in related))) if related else 'NOT_RUN'
    bug='; '.join(b[0] for b in bugs if b[17]==fid) or 'None'
    trace.append((fid,req,risk,tests,result,bug,'Open gaps in NOT_RUN/BLOCKED tests'))
headers_trace=['Feature','Requirement/oracle','Risks','Checks/tests','Execution status','Bugs','Residual risk']
w('18_TRACEABILITY_MATRIX.md','# 18 — Traceability Matrix\n\n'+table(headers_trace,trace))
with (QA/'18_TRACEABILITY_MATRIX.csv').open('w',newline='',encoding='utf-8-sig') as f:
    cw=csv.writer(f); cw.writerow(headers_trace); cw.writerows(trace)

# Execution report from TC
counts={s:sum(1 for r in TC if r[11]==s) for s in ['PASS','FAIL','BLOCKED','NOT_RUN','NOT_APPLICABLE']}
executed=counts['PASS']+counts['FAIL']
passrate=round(counts['PASS']/executed*100,1) if executed else 0
w('19_TEST_EXECUTION_REPORT.md',f'''# 19 — Test Execution Report

- Build: `{BUILD}`
- Dates: 2026-07-20
- Environment: `01_TEST_ENVIRONMENT.md`

## Metrics

| Metric | Count |
|---|---:|
| Total test cases | {len(TC)} |
| Passed | {counts['PASS']} |
| Failed | {counts['FAIL']} |
| Blocked | {counts['BLOCKED']} |
| Not Run | {counts['NOT_RUN']} |
| Not Applicable | {counts['NOT_APPLICABLE']} |
| Pass rate among executed | {passrate}% |

Formula: `Passed / (Passed + Failed) × 100`. Blocked and Not Run are intentionally excluded from the pass rate and remain visible.

## Executed coverage

Passed: initial DOM, 200 generator cases, all mode configurations, correct/wrong entry, notes, pause, keyboard arrows, local persistence, setting persistence, victory processing, three responsive boundaries. Failed: Undo visibility and accessible live feedback (represented by one test case; reproduced desktop/mobile).

## Smoke and critical path

Isolated browser smoke: PASS. Victory state transition: PASS using debug solve helper. Natural full manual solve: NOT_RUN. Exact Yandex-host smoke: BLOCKED.

## Defects

- Confirmed: 2.
- S1: 0; S2: 0; S3: 2; S4: 0.
- Priority P1: 2.
- Potential defects: 4.

## Confidence

Moderate for core JavaScript state and responsive Chromium behavior. Low for platform integration, physical mobile/accessibility, long-session stability and release package completeness.

## Recommendations

Fix/review BUG-001 and BUG-002, then run platform preview smoke, corrupt-save tests, English mobile pass, natural manual solve and physical-device session.
''')

w('20_RELEASE_READINESS_REPORT.md','''# 20 — Release Readiness Report

## Verdict: INSUFFICIENT DATA

The isolated game logic starts and the tested core flows are stable. No S1/S2 defects were found. However, public release readiness cannot be established because Yandex SDK/cloud/rewarded-ad behavior, exact served package, natural complete solve, real device/browser coverage and long-session performance were not executed.

## Blocking evidence gaps

- Yandex preview/moderation smoke.
- Real cloud save and rewarded video callbacks.
- Full release archive and referenced icon.
- Natural full solution and full incorrect-board path.
- Physical mobile and screen-reader tests.
- Soak/performance measurement.

## Open confirmed defects

- BUG-001 Undo is inaccessible (S3/P1).
- BUG-002 aria-live feedback is hidden (S3/P1).

## Conditions to change verdict

1. Fix or explicitly accept both P1 issues.
2. Pass Yandex platform smoke including ready/start/stop, Player save/load and rewarded ad.
3. Pass clean install/reload and one natural full puzzle.
4. Verify release package assets.
5. Complete at least critical physical mobile and accessibility checks.

After these, reassess for `CONDITIONAL GO` or `GO` based on remaining S3/S4 and accepted risks.
''')

w('21_SOLO_DEVELOPER_QA_WORKFLOW.md','''# 21 — Solo Developer QA Workflow

## Before each commit

Test changed function, inspect console/state, then one neighbor feature. Run `node --check` and generator self-test for logic changes.

## Before a test build

BVT → smoke → critical path → save/continue → known-issue retests → update changelog.

## Before release

Clean package, platform preview, full smoke, Critical + Core regression, one exploratory charter, natural solve, 30–60 minute session, device/accessibility pass, readiness report and known issues.

## After a bug fix

Reproduce old failure → confirm expected result → local regression → neighboring systems → update bug/status/evidence.

## Minimal impact suites

| Change | Minimum checks |
|---|---|
| UI/CSS | affected view + 320/390/800/1440 + keyboard focus + modal |
| Input | mouse, keyboard, touch emulation, rapid input, pause |
| Generator/rules | 200-seed self-test + each mode + win/wrong board |
| Save | create/load/corrupt/migrate/reset + cloud preview |
| Settings | default/change/restart/reset + dependent behavior |
| Balance/givens/hints | all modes + boundary hints + achievement impact |
| SDK/dependency | local no-SDK + Yandex preview ready/gameplay/cloud/ad |
| Crash fix | exact repro + 20 repetition + neighboring state/save |
| Release | RC checklist + Critical/Core regression + platform/device |

Keep the default daily suite under 10–15 minutes; reserve full regression for release candidates.
''')

w('22_KNOWN_ISSUES.md','''# 22 — Known Issues

| Bug | Severity/Priority | User impact | Workaround | Status |
|---|---|---|---|---|
| BUG-001 Undo control hidden | S3 / P1 | Cannot atomically revert a move | Erase selected cell; notes/counters may require manual recovery | Open |
| BUG-002 Live gameplay feedback hidden from accessibility tree | S3 / P1 | Screen-reader users may miss feedback | Some state is available through cell ARIA/HUD | Open |

Potential defects are intentionally excluded; see `14_BUG_REPORTS.md`.
''')

w('23_QA_CHANGELOG.md',f'''# 23 — QA Changelog

| Date | Build | Changes | Bugs | Verdict |
|---|---|---|---|---|
| {TODAY} | `{BUILD}` | Initial inventory; environment; BVT; 200 generator checks; core/responsive tests; full QA document set | Added BUG-001, BUG-002 | INSUFFICIENT DATA |
''')

questions=[
('Q-001','Undo intentionally hidden?','Determines BUG-001/design','Gameplay UI','Assume unintended','May close valid feature bug','Decide and document; expose or remove code/text'),
('Q-002','What is complete release archive?','Missing icon/manifest','Packaging','Only 3 source files supplied','False package defect or failed release','Provide archive/repository'),
('Q-003','Exact target browsers/devices?','Compatibility scope','Platform','Modern web/Yandex','Unsupported device issues','Define minimum matrix'),
('Q-004','Required accessibility target?','Release criteria','Accessibility','Best-effort WCAG 2.2/XAG','Under/over-testing','Choose target and AT matrix'),
('Q-005','Cloud conflict policy?','Data loss risk','Save','Latest updatedAt wins','Clock skew can overwrite','Define deterministic conflict policy'),
('Q-006','Can old v1 fixtures be provided?','Migration verification','Save','Migration intended','Legacy users may lose active game','Supply anonymized fixtures'),
('Q-007','Is rewarded ad mandatory for hints?','Offline behavior','Ads','No SDK gives no extra hints','Poor offline experience','Confirm fallback design'),
]
w('24_OPEN_QUESTIONS.md','# 24 — Open Questions\n\n'+table(['ID','Question','Why important','Component','Current assumption','Risk','Recommended resolution'],questions))

w('25_SOURCES.md','# 25 — Sources\n\n'+sources)

# Final PROGRESS update
w('PROGRESS.md',f'''# QA Progress

- Date: {TODAY}
- Status: DOCUMENTATION_COMPLETE / PLATFORM_TESTS_BLOCKED

## Completed

- Safe source inventory and environment capture.
- JS syntax/build verification.
- Chromium QA runtime without source modifications.
- 200 deterministic generator checks across four modes.
- Core input, notes, pause, persistence, settings, victory transition and responsive checks.
- Full requested QA document structure, 20 checklists, test cases CSV, bug CSV and traceability CSV.
- Two confirmed defects and four potential defects separated correctly.

## In progress / remaining

- Yandex platform preview and exact served package.
- Physical browser/mobile, audio, screen reader and long-session testing.
- Natural full puzzle solve and extended negative suite.

## Limitations

Chromium URL navigation and local server were blocked by managed environment policy. Dynamic tests used unchanged source copies combined into `QA/work/runtime/bundle.html` and an in-memory localStorage shim. No game source file was modified.

## Created files

All `QA/00`–`QA/25` documents, `QA/checklists/*`, CSVs, evidence, logs and QA work scripts.

## Actual execution summary

See `19_TEST_EXECUTION_REPORT.md`. Confirmed defects: BUG-001 and BUG-002. Current release verdict: `INSUFFICIENT DATA`.
''')

print('Generated', len(list(QA.rglob('*'))), 'QA paths')
