# CHK-14 Performance And Stability

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-14-001 | Generator 200-puzzle self-test | QA runtime | No errors | P0 | Algorithm | PASS | 72 ms in this environment; not product SLA |  | logs/tests.log |
| CHK-14-002 | Cold launch time | Real served build | Measured value | P1 | Performance | BLOCKED | Network navigation blocked |  |  |
| CHK-14-003 | Long session memory | 60 min | No material growth | P1 | Stability | BLOCKED | Not executed |  |  |
| CHK-14-004 | Repeated restarts | 50 cycles | No hang/leak | P1 | Stability | NOT_RUN |  |  |  |
| CHK-14-005 | Console/page errors | Executed flows | No errors | P1 | Stability | PASS | None observed in QA bundle |  | logs/run.log |
