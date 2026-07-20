# CHK-02 Main Menu And Navigation

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-02-001 | Play открывает выбор режима | Menu | Mode select visible | P0 | Smoke | PASS |  |  | evidence/TC-UI-LEVELS_desktop.png |
| CHK-02-002 | Отображаются четыре режима | Mode select | 4 correct cards | P0 | Functional | PASS | 4 cards |  | logs/run.log |
| CHK-02-003 | Back возвращает на предыдущий экран | Levels/Game | Correct previous screen | P1 | Navigation | NOT_RUN |  |  |  |
| CHK-02-004 | Continue видна только при active save | Saved/clean states | Visibility matches state | P0 | State | PASS |  |  | logs/tests.log |
| CHK-02-005 | Быстрые двойные клики не создают две игры | Mode select | Single transition | P1 | Negative | NOT_RUN |  |  |  |
| CHK-02-006 | Statistics/Achievements открываются | Menu | Modal shows current data | P2 | Functional | NOT_RUN |  |  |  |
