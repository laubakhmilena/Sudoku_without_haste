# 02 — Build Verification Report

- Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`
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
