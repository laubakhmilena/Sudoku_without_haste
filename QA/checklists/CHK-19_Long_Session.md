# CHK-19 Long Session

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-19-001 | 60-minute active session | Real browser | Stable timer/input/memory | P1 | Soak | BLOCKED | Not executed |  |  |
| CHK-19-002 | 50 pause/resume cycles | Active game | No stuck pause | P1 | Soak | NOT_RUN |  |  |  |
| CHK-19-003 | 50 new-puzzle cycles | Active game | No generation failure | P1 | Soak | NOT_RUN |  |  |  |
| CHK-19-004 | History >80 actions | Active game | Caps at 80 and stable | P2 | Boundary | NOT_RUN |  |  |  |
