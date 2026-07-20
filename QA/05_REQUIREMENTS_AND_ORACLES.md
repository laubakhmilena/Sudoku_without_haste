# 05 — Requirements and Oracles

## Иерархия oracle

1. Явные тексты интерфейса и tutorial.
2. Согласованное поведение внутри проекта.
3. Код/configuration как фактическая спецификация.
4. Правила Sudoku.
5. Публичные требования Yandex Games.
6. WCAG 2.2/Xbox accessibility best practices.
7. Общепринятые пользовательские ожидания.

| REQ ID | Ожидаемое поведение | Oracle | Уверенность |
|---|---|---|---|
| REQ-CORE-001 | Каждая созданная задача имеет ровно одно решение | `createPuzzle` explicit invariant/self-tests | High |
| REQ-CORE-002 | Given cells нельзя менять | UI message + code | High |
| REQ-CORE-003 | Победа только при полном совпадении с solution | code | High |
| REQ-SAVE-001 | Active game восстанавливается после перезапуска | Continue UI + persistence code | High |
| REQ-STATE-001 | Таймер останавливается на pause/blur/hidden | pause architecture | High |
| REQ-UI-001 | Undo должен быть доступен после хода | control exists, translation, handler, enabled logic | Medium; developer confirmation requested |
| REQ-ACC-001 | Status feedback должно быть доступно assistive technology | `aria-live=polite`, WCAG principles | High |
| REQ-PLAT-001 | SDK signals и saves должны работать на platform | Yandex docs + code | High, runtime unverified |
| REQ-LOC-001 | RU/EN строки не смешиваются и не обрезаются | translations + UI | Medium |

## Неоднозначные требования

- Undo: функция полностью реализована, но control скрыт CSS. Считается дефектом внутренней согласованности до решения разработчика.
- Нет defeat state: считается design choice, а не missing feature.
- Web accessibility: требуемый уровень conformance не задан; отчёт даёт применимые findings без заявления WCAG conformance.


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
