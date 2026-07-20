# 03 — Product Overview

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
