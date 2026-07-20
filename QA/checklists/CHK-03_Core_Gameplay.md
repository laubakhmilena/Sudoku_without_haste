# CHK-03 Core Gameplay

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-03-001 | Каждый режим создаёт нужный размер/givens | Mode select | Configured board | P0 | Smoke | PASS | All 4 modes |  | logs/tests.log |
| CHK-03-002 | Correct value accepted | Active game | Stored; no mistake | P0 | Positive | PASS |  |  |  |
| CHK-03-003 | Wrong value handled | autoCheck on | Stored/error/mistake +1 | P0 | Negative | PASS |  |  |  |
| CHK-03-004 | Given cell cannot change | Active game | Value unchanged and feedback | P1 | Negative | NOT_RUN |  |  |  |
| CHK-03-005 | Notes add/remove candidates | Notes on | Candidates update | P1 | Functional | PASS | [1,2] stored |  | logs/run.log |
| CHK-03-006 | Undo reverts last action | History exists | Visible control restores state | P1 | State | FAIL | Control hidden | BUG-001 | evidence/BUG-001_tools_without_undo.png |
| CHK-03-007 | Full solution triggers victory | Solved state | Victory/save/stats | P0 | Critical path | PASS | Debug helper used |  | evidence/TC-CORE-WIN_classic.png |
