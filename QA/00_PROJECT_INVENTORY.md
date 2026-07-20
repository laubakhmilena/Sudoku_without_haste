# 00 — Project Inventory

- Дата анализа: 2026-07-20
- Проверяемый идентификатор: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`
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

| Параметр | Статус | Вывод | Основание |
|---|---|---|---|
| Название | CONFIRMED | «Судоку без спешки» / Slow Sudoku | index(2).html: title; game(1).js translations |
| Жанр | CONFIRMED | Однопользовательская логическая головоломка Sudoku | modes, rules, puzzle generator |
| Целевая аудитория | INFERRED | Пользователи казуальных логических игр; короткие и спокойные сессии | subtitle, режим Mini, отсутствие тайм-лимита |
| Основной цикл | CONFIRMED | Выбор режима → заполнение клеток → проверка → победа → статистика/новая сетка | showLevelSelect/startMode/enterValue/checkWin |
| Победа | CONFIRMED | Все клетки совпадают с solution | checkWin |
| Поражение | NOT_APPLICABLE | Отдельного состояния поражения нет; ошибки не блокируют продолжение | wrongNumber/errors modal |
| Прогресс | CONFIRMED | Текущая партия, рекорды, статистика, достижения | state.data, local/cloud save |
| Управление | CONFIRMED | Мышь/касание; клавиатура 1–9, 0/Delete/Backspace, N, стрелки | bindEvents/handleKey |
| Обучение | CONFIRMED | Трёхшаговый tutorial для каждого режима | showModeTutorialStep |
| Режимы | CONFIRMED | Диагонали, Острова, Классика, Мини 6x6 | modes[] |
| Главное меню | CONFIRMED | Play, Continue, Statistics, Achievements, Settings | index.html/renderMenu |
| Пауза | CONFIRMED | Пользовательская, modal, blur, visibility, platform pause | pausedReasons |
| Настройки | CONFIRMED | Sound, autoCheck, highlight; reset progress | settings modal |
| Сохранения | CONFIRMED | localStorage + Yandex Player.setData/getData | SAVE_KEY, writeCloudData |
| Аудио | CONFIRMED | Синтезированные WebAudio сигналы, музыка отсутствует | playTone |
| Локализация | CONFIRMED | RU и EN | translations |
| Сеть | INFERRED | Только Yandex SDK: player data, ads, platform events | YaGames SDK calls |
| Достижения | CONFIRMED | 5 достижений | achievementDefinitions |
| Реклама | CONFIRMED | Rewarded video для дополнительной подсказки | showRewardedVideo |
| Покупки | NOT_APPLICABLE | Код покупок отсутствует | static search |
| Учётная запись | INFERRED | Опциональный Yandex Player без scopes | getPlayer({scopes:false}) |
| Аналитика | INFERRED | Только LoadingAPI/GamePlayAPI platform signals | markReady/notifyGameplayStart |
| Пользовательский контент/моды | NOT_APPLICABLE | Не обнаружено | static analysis |
| Контроллер | NOT_APPLICABLE | Поддержка не обнаружена | input handlers |
| Сенсорное управление | CONFIRMED | Кнопки и touch-action manipulation | CSS/DOM events |
| Несколько игроков | NOT_APPLICABLE | Не обнаружено | static analysis |

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
