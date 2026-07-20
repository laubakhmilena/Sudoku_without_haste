# CHK-06 Game States

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-06-001 | Menu/levels/game transitions | Fresh build | Correct screen state | P0 | State | PASS |  |  |  |
| CHK-06-002 | User pause freezes interaction | Active game | Modal/inert/pause | P0 | State | PASS |  |  |  |
| CHK-06-003 | Escape resumes from pause | Pause modal | Returns to game | P1 | Keyboard | PASS |  |  |  |
| CHK-06-004 | Blur/visibility pause | Real browser | Timer/save correct | P1 | Lifecycle | NOT_RUN |  |  |  |
| CHK-06-005 | Nested pause reasons | Modal + blur | Resume only after all cleared | P1 | State | NOT_RUN |  |  |  |
| CHK-06-006 | Lose state | N/A | No lose state by design | P3 | State | NOT_APPLICABLE | Errors are recoverable |  |  |
