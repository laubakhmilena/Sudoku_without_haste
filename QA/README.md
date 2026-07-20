# QA — «Судоку без спешки»

## Быстрый старт

1. Откройте `20_RELEASE_READINESS_REPORT.md` — текущий вердикт.
2. Откройте `19_TEST_EXECUTION_REPORT.md` — фактически выполненные проверки и метрики.
3. Откройте `14_BUG_REPORTS.md` — подтверждённые и потенциальные дефекты.
4. Для ежедневной работы используйте `21_SOLO_DEVELOPER_QA_WORKFLOW.md` и `11_SMOKE_SUITE.md`.
5. Полные проверки находятся в `10_TEST_CASES.md/.csv` и `checklists/`.

## Текущий итог

- 56 тест-кейсов: 18 PASS, 2 FAIL, 13 BLOCKED, 23 NOT_RUN.
- Подтверждённые дефекты: BUG-001 (Undo скрыт), BUG-002 (`aria-live` скрыт через `display:none`).
- Release verdict: `INSUFFICIENT DATA` до проверки Yandex SDK, полного релизного пакета, физических устройств и естественного полного прохождения.

Исходный код игры не изменялся. QA runtime и скрипты находятся только в `QA/work`.
