# 17 — Localization Report

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
