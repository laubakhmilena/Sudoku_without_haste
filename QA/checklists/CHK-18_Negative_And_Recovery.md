# CHK-18 Negative And Recovery

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-18-001 | Wrong digit | autoCheck on | Recoverable error | P0 | Negative | PASS |  |  |  |
| CHK-18-002 | Given cell edit attempt | Given selected | No change | P1 | Negative | NOT_RUN |  |  |  |
| CHK-18-003 | Corrupt storage | Bad JSON/data | Safe defaults | P0 | Recovery | NOT_RUN |  |  |  |
| CHK-18-004 | SDK absent | Local QA runtime | Core works | P0 | Recovery | PASS | SDK skipped in QA bundle; code handles absence |  |  |
| CHK-18-005 | Ad error/close without reward | Platform | No duplicate reward/stuck pause | P1 | Recovery | BLOCKED |  |  |  |
| CHK-18-006 | Rapid/invalid order | Chaos charter | No soft lock | P1 | Exploratory | NOT_RUN |  |  |  |
