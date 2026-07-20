# CHK-08 Win Lose And Restart

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-08-001 | Solved board victory | Solution state | Victory modal | P0 | Win | PASS | Debug transition |  |  |
| CHK-08-002 | Full wrong board rejected | Full incorrect board | Errors modal, no win | P0 | Negative | NOT_RUN |  |  |  |
| CHK-08-003 | New grid confirmation | Active game | Cancel/replace correct | P1 | Restart | NOT_RUN |  |  |  |
| CHK-08-004 | Restart resets board counters | Confirmed new grid | New puzzle state | P1 | Restart | NOT_RUN |  |  |  |
| CHK-08-005 | Separate loss condition | N/A | None expected | P3 | Lose | NOT_APPLICABLE | No loss design |  |  |
