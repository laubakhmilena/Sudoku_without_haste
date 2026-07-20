# 06 — Risk-Based Test Strategy

## Цели

Подтвердить, что игрок может открыть игру, создать корректную задачу, управлять клетками, сохранить/возобновить прогресс и завершить партию без блокирующих ошибок. Вторичная цель — проверить responsive UI, accessibility и Yandex integrations.

## Scope

Включено: gameplay, generator, UI, input, state, local save, settings, localization static review, responsive layouts, SDK code review. Исключено на текущем окружении: moderation, real ads/cloud, physical devices, assistive technology, full browser matrix, real sound/GPU performance.

## Подход для одного разработчика

1. BVT + generator self-test.
2. Critical smoke: menu → mode → input → save → pause → win transition.
3. Targeted checks по изменённой системе.
4. Critical/Core regression.
5. 20–30 минут exploratory charter.
6. Release readiness update.

## Техники

Equivalence partitions (valid/invalid digits), boundary values (0,1,size, full board, 0 hints), state transitions, decision tables (autoCheck/value correctness), pairwise viewport/input/settings, negative/corrupt save, user journeys, error guessing and interruption heuristics.

## Entry criteria

Files complete, JS syntax valid, test build identifier known, no destructive setup, runtime opens.

## Suspension criteria

Startup crash, generator cannot create any critical mode, repeated data loss, environment invalidates observations, test artifacts differ from release files.

## Exit criteria

- BVT and critical smoke executed.
- No open S1/S2 for release decision.
- Critical risks have result or explicit accepted gap.
- Known issues and NOT_RUN are visible.
- Platform integration tested in platform preview before public release.

## Evidence

Screenshots in `QA/evidence`; command output in `QA/logs`; temporary runtime only in `QA/work`. Evidence names include test/bug ID.

## Severity/Priority

Use S1–S4 and P0–P3 from instruction. Severity = player impact; Priority = release/business ordering. Static suspicion is not a confirmed bug.

## Time-limited order

Generator/startup → critical gameplay → save → pause/lifecycle → win → navigation → input → responsive → accessibility → platform → extended negative/performance.


## Методологические и платформенные источники

Проверено 2026-07-20. Источники используются как методическая база; документ **не заявляет соответствие или сертификацию**.

- [ISTQB Certified Tester Foundation Level v4.0.1](https://istqb.org/sdm_downloads/istqb-certified-tester-foundation-level-syllabus-v4-0/) — терминология, риск-ориентированный подход, техники тест-дизайна.
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) — общие понятия тестирования.
- [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/obp/ui/en/) — процессы тестирования.
- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — тестовая документация.
- [Yandex Games SDK](https://yandex.com/dev/games/doc/en/sdk) — назначение и обязательность SDK для публикации.
- [Yandex Games: Player data](https://yandex.com/dev/games/doc/en/sdk/sdk-player) — облачные данные игрока.
- [Yandex Games: Advertising](https://yandex.com/dev/games/doc/en/sdk/sdk-adv) — rewarded video и рекламные callback-и.
- [Yandex Games: Game loading and gameplay markup](https://yandex.com/dev/games/doc/en/sdk/sdk-game-events) — ready/start/stop.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — доступность веб-интерфейса.
- [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines) — игровые accessibility-практики.
