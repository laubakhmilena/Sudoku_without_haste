# CHK-04 Controls And Input

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-04-001 | Mouse selects cell and number | Active game | Move applied | P0 | Input | PASS |  |  |  |
| CHK-04-002 | Arrow keys move selection | Cell focused | Expected cell selected | P1 | Keyboard | PASS |  |  | logs/tests.log |
| CHK-04-003 | 1–9 input obeys mode size | Active game | Allowed values only | P1 | Boundary | NOT_RUN |  |  |  |
| CHK-04-004 | Delete/Backspace/0 erase | Editable filled cell | Cell cleared | P1 | Keyboard | NOT_RUN |  |  |  |
| CHK-04-005 | N toggles notes | Active game | aria-pressed changes | P1 | Keyboard | NOT_RUN |  |  |  |
| CHK-04-006 | Touch on physical device | Mobile device | No missed/double taps | P1 | Touch | BLOCKED | No physical device |  |  |
| CHK-04-007 | Controller | N/A | No controller support declared | P3 | Controller | NOT_APPLICABLE | No controller handlers |  |  |
