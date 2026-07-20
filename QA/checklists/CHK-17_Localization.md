# CHK-17 Localization

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-17-001 | RU default strings | Local runtime | Russian UI | P1 | Localization | PASS |  |  |  |
| CHK-17-002 | EN via Yandex language | Platform runtime | English UI | P1 | Localization | BLOCKED | SDK language unavailable |  |  |
| CHK-17-003 | No raw keys/mixed strings | RU/EN flows | No fallback keys | P1 | Localization | NOT_RUN |  |  |  |
| CHK-17-004 | Long English text fits viewports | EN + mobile | No clipping | P2 | Localization | NOT_RUN |  |  |  |
