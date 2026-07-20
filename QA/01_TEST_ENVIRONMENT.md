# 01 — Test Environment

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
| Build | `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2` |

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
