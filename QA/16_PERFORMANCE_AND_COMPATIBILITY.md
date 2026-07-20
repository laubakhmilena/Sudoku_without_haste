# 16 — Performance and Compatibility

## Recorded measurements

| Scenario | Build/environment | Method | Duration/sample | Result | Limitation |
|---|---|---|---|---|---|
| Generator self-test | QA bundle, Chromium 144 | `lightSudokuSelfTest(50)` | 200 puzzles | 72 ms total, zero problems | Headless high-resource host; not gameplay SLA |
| Responsive 390x844 | Touch emulation | bounding boxes/scroll dimensions | one Mini launch | no document overflow | Emulation, not physical device |
| Responsive 320x568 | Touch emulation | same | one Mini launch | no overflow | same |
| Responsive 800x600 | Browser viewport | same | one Mini launch | no overflow | same |

FPS, frame time, memory, CPU and GPU were not measured and must not be inferred.

## Recommended thresholds (not requirements)

- Interactive menu within ~3 s on target network/device.
- Puzzle generation without noticeable UI freeze; investigate >500 ms on low-end device.
- Stable 60 FPS where platform/browser allows; Sudoku is usable at lower rates but input latency should remain imperceptible.
- No sustained memory growth over a 60-minute session.

## Future matrix

| Configuration | Status |
|---|---|
| Chrome/Edge Windows desktop | NOT_TESTED |
| Firefox desktop | NOT_TESTED |
| Safari macOS/iOS | NOT_TESTED |
| Android Chrome physical phone | NOT_TESTED |
| Yandex embedded desktop/mobile | BLOCKED |
| Fullscreen, resize, OS scaling 125–200% | NOT_TESTED |
| Mouse/keyboard | PARTIAL PASS (synthetic) |
| Touch | PARTIAL PASS (emulated) |
| Controller | NOT_APPLICABLE |
