# CHK-01 Installation And First Launch

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-01-001 | Основные HTML/CSS/JS присутствуют | Files supplied | App package contains required files | P0 | BVT | PASS | Syntax/DOM initialized |  | evidence/BVT-001_initial_menu.png |
| CHK-01-002 | Referenced icon exists | Release package | Icon request resolves | P2 | Packaging | BLOCKED | Icon absent from supplied artifact; package completeness unknown |  | logs/build.log |
| CHK-01-003 | Чистый первый запуск | Fresh storage | Menu opens without error | P0 | Smoke | PASS | QA bundle runtime |  | evidence/BVT-001_initial_menu.png |
| CHK-01-004 | Повторный запуск | Active game saved | Continue appears | P0 | Recovery | PASS | Simulated clean document with preserved storage |  | logs/tests.log |
| CHK-01-005 | Запуск с поврежденной конфигурацией | Corrupt storage | Defaults loaded safely | P1 | Negative | NOT_RUN |  |  |  |
| CHK-01-006 | Корректное закрытие/pagehide | Active game | State saved | P1 | Lifecycle | NOT_RUN |  |  |  |
