# CHK-09 Save Load And Persistence

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-09-001 | First active save created | Start game | Storage active populated | P0 | Save | PASS |  |  |  |
| CHK-09-002 | Reload/Continue restores board | Saved game | Exact values restored | P0 | Load | PASS |  |  | logs/tests.log |
| CHK-09-003 | Notes/counters selected cell persist | Saved game | Exact state restored | P1 | Load | PASS | Notes [1,2] restored |  | logs/run.log |
| CHK-09-004 | Missing save defaults | Fresh storage | No Continue/defaults | P1 | Negative | NOT_RUN |  |  |  |
| CHK-09-005 | Corrupt save sanitized | Invalid JSON/schema | No crash/safe defaults | P0 | Negative | NOT_RUN |  |  |  |
| CHK-09-006 | Cloud save/load | Yandex player | Cross-device persistence | P0 | Platform | BLOCKED | No platform SDK |  |  |
