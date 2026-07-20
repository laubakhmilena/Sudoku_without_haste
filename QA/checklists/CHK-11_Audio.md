# CHK-11 Audio

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-11-001 | Tap/warn/win tones | Physical audio | Distinct audible cues | P2 | Audio | BLOCKED | Headless no audio verification |  |  |
| CHK-11-002 | Sound off suppresses cues | Setting off | Silence | P2 | Audio | BLOCKED |  |  |  |
| CHK-11-003 | Pause/blur suspends AudioContext | Real browser | No sound in background | P2 | Lifecycle | BLOCKED |  |  |  |
| CHK-11-004 | Music | N/A | No music implemented | P3 | Audio | NOT_APPLICABLE | Only synthesized cues |  |  |
