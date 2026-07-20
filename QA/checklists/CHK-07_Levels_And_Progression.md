# CHK-07 Levels And Progression

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-07-001 | Diagonal rules/42 givens | Start diagonal | Correct config | P0 | Mode | PASS |  |  |  |
| CHK-07-002 | Irregular regions/43 givens | Start irregular | Correct config | P0 | Mode | PASS |  |  |  |
| CHK-07-003 | Classic/44 givens | Start classic | Correct config | P0 | Mode | PASS |  |  |  |
| CHK-07-004 | Mini 6x6/24 givens | Start mini | Correct config | P0 | Mode | PASS |  |  |  |
| CHK-07-005 | 200 generated puzzles unique | Debug self-test | 0 failures | P0 | Algorithm | PASS | 200/200 |  | logs/tests.log |
| CHK-07-006 | All-modes achievement | 4 completed games | Unlocks once | P2 | Progression | NOT_RUN |  |  |  |
