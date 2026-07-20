# CHK-10 Settings

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-10-001 | Default toggles true | Fresh storage | sound/autoCheck/highlight on | P1 | Settings | PASS | Static/default + runtime |  |  |
| CHK-10-002 | Highlight persists | Set off/restart | Remains off | P1 | Persistence | PASS |  |  | logs/tests.log |
| CHK-10-003 | Sound off applies | Toggle off | No future tones and saved | P1 | Audio | PASS | Persistence only; audibility not measured |  | logs/run.log |
| CHK-10-004 | autoCheck affects mistakes | On/off matrix | Expected behavior | P1 | Decision table | NOT_RUN |  |  |  |
| CHK-10-005 | Reset cancel/confirm | Settings | Correct destructive confirmation | P1 | Recovery | NOT_RUN |  |  |  |
