(() => {
  "use strict";

  const SAVE_KEY = "light_sudoku_save_v1";
  const SAVE_VERSION = 2;
  const GENERATOR_VERSION = 2;
  const SDK_SRC = "/sdk.js";
  const FALLBACK_LANGUAGE = "en";
  const SDK_SCRIPT_TIMEOUT_MS = 12000;
  const rngMod = 2147483647;
  const TEXT_SCALE_OPTIONS = ["normal", "large", "xlarge"];
  let currentLanguage = "ru";

  const translations = {
    ru: {
      back: "Назад",
      play: "Играть",
      continue: "Продолжить",
      settings: "Настройки",
      gameTitle: "Судоку без спешки",
      gameTitleLine1: "Судоку",
      gameTitleLine2: "без спешки",
      gameSubtitle: "Спокойная игра для ясного ума и хорошего настроения",
      savedGame: "Сохранённая партия",
      menuSections: "Дополнительные разделы",
      levelEyebrow: "Варианты уровней",
      chooseMode: "Выберите режим",
      levelIntro: "Нет спешки. Есть логика, тишина и удовольствие.",
      currentGame: "Текущая партия",
      noRecord: "без рекорда",
      newPuzzle: "Новая",
      pause: "Пауза",
      hint: "Подсказка",
      adHint: "+1 подсказка за рекламу",
      undo: "Отмена",
      erase: "Стереть",
      notes: "Заметки",
      time: "Время",
      mistakes: "Ошибки",
      hints: "Подсказки",
      progress: "Прогресс",
      statistics: "Статистика",
      achievements: "Достижения",
      modeFallbackTitle: "Судоку",
      modeFallbackChip: "Режим",
      modeFallbackDescription: "Заполните поле числами.",
      tipStart: "Выберите клетку, затем число.",
      numbers: "Цифры",
      gameArea: "Игровое поле",
      sudokuGrid: "Сетка судоку",
      progressAria: "Прогресс решения",
      done: "Готово",
      resetProgress: "Сбросить прогресс",
      sound: "Звуковые сигналы",
      autoCheck: "Проверять ошибки сразу",
      highlight: "Подсвечивать связанные клетки",
      textScale: "Размер текста",
      textScaleNormal: "Обычный",
      textScaleLarge: "Крупный",
      textScaleXLarge: "Очень крупный",
      tutorialButton: "Как играть",
      tutorialTitle: "Обучение",
      tutorialGoal: "Цель",
      tutorialSteps: "Правила режима",
      tutorialTip: "Совет",
      tutorialNext: "Дальше",
      tutorialBack: "Назад",
      tutorialStep: "Шаг {current} из {total}",
      modes: {
        diagonal: {
          title: "Диагонали",
          difficulty: "Сложно",
          description: "Классическая сетка 9x9, но обе диагонали тоже должны содержать числа от 1 до 9.",
          legend: "Обе диагонали также содержат числа 1-9 без повторов.",
          rules: "Как играть: ряды, столбцы и квадраты 3x3 без повторов. Две подсвеченные диагонали тоже должны содержать 1-9.",
          tutorial: "Заполните все клетки числами 1-9. В каждой строке, каждом столбце и каждом квадрате 3x3 число может встретиться только один раз. Главное отличие режима: две большие диагонали тоже работают как отдельные линии без повторов. Сначала ищите числа, которые уже стоят на диагоналях, затем проверяйте обычные строки и столбцы.",
          tags: ["9x9", "диагонали", "фокус"]
        },
        irregular: {
          title: "Острова",
          difficulty: "Выше среднего",
          description: "Вместо квадратов - неровные области. Следите за цветом клетки и привычными рядами.",
          legend: "Толстые границы отделяют острова: внутри каждого числа не повторяются.",
          rules: "Как играть: ряды и столбцы обычные. Вместо квадратов 3x3 - цветные острова, внутри них числа не повторяются.",
          tutorial: "Заполните сетку числами 1-9. Строки и столбцы работают как в обычном судоку. Вместо квадратов 3x3 здесь есть острова: области с толстыми границами и мягким цветом. Внутри каждого острова числа 1-9 не должны повторяться. Смотрите сразу на три вещи: строку, столбец и остров выбранной клетки.",
          tags: ["9x9", "области", "новое"]
        },
        classic: {
          title: "Классика",
          difficulty: "Средне",
          description: "Спокойное судоку 9x9 с рядами, столбцами и квадратами 3x3.",
          legend: "",
          rules: "Как играть: числа 1-9 не повторяются в строке, столбце и каждом квадрате 3x3. Хороший режим для разминки.",
          tutorial: "Заполните поле числами 1-9. Каждая строка, каждый столбец и каждый квадрат 3x3 должны содержать все числа без повторов. Начинайте с рядов и квадратов, где уже много открытых чисел. Если не уверены, включайте заметки и записывайте возможные кандидаты.",
          tags: ["9x9", "классика", "баланс"]
        },
        mini: {
          title: "Мини 6x6",
          difficulty: "Просто",
          description: "Быстрая версия с числами от 1 до 6 и блоками 2x3. Хороша для короткой партии.",
          legend: "",
          rules: "Как играть: числа 1-6 не повторяются в рядах, столбцах и блоках 2x3. Быстрая и простая партия.",
          tutorial: "Это короткий режим 6x6. Используются числа 1-6, а блоки имеют размер 2x3. Правило такое же: число не повторяется в строке, столбце и блоке. Режим хорош для быстрой партии: чаще проверяйте маленькие блоки, там быстрее находятся единственные варианты.",
          tags: ["6x6", "быстро", "легко"]
        }
      },
      messages: {
        continueTitle: "Продолжить партию?",
        continueText: "В этом режиме уже есть сохранённая партия. Можно вернуться к ней или начать новую сетку.",
        replaceTitle: "Заменить партию?",
        replaceText: "При старте другого режима текущая сохранённая партия будет заменена новой.",
        replace: "Заменить",
        stay: "Остаться",
        newGrid: "Новая сетка",
        createErrorTitle: "Не удалось создать поле",
        createErrorText: "Попробуйте начать этот режим ещё раз. Если ошибка повторится, выберите другой вариант судоку.",
        toModes: "К вариантам",
        givenCell: "Это исходная клетка, ее нельзя менять.",
        erased: "Число стерто. Клетка осталась выбранной.",
        wrongNumber: "Это число не подходит для этой клетки. Ошибка сохранена, но партию можно продолжать.",
        goodMove: "Хорошо. Продолжайте искать единственно возможные места.",
        notesOn: "Режим заметок включен. Числа будут записываться мелкими подсказками.",
        notesOff: "Режим заметок выключен.",
        rewardedHint: "Получена дополнительная подсказка. Нажмите кнопку ещё раз, чтобы использовать её.",
        adUnavailable: "Реклама сейчас недоступна. Попробуйте позже.",
        noFreeHints: "Бесплатные подсказки закончились.",
        hintApplied: "Подсказка заполнила одну клетку и убрала это число из связанных заметок.",
        errorsTitle: "Есть ошибки",
        errorsText: "Поле заполнено, но некоторые клетки не совпадают с решением. Исправьте подсвеченные числа.",
        winTitle: "Победа",
        winText: "Готово за {time}. Ошибок: {mistakes}. Можно взять новую сетку или выбрать другой вариант.",
        pauseTitle: "Пауза",
        pauseText: "Партия сохранена. Вернитесь, когда будете готовы продолжить.",
        toMenu: "В меню",
        modeNewTitle: "Начать новую сетку?",
        modeNewText: "Текущая партия этого режима будет заменена.",
        newPuzzleTitle: "Новая сетка",
        newPuzzleText: "Текущая партия будет заменена новой задачей этого же режима.",
        startNew: "Начать новую",
        resetTitle: "Сброс прогресса",
        resetText: "Сбросить все рекорды, настройки и текущую партию?",
        reset: "Сбросить",
        keep: "Оставить",
        ok: "Понятно"
      },
      statsText: {
        modeLine: "{mode}: побед {wins}, лучшее {best}",
        wins: "Побед: {wins}. Среднее время: {average}.",
        clean: "Без ошибок: {perfect}. Без подсказок: {noHints}.",
        empty: "Пока нет завершённых партий.",
        none: "нет"
      },
      achievementsText: {
        firstWin: "Первая победа",
        noMistakes: "Без ошибок",
        noHints: "Без подсказок",
        allModes: "Все режимы",
        fastMini: "Быстрая победа в Мини"
      },
      achievementReceived: "Получено",
      achievementLocked: "Ещё закрыто",
      achievementUnlockedTitle: "Новое достижение",
      achievementRewardPrefix: "Начислено",
      achievementCards: {
        firstWin: {
          title: "Первый тихий триумф",
          description: "Завершите любую сетку до конца.",
          reward: "листок спокойствия"
        },
        noMistakes: {
          title: "Чистая логика",
          description: "Победите без единой ошибки.",
          reward: "золотая отметка точности"
        },
        noHints: {
          title: "Ясная голова",
          description: "Решите сетку без подсказок.",
          reward: "знак самостоятельности"
        },
        allModes: {
          title: "Мастер четырёх путей",
          description: "Победите в Диагоналях, Островах, Классике и Мини.",
          reward: "полная коллекция режимов"
        },
        fastMini: {
          title: "Быстрый рассвет",
          description: "Решите Мини 6x6 за 3 минуты или быстрее.",
          reward: "быстрый кубок Мини"
        }
      },
      aria: {
        row: "Ряд {row}",
        col: "столбец {col}",
        value: "значение {value}",
        empty: "пусто",
        given: "исходная клетка",
        notes: "заметки: {notes}",
        error: "ошибка"
      }
    },
    en: {
      back: "Back",
      play: "Play",
      continue: "Continue",
      settings: "Settings",
      gameTitle: "Slow Sudoku",
      gameTitleLine1: "Slow",
      gameTitleLine2: "Sudoku",
      gameSubtitle: "A calm puzzle game for a clear mind",
      savedGame: "Saved game",
      menuSections: "Extra sections",
      levelEyebrow: "Level variants",
      chooseMode: "Choose a mode",
      levelIntro: "No rush. Just logic, quiet focus and a pleasant puzzle.",
      currentGame: "Current game",
      noRecord: "no record",
      newPuzzle: "New",
      pause: "Pause",
      hint: "Hint",
      adHint: "+1 hint for an ad",
      undo: "Undo",
      erase: "Erase",
      notes: "Notes",
      time: "Time",
      mistakes: "Mistakes",
      hints: "Hints",
      progress: "Progress",
      statistics: "Statistics",
      achievements: "Achievements",
      modeFallbackTitle: "Sudoku",
      modeFallbackChip: "Mode",
      modeFallbackDescription: "Fill the board with numbers.",
      tipStart: "Choose a cell, then a number.",
      numbers: "Numbers",
      gameArea: "Game board",
      sudokuGrid: "Sudoku grid",
      progressAria: "Solving progress",
      done: "Done",
      resetProgress: "Reset progress",
      sound: "Sound cues",
      autoCheck: "Check mistakes instantly",
      highlight: "Highlight related cells",
      textScale: "Text size",
      textScaleNormal: "Default",
      textScaleLarge: "Large",
      textScaleXLarge: "Extra large",
      tutorialButton: "How to play",
      tutorialTitle: "Tutorial",
      tutorialGoal: "Goal",
      tutorialSteps: "Mode rules",
      tutorialTip: "Tip",
      tutorialNext: "Next",
      tutorialBack: "Back",
      tutorialStep: "Step {current} of {total}",
      modes: {
        diagonal: {
          title: "Diagonals",
          difficulty: "Hard",
          description: "A classic 9x9 grid, but both diagonals must also contain numbers 1 to 9.",
          legend: "Both diagonals also contain numbers 1-9 without repeats.",
          rules: "How to play: rows, columns and 3x3 boxes cannot repeat numbers. The two highlighted diagonals must also contain 1-9.",
          tutorial: "Fill every cell with numbers 1-9. Each row, column and 3x3 box may contain each number only once. The special rule: both long diagonals are also no-repeat lines. Check the diagonals first, then confirm the usual row and column limits.",
          tags: ["9x9", "diagonals", "focus"]
        },
        irregular: {
          title: "Islands",
          difficulty: "Above medium",
          description: "Boxes are replaced by uneven regions. Watch the cell colors along with rows and columns.",
          legend: "Thick borders separate islands: numbers cannot repeat inside each island.",
          rules: "How to play: rows and columns work as usual. Instead of 3x3 boxes, colored islands contain non-repeating numbers.",
          tutorial: "Fill the grid with numbers 1-9. Rows and columns work like classic sudoku. Boxes are replaced by islands: softly colored regions with thick borders. A number cannot repeat inside the island of the selected cell, so always check row, column and island together.",
          tags: ["9x9", "regions", "new"]
        },
        classic: {
          title: "Classic",
          difficulty: "Medium",
          description: "A calm 9x9 sudoku with rows, columns and 3x3 boxes.",
          legend: "",
          rules: "How to play: numbers 1-9 cannot repeat in any row, column or 3x3 box. A balanced warm-up mode.",
          tutorial: "Fill the board with numbers 1-9. Every row, column and 3x3 box must contain all numbers without repeats. Start with rows or boxes that already have many givens. If you are unsure, turn on notes and mark candidates.",
          tags: ["9x9", "classic", "balanced"]
        },
        mini: {
          title: "Mini 6x6",
          difficulty: "Easy",
          description: "A quick version with numbers 1 to 6 and 2x3 boxes. Great for short sessions.",
          legend: "",
          rules: "How to play: numbers 1-6 cannot repeat in rows, columns or 2x3 boxes. Fast and simple.",
          tutorial: "This is a short 6x6 mode. Use numbers 1-6, with 2x3 boxes. The rule is the same: no repeats in a row, column or box. It is best for quick sessions: small boxes often reveal the only possible number quickly.",
          tags: ["6x6", "quick", "easy"]
        }
      },
      messages: {
        continueTitle: "Continue this game?",
        continueText: "This mode already has a saved game. You can return to it or start a new grid.",
        replaceTitle: "Replace the game?",
        replaceText: "Starting another mode will replace the current saved game with a new one.",
        replace: "Replace",
        stay: "Stay",
        newGrid: "New grid",
        createErrorTitle: "Could not create the board",
        createErrorText: "Try starting this mode again. If the error repeats, choose another sudoku variant.",
        toModes: "To modes",
        givenCell: "This is a given cell. It cannot be changed.",
        erased: "The number was erased. The cell stays selected.",
        wrongNumber: "This number does not fit this cell. The mistake is saved, but you can keep playing.",
        goodMove: "Good. Keep looking for the only possible places.",
        notesOn: "Notes mode is on. Numbers will be written as small candidates.",
        notesOff: "Notes mode is off.",
        rewardedHint: "You received an extra hint. Press the button again to use it.",
        adUnavailable: "Ads are not available right now. Try again later.",
        noFreeHints: "Free hints are over.",
        hintApplied: "The hint filled one cell and removed that number from related notes.",
        errorsTitle: "There are mistakes",
        errorsText: "The board is filled, but some cells do not match the solution. Fix the highlighted numbers.",
        winTitle: "Victory",
        winText: "Solved in {time}. Mistakes: {mistakes}. You can start a new grid or choose another variant.",
        pauseTitle: "Pause",
        pauseText: "The game is saved. Come back when you are ready to continue.",
        toMenu: "To menu",
        modeNewTitle: "Start a new grid?",
        modeNewText: "The current game in this mode will be replaced.",
        newPuzzleTitle: "New grid",
        newPuzzleText: "The current game will be replaced by a new puzzle in this mode.",
        startNew: "Start new",
        resetTitle: "Reset progress",
        resetText: "Reset all records, settings and the current game?",
        reset: "Reset",
        keep: "Keep",
        ok: "OK"
      },
      statsText: {
        modeLine: "{mode}: wins {wins}, best {best}",
        wins: "Wins: {wins}. Average time: {average}.",
        clean: "No mistakes: {perfect}. No hints: {noHints}.",
        empty: "No completed games yet.",
        none: "none"
      },
      achievementsText: {
        firstWin: "First win",
        noMistakes: "No mistakes",
        noHints: "No hints",
        allModes: "All modes",
        fastMini: "Fast Mini win"
      },
      achievementReceived: "Received",
      achievementLocked: "Locked",
      achievementUnlockedTitle: "New achievement",
      achievementRewardPrefix: "Awarded",
      achievementCards: {
        firstWin: {
          title: "First Quiet Triumph",
          description: "Finish any puzzle.",
          reward: "calm leaf"
        },
        noMistakes: {
          title: "Clean Logic",
          description: "Win without a single mistake.",
          reward: "golden accuracy mark"
        },
        noHints: {
          title: "Clear Mind",
          description: "Solve a puzzle without hints.",
          reward: "independence badge"
        },
        allModes: {
          title: "Master of Four Paths",
          description: "Win in Diagonals, Islands, Classic and Mini.",
          reward: "complete mode collection"
        },
        fastMini: {
          title: "Fast Dawn",
          description: "Solve Mini 6x6 in 3 minutes or less.",
          reward: "fast Mini cup"
        }
      },
      aria: {
        row: "Row {row}",
        col: "column {col}",
        value: "value {value}",
        empty: "empty",
        given: "given cell",
        notes: "notes: {notes}",
        error: "mistake"
      }
    }
  };

  const modes = [
    {
      id: "diagonal",
      titleKey: "modes.diagonal.title",
      difficultyKey: "modes.diagonal.difficulty",
      order: "1",
      size: 9,
      boxRows: 3,
      boxCols: 3,
      givens: 42,
      hints: 3,
      descriptionKey: "modes.diagonal.description",
      legendKey: "modes.diagonal.legend",
      rulesKey: "modes.diagonal.rules",
      tagsKey: "modes.diagonal.tags",
      variant: "diagonal"
    },
    {
      id: "irregular",
      titleKey: "modes.irregular.title",
      difficultyKey: "modes.irregular.difficulty",
      order: "2",
      size: 9,
      boxRows: 3,
      boxCols: 3,
      givens: 43,
      hints: 3,
      descriptionKey: "modes.irregular.description",
      legendKey: "modes.irregular.legend",
      rulesKey: "modes.irregular.rules",
      tagsKey: "modes.irregular.tags",
      variant: "irregular"
    },
    {
      id: "classic",
      titleKey: "modes.classic.title",
      difficultyKey: "modes.classic.difficulty",
      order: "3",
      size: 9,
      boxRows: 3,
      boxCols: 3,
      givens: 44,
      hints: 4,
      descriptionKey: "modes.classic.description",
      legendKey: "modes.classic.legend",
      rulesKey: "modes.classic.rules",
      tagsKey: "modes.classic.tags",
      variant: "classic"
    },
    {
      id: "mini",
      titleKey: "modes.mini.title",
      difficultyKey: "modes.mini.difficulty",
      order: "4",
      size: 6,
      boxRows: 2,
      boxCols: 3,
      givens: 24,
      hints: 4,
      descriptionKey: "modes.mini.description",
      legendKey: "modes.mini.legend",
      rulesKey: "modes.mini.rules",
      tagsKey: "modes.mini.tags",
      variant: "classic"
    }
  ];

  const irregularRegions = [
    0, 0, 0, 1, 2, 2, 2, 2, 2,
    0, 0, 1, 1, 1, 2, 2, 2, 2,
    0, 0, 1, 1, 1, 1, 4, 5, 5,
    3, 0, 0, 4, 4, 1, 4, 5, 5,
    3, 3, 3, 3, 4, 4, 4, 5, 5,
    6, 3, 3, 3, 7, 4, 8, 5, 5,
    6, 6, 3, 7, 7, 4, 8, 8, 5,
    6, 6, 6, 7, 7, 7, 8, 8, 8,
    6, 6, 6, 7, 7, 7, 8, 8, 8
  ];

  const diagonalBase = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    4, 5, 6, 7, 8, 9, 1, 2, 3,
    7, 8, 9, 1, 2, 3, 4, 5, 6,
    9, 3, 5, 2, 4, 1, 8, 6, 7,
    6, 1, 7, 5, 3, 8, 2, 9, 4,
    8, 4, 2, 6, 9, 7, 5, 3, 1,
    2, 9, 8, 3, 1, 4, 6, 7, 5,
    3, 7, 1, 8, 6, 5, 9, 4, 2,
    5, 6, 4, 9, 7, 2, 3, 1, 8
  ];

  const irregularBase = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    5, 7, 8, 9, 6, 1, 2, 3, 4,
    6, 9, 1, 3, 2, 7, 5, 4, 8,
    2, 8, 4, 7, 3, 5, 6, 9, 1,
    9, 3, 5, 8, 4, 2, 1, 6, 7,
    7, 4, 6, 1, 8, 9, 3, 2, 5,
    4, 6, 7, 2, 1, 8, 9, 5, 3,
    3, 1, 2, 5, 9, 4, 8, 7, 6,
    8, 5, 9, 6, 7, 3, 4, 1, 2
  ];

  const achievementDefinitions = [
    { key: "firstWin", titleKey: "achievementCards.firstWin.title", descriptionKey: "achievementCards.firstWin.description", rewardKey: "achievementCards.firstWin.reward" },
    { key: "noMistakes", titleKey: "achievementCards.noMistakes.title", descriptionKey: "achievementCards.noMistakes.description", rewardKey: "achievementCards.noMistakes.reward" },
    { key: "noHints", titleKey: "achievementCards.noHints.title", descriptionKey: "achievementCards.noHints.description", rewardKey: "achievementCards.noHints.reward" },
    { key: "allModes", titleKey: "achievementCards.allModes.title", descriptionKey: "achievementCards.allModes.description", rewardKey: "achievementCards.allModes.reward" },
    { key: "fastMini", titleKey: "achievementCards.fastMini.title", descriptionKey: "achievementCards.fastMini.description", rewardKey: "achievementCards.fastMini.reward" }
  ];

  const achievementIconPaths = {
    firstWin: "<path d='M12 3c2.4 1.7 3.6 3.8 3.6 6.1 0 2.9-1.8 5.1-3.6 6.5-1.8-1.4-3.6-3.6-3.6-6.5C8.4 6.8 9.6 4.7 12 3z'/><path d='M12 15.6V21'/>",
    noMistakes: "<circle cx='12' cy='12' r='7'/><path d='m8.5 12.2 2.2 2.2 5-5'/>",
    noHints: "<path d='M12 4c-3 2-4.5 4.1-4.5 6.4 0 3.1 2.3 5.4 4.5 7 2.2-1.6 4.5-3.9 4.5-7C16.5 8.1 15 6 12 4z'/><path d='M9 11h6M10 14h4'/>",
    allModes: "<rect x='5' y='5' width='6' height='6' rx='1.4'/><rect x='13' y='5' width='6' height='6' rx='1.4'/><rect x='5' y='13' width='6' height='6' rx='1.4'/><rect x='13' y='13' width='6' height='6' rx='1.4'/>",
    fastMini: "<path d='M8 4h8v4a4 4 0 0 1-8 0z'/><path d='M8 6H5.5a2.5 2.5 0 0 0 2.5 4M16 6h2.5a2.5 2.5 0 0 1-2.5 4M12 12v4M9 20h6M10 16h4'/><path d='m13.5 5-3 5H14l-2.5 4'/>"
  };

  const state = {
    screen: "menu",
    selected: -1,
    notesMode: false,
    showErrors: false,
    pausedReasons: new Set(),
    gameplayMarkedActive: false,
    readyMarked: false,
    cloudTimer: 0,
    cloudInFlight: false,
    cloudPending: false,
    cloudPendingForce: false,
    platformPauseHandler: null,
    platformResumeHandler: null,
    stickyBannerWanted: null,
    stickyBannerInFlight: null,
    fullscreenAdInFlight: false,
    completed: false,
    modalStack: [],
    lastHintButtonMode: null,
    timerId: 0,
    sdk: null,
    player: null,
    data: {
      version: SAVE_VERSION,
      generatorVersion: GENERATOR_VERSION,
      settings: {
        sound: true,
        autoCheck: true,
        highlight: true,
        textScale: "normal"
      },
      lastMode: "diagonal",
      best: {},
      stats: null,
      achievements: null,
      active: null
    },
    puzzle: null,
    board: [],
    notes: [],
    history: [],
    mistakes: 0,
    hintsLeft: 3,
    usedHints: 0,
    startedAt: 0,
    elapsed: 0,
    seedCounter: 1,
    audio: null
  };

  const el = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    const ysdk = await initSdk();
    state.sdk = ysdk;
    const detectedLanguage = ysdk
      ? ysdk.environment?.i18n?.lang
      : (navigator.languages?.[0] || navigator.language);
    applyLanguage(resolveLanguage(detectedLanguage));
    loadLocalData();
    if (ysdk) {
      subscribePlatformEvents(ysdk);
      await loadPlayerData(ysdk);
    }
    bindEvents();
    renderMenu();
    showMenu();
    revealReadyInterface();
    if (window.__LIGHT_SUDOKU_TEST__ === true) installSelfTests();
  }

  function cacheElements() {
    [
      "backButton", "settingsButton", "menuSettingsButton", "statsButton", "achievementsButton", "menuScreen", "levelScreen", "gameScreen", "modeGrid", "playButton", "continueButton", "continueInfo",
      "modeEyebrow", "modeTitle", "modeLegend", "modeDescription", "timerText", "mistakesText", "hintsText",
      "progressText", "progressTrack", "progressFill", "modeIcon", "newPuzzleButton", "pauseButton", "hintButton", "tutorialButton", "undoButton", "eraseButton",
      "notesButton", "tipText", "board", "numberPad", "settingsModal", "soundToggle",
      "autoCheckToggle", "highlightToggle", "resetProgressButton", "closeSettingsButton",
      "settingsModalIcon", "textScaleLegend", "messageModal", "messageModalIcon", "messageTitle", "messageText", "messageActions"
    ].forEach((id) => {
      el[id] = document.getElementById(id);
    });
    el.textScaleInputs = [...document.querySelectorAll('input[name="textScale"]')];
    [document.querySelector(".app-shell"), el.settingsModal, el.messageModal]
      .filter(Boolean)
      .forEach(bindBrowserInteractionGuards);
  }

  function bindBrowserInteractionGuards(container) {
    ["contextmenu", "selectstart", "dragstart"].forEach((eventName) => {
      container.addEventListener(eventName, (event) => {
        if (event.target instanceof Node && container.contains(event.target)) {
          preventBrowserInteraction(event);
        }
      }, true);
    });
  }

  function t(key) {
    const read = (source) => key.split(".").reduce((value, part) => value && value[part], source);
    const value = read(translations[currentLanguage]) ?? read(translations.en);
    return value ?? key;
  }

  function tf(key, values = {}) {
    return String(t(key)).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function modeTitle(mode) {
    return t(mode.titleKey);
  }

  function modeDifficulty(mode) {
    return t(mode.difficultyKey);
  }

  function modeDescription(mode) {
    return t(mode.descriptionKey);
  }

  function modeLegend(mode) {
    return mode.legendKey ? t(mode.legendKey) : "";
  }

  function modeRules(mode) {
    return t(mode.rulesKey);
  }

  function modeTutorial(mode) {
    return t(`modes.${mode.id}.tutorial`);
  }

  function modeTags(mode) {
    const tags = t(mode.tagsKey);
    return Array.isArray(tags) ? tags : [];
  }

  function svgIcon(name, className = "button-icon") {
    const icons = {
      play: "<path d='M8 5v14l11-7z'/>",
      continue: "<path d='M5 12a7 7 0 1 1 2 5'/><path d='M5 17v-5h5'/>",
      settings: "<circle cx='12' cy='12' r='3'/><path d='M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1'/>",
      stats: "<path d='M5 19V9M12 19V5M19 19v-7'/>",
      trophy: "<path d='M8 4h8v4a4 4 0 0 1-8 0z'/><path d='M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 12v4M9 20h6M10 16h4'/>",
      warning: "<path d='M12 3 2.8 20h18.4z'/><path d='M12 9v5M12 17h.01'/>",
      error: "<circle cx='12' cy='12' r='9'/><path d='M15 9l-6 6M9 9l6 6'/>",
      win: "<path d='M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9z'/>",
      new: "<path d='M12 5v14M5 12h14'/>",
      pause: "<path d='M8 5v14M16 5v14'/>",
      hint: "<path d='M9 18h6M10 22h4M8 10a4 4 0 1 1 7 2.7c-1 .9-1.5 1.7-1.7 3.3h-2.6c-.2-1.6-.7-2.4-1.7-3.3A4 4 0 0 1 8 10z'/>",
      tutorial: "<path d='M5 5.5A2.5 2.5 0 0 1 7.5 3H20v15H7.5A2.5 2.5 0 0 0 5 20.5z'/><path d='M5 5.5v15M9 8h7M9 12h6'/>",
      undo: "<path d='M9 7H4v5'/><path d='M4 12a8 8 0 1 0 2.3-5.7'/>",
      erase: "<path d='M4 15 13 6l7 7-7 7H8z'/><path d='M9 20h11'/>",
      notes: "<path d='M5 19l4-1 10-10-3-3L6 15z'/><path d='M14 6l3 3'/>"
    };
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.play}</svg>`;
  }

  function setIconButton(button, label, icon) {
    if (!button) return;
    button.classList.add("has-svg");
    button.innerHTML = `${svgIcon(icon)}<span>${label}</span>`;
  }

  function applyLanguage(language) {
    currentLanguage = resolveLanguage(language);
    document.documentElement.lang = currentLanguage;
    document.title = t("gameTitle");
    el.backButton.textContent = t("back");
    setIconButton(el.settingsButton, t("settings"), "settings");
    setIconButton(el.menuSettingsButton, t("settings"), "settings");
    setIconButton(el.statsButton, t("statistics"), "stats");
    setIconButton(el.achievementsButton, t("achievements"), "trophy");
    setIconButton(el.playButton, t("play"), "play");
    if (el.continueButton) {
      el.continueButton.classList.add("has-continue-icon");
      el.continueButton.innerHTML = `${svgIcon("continue")}<span>${t("continue")}</span><small id="continueInfo">${t("savedGame")}</small>`;
    }
    el.continueInfo = document.getElementById("continueInfo");
    setIconButton(el.newPuzzleButton, t("newPuzzle"), "new");
    setIconButton(el.pauseButton, t("pause"), "pause");
    state.lastHintButtonMode = null;
    setIconButton(el.hintButton, t("hint"), "hint");
    setIconButton(el.tutorialButton, t("tutorialButton"), "tutorial");
    setIconButton(el.undoButton, t("undo"), "undo");
    setIconButton(el.eraseButton, t("erase"), "erase");
    setIconButton(el.notesButton, t("notes"), "notes");
    document.querySelector(".brand-block span:last-child").textContent = t("gameTitle");
    const titleLines = document.querySelectorAll(".menu-copy h1 span");
    if (titleLines[0]) titleLines[0].textContent = t("gameTitleLine1");
    if (titleLines[1]) titleLines[1].textContent = t("gameTitleLine2");
    const subtitle = document.querySelector(".menu-copy p");
    if (subtitle) subtitle.textContent = t("gameSubtitle");
    const shortcuts = document.querySelector(".menu-shortcuts");
    shortcuts?.setAttribute("aria-label", t("menuSections"));
    const levelEyebrow = document.querySelector(".level-heading .eyebrow");
    if (levelEyebrow) levelEyebrow.textContent = t("levelEyebrow");
    const levelTitle = document.querySelector(".level-heading h2");
    if (levelTitle) levelTitle.textContent = t("chooseMode");
    const levelIntro = document.querySelector(".level-heading > p");
    if (levelIntro) levelIntro.textContent = t("levelIntro");
    const statLabels = document.querySelectorAll(".stats-grid .stat-card span");
    [t("time"), t("mistakes"), t("hints"), t("progress")].forEach((label, index) => {
      if (statLabels[index]) statLabels[index].textContent = label;
    });
    el.progressTrack?.setAttribute("aria-label", t("progressAria"));
    document.querySelector(".board-zone")?.setAttribute("aria-label", t("gameArea"));
    el.board?.setAttribute("aria-label", t("sudokuGrid"));
    el.numberPad?.setAttribute("aria-label", t("numbers"));
    el.modeTitle.textContent = state.puzzle ? modeTitle(state.puzzle.mode) : t("modeFallbackTitle");
    el.modeEyebrow.textContent = state.puzzle ? `${modeDifficulty(state.puzzle.mode)} - ${state.puzzle.mode.size}x${state.puzzle.mode.size}` : t("modeFallbackChip");
    el.modeDescription.textContent = state.puzzle ? modeDescription(state.puzzle.mode) : t("modeFallbackDescription");
    el.tipText.textContent = t("tipStart");
    document.getElementById("settingsTitle").textContent = t("settings");
    const toggleTexts = document.querySelectorAll(".settings-card .toggle-line span");
    [t("sound"), t("autoCheck"), t("highlight")].forEach((label, index) => {
      if (toggleTexts[index]) toggleTexts[index].textContent = label;
    });
    if (el.textScaleLegend) el.textScaleLegend.textContent = t("textScale");
    const textScaleLabels = document.querySelectorAll("[data-text-scale-label]");
    const textScaleLabelKeys = {
      normal: "textScaleNormal",
      large: "textScaleLarge",
      xlarge: "textScaleXLarge"
    };
    textScaleLabels.forEach((label) => {
      const key = textScaleLabelKeys[label.dataset.textScaleLabel];
      if (key) label.textContent = t(key);
    });
    el.resetProgressButton.textContent = t("resetProgress");
    el.closeSettingsButton.textContent = t("done");
    if (el.settingsModalIcon) {
      el.settingsModalIcon.className = "modal-icon modal-icon-pause";
      el.settingsModalIcon.innerHTML = svgIcon("settings", "modal-svg");
    }
    applyTextScale(state.data.settings.textScale);
    renderMenu();
    updateHud();
  }

  function resolveLanguage(language) {
    const primaryCode = String(language || "").trim().toLowerCase().split(/[-_]/)[0];
    return Object.prototype.hasOwnProperty.call(translations, primaryCode) ? primaryCode : FALLBACK_LANGUAGE;
  }

  function bindEvents() {
    el.backButton.addEventListener("click", goBack);
    el.playButton.addEventListener("click", showLevelSelect);
    el.settingsButton.addEventListener("click", openSettings);
    el.menuSettingsButton?.addEventListener("click", openSettings);
    el.statsButton?.addEventListener("click", showStats);
    el.achievementsButton?.addEventListener("click", showAchievements);
    el.closeSettingsButton.addEventListener("click", closeSettings);
    el.settingsModal.addEventListener("click", (event) => {
      if (event.target === el.settingsModal) closeSettings();
    });
    el.messageModal.addEventListener("click", (event) => {
      if (event.target === el.messageModal) event.preventDefault();
    });
    el.continueButton.addEventListener("click", continueGame);
    el.newPuzzleButton.addEventListener("click", () => confirmNewPuzzle());
    el.pauseButton.addEventListener("click", () => pauseByUser());
    el.hintButton.addEventListener("click", requestHint);
    el.tutorialButton.addEventListener("click", showCurrentTutorial);
    el.undoButton.addEventListener("click", undo);
    el.eraseButton.addEventListener("click", eraseSelected);
    el.notesButton.addEventListener("click", toggleNotesMode);
    el.resetProgressButton.addEventListener("click", resetProgress);
    el.textScaleInputs?.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) updateSetting("textScale", input.value);
      });
    });
    el.soundToggle.addEventListener("change", () => updateSetting("sound", el.soundToggle.checked));
    el.autoCheckToggle.addEventListener("change", () => updateSetting("autoCheck", el.autoCheckToggle.checked));
    el.highlightToggle.addEventListener("change", () => updateSetting("highlight", el.highlightToggle.checked));
    document.addEventListener("keydown", handleKey);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        saveActiveState(false);
        flushCloudSave();
        addPause("hidden");
      } else {
        removePause("hidden");
      }
    });
    window.addEventListener("blur", () => addPause("blur"));
    window.addEventListener("focus", () => removePause("blur"));
    window.addEventListener("pagehide", () => {
      saveActiveState(false);
      flushCloudSave();
    });
    window.addEventListener("beforeunload", () => {
      saveActiveState(false);
    });
  }

  function preventBrowserInteraction(event) {
    event.preventDefault();
  }

  async function initSdk() {
    await loadSdkScript();
    if (!window.YaGames || typeof window.YaGames.init !== "function") {
      return null;
    }
    try {
      return await window.YaGames.init();
    } catch (error) {
      return null;
    }
  }

  async function loadPlayerData(ysdk) {
    if (!ysdk || typeof ysdk.getPlayer !== "function") return;
    try {
      state.player = await ysdk.getPlayer({ scopes: false });
      const cloudData = await readCloudData(state.player);
      if (cloudData) mergeCloudData(cloudData);
    } catch (error) {
      state.player = null;
    }
  }

  function loadSdkScript() {
    const localHost = ["localhost", "127.0.0.1", ""].includes(location.hostname);
    if (window.YaGames || location.protocol === "file:" || localHost) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve();
      };
      const script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.onload = finish;
      script.onerror = finish;
      const timeoutId = window.setTimeout(finish, SDK_SCRIPT_TIMEOUT_MS);
      document.head.appendChild(script);
    });
  }

  function isDebugEnabled() {
    return ["localhost", "127.0.0.1"].includes(location.hostname) || new URLSearchParams(location.search).get("debug") === "1";
  }

  function markReady() {
    if (state.readyMarked) return;
    const ready = state.sdk?.features?.LoadingAPI?.ready;
    if (typeof ready !== "function") return;
    try {
      ready.call(state.sdk.features.LoadingAPI);
      state.readyMarked = true;
      document.body.dataset.gameReady = "true";
    } catch (error) {
      // Local play must continue even when SDK readiness fails.
    }
  }

  function revealReadyInterface() {
    const shell = document.querySelector(".app-shell");
    shell?.removeAttribute("inert");
    shell?.removeAttribute("aria-hidden");
    document.body.classList.remove("is-booting");
    document.body.removeAttribute("aria-busy");
    markReady();
  }

  function subscribePlatformEvents(ysdk) {
    if (!ysdk || typeof ysdk.on !== "function") return;
    if (state.platformPauseHandler && typeof ysdk.off === "function") {
      ysdk.off("game_api_pause", state.platformPauseHandler);
      ysdk.off("game_api_resume", state.platformResumeHandler);
    }
    state.platformPauseHandler = () => {
      saveActiveState();
      flushCloudSave();
      addPause("platform");
      state.audio?.suspend?.().catch(() => {});
    };
    state.platformResumeHandler = () => removePause("platform");
    ysdk.on("game_api_pause", state.platformPauseHandler);
    ysdk.on("game_api_resume", state.platformResumeHandler);
  }

  function readCloudData(player) {
    if (!player || typeof player.getData !== "function") return Promise.resolve(null);
    return player.getData([SAVE_KEY]).then((data) => data && data[SAVE_KEY] ? data[SAVE_KEY] : null);
  }

  function writeCloudData(forceFlush = false) {
    if (!state.player || typeof state.player.setData !== "function") return Promise.resolve();
    if (state.cloudInFlight) {
      state.cloudPending = true;
      state.cloudPendingForce = state.cloudPendingForce || forceFlush;
      return Promise.resolve();
    }
    state.cloudInFlight = true;
    const snapshot = JSON.parse(JSON.stringify({ [SAVE_KEY]: state.data }));
    return state.player.setData(snapshot, forceFlush)
      .catch(() => {})
      .finally(() => {
        state.cloudInFlight = false;
        if (state.cloudPending) {
          const pendingForce = state.cloudPendingForce;
          state.cloudPending = false;
          state.cloudPendingForce = false;
          if (pendingForce) writeCloudData(true);
          else scheduleCloudSave();
        }
      });
  }

  function mergeCloudData(cloudData) {
    const prepared = prepareCloudSave(cloudData);
    if (!prepared) return;
    const localTime = state.data.updatedAt || 0;
    if (prepared.updatedAt <= localTime) return;
    const merged = { ...state.data, updatedAt: prepared.updatedAt };
    Object.entries(prepared.sections).forEach(([key, value]) => {
      merged[key] = value;
    });
    state.data = sanitizeSaveV2(merged);
    state.data.updatedAt = prepared.updatedAt;
    saveLocalImmediately();
    syncSettingsControls();
    renderMenu();
    if (state.screen === "game" && state.data.active && restoreActivePuzzle()) renderGame();
  }

  function prepareCloudSave(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const has = (key) => Object.prototype.hasOwnProperty.call(raw, key);
    const rawVersion = raw.version == null ? 1 : Number(raw.version);
    if (!Number.isInteger(rawVersion) || ![1, SAVE_VERSION].includes(rawVersion)) return null;
    const updatedAt = Number(raw.updatedAt);
    if (!Number.isFinite(updatedAt) || !Number.isInteger(updatedAt) || updatedAt < 0) return null;

    const sections = {};
    const objectSections = ["settings", "best", "stats", "achievements"];
    for (const key of objectSections) {
      if (!has(key)) continue;
      if (!raw[key] || typeof raw[key] !== "object" || Array.isArray(raw[key])) return null;
      sections[key] = key === "settings" ? sanitizeSettings(raw[key])
        : key === "best" ? sanitizeBest(raw[key])
          : key === "stats" ? sanitizeStats(raw[key])
            : sanitizeAchievements(raw[key]);
    }
    if (has("lastMode")) {
      if (typeof raw.lastMode !== "string" || !modes.some((mode) => mode.id === raw.lastMode)) return null;
      sections.lastMode = raw.lastMode;
    }
    if (has("active")) {
      if (raw.active === null) {
        sections.active = null;
      } else if (raw.active && typeof raw.active === "object" && !Array.isArray(raw.active)) {
        const active = sanitizeActiveSave(raw.active, rawVersion === 1);
        if (active) sections.active = active;
      }
    }
    return { updatedAt, sections };
  }

  function migrateSave(raw) {
    const sourceVersion = finiteNumber(raw?.version, 1) || 1;
    if (sourceVersion === 1) return migrateSaveV1ToV2(raw);
    return sanitizeSaveV2(raw);
  }

  function createDefaultSaveData() {
    return {
      version: SAVE_VERSION,
      generatorVersion: GENERATOR_VERSION,
      settings: { sound: true, autoCheck: true, highlight: true, textScale: "normal" },
      lastMode: "diagonal",
      best: {},
      stats: createEmptyStats(),
      achievements: createEmptyAchievements(),
      active: null
    };
  }

  function createEmptyStats() {
    return { wins: 0, totalTime: 0, perfectWins: 0, noHintWins: 0, byMode: {} };
  }

  function createEmptyAchievements() {
    return { firstWin: false, noMistakes: false, noHints: false, allModes: false, fastMini: false };
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function finiteInteger(value, fallback = 0) {
    const number = finiteNumber(value, fallback);
    return Number.isInteger(number) ? number : fallback;
  }

  function sanitizeSettings(settings) {
    return {
      sound: settings?.sound !== false,
      autoCheck: settings?.autoCheck !== false,
      highlight: settings?.highlight !== false,
      textScale: normalizeTextScale(settings?.textScale)
    };
  }

  function normalizeTextScale(value) {
    return TEXT_SCALE_OPTIONS.includes(value) ? value : "normal";
  }

  function sanitizeBest(best) {
    const result = {};
    if (!best || typeof best !== "object") return result;
    modes.forEach((mode) => {
      const item = best[mode.id];
      const time = item ? finiteInteger(item.time, 0) : 0;
      if (item && time > 0) {
        result[mode.id] = {
          time,
          mistakes: Math.max(0, finiteInteger(item.mistakes, 0)),
          completedAt: finiteInteger(item.completedAt, Date.now())
        };
      }
    });
    return result;
  }

  function sanitizeStats(stats) {
    const base = createEmptyStats();
    if (!stats || typeof stats !== "object") return base;
    const byMode = {};
    modes.forEach((mode) => {
      const item = stats.byMode?.[mode.id];
      if (!item || typeof item !== "object") return;
      byMode[mode.id] = {
        wins: Math.max(0, finiteInteger(item.wins, 0)),
        totalTime: Math.max(0, finiteInteger(item.totalTime, 0)),
        perfectWins: Math.max(0, finiteInteger(item.perfectWins, 0)),
        noHintWins: Math.max(0, finiteInteger(item.noHintWins, 0)),
        bestTime: Math.max(0, finiteInteger(item.bestTime, 0))
      };
    });
    return {
      wins: Math.max(0, finiteInteger(stats.wins, 0)),
      totalTime: Math.max(0, finiteInteger(stats.totalTime, 0)),
      perfectWins: Math.max(0, finiteInteger(stats.perfectWins, 0)),
      noHintWins: Math.max(0, finiteInteger(stats.noHintWins, 0)),
      byMode
    };
  }

  function sanitizeAchievements(achievements) {
    const base = createEmptyAchievements();
    if (!achievements || typeof achievements !== "object") return base;
    return Object.fromEntries(Object.keys(base).map((key) => [key, Boolean(achievements[key])]));
  }

  function migrateSaveV1ToV2(raw) {
    const next = createDefaultSaveData();
    if (!raw || typeof raw !== "object") return next;
    next.settings = sanitizeSettings(raw.settings);
    next.best = sanitizeBest(raw.best);
    next.stats = sanitizeStats(raw.stats);
    next.achievements = sanitizeAchievements(raw.achievements);
    next.lastMode = modes.some((mode) => mode.id === raw.lastMode) ? raw.lastMode : "diagonal";
    next.updatedAt = finiteInteger(raw.updatedAt, Date.now());
    next.active = sanitizeActiveSave(raw.active, true);
    return next;
  }

  function sanitizeSaveV2(raw) {
    const base = createDefaultSaveData();
    if (!raw || typeof raw !== "object") return base;
    const next = { ...base, ...raw };
    next.version = SAVE_VERSION;
    next.generatorVersion = GENERATOR_VERSION;
    next.settings = sanitizeSettings(raw.settings);
    if (!modes.some((mode) => mode.id === next.lastMode)) next.lastMode = "diagonal";
    next.best = sanitizeBest(raw.best);
    next.stats = sanitizeStats(raw.stats);
    next.achievements = sanitizeAchievements(raw.achievements);
    next.updatedAt = finiteInteger(raw.updatedAt, Date.now());
    next.active = sanitizeActiveSave(raw.active, false);
    return next;
  }

  function sanitizeSave(raw) {
    return migrateSave(raw);
  }

  function sanitizeActiveSave(active, allowLegacyRebuild = false) {
    if (!active || typeof active !== "object") return null;
    const mode = modes.find((item) => item.id === active.modeId);
    if (!mode) return null;
    const length = mode.size * mode.size;
    let givens = active.givens;
    let solution = active.solution;
    const savedSeed = finiteInteger(active.seed, 0);
    const seed = savedSeed > 0 ? savedSeed : createSeed(mode.id);
    if (allowLegacyRebuild && (!validNumberArray(givens, length, mode.size) || !isValidCompleteSolution(solution, mode))) {
      try {
        const rebuilt = createPuzzle(mode, seed);
        givens = rebuilt.givens;
        solution = rebuilt.solution;
      } catch (error) {
        return null;
      }
    }
    if (!validNumberArray(active.board, length, mode.size)) return null;
    if (!validNumberArray(givens, length, mode.size)) return null;
    if (!isValidCompleteSolution(solution, mode)) return null;
    if (givens.some((value, index) => value && value !== solution[index])) return null;
    if (active.board.some((value, index) => givens[index] && value !== givens[index])) return null;
    if (countSolutions(givens, mode, 2) !== 1) return null;
    return {
      modeId: mode.id,
      generatorVersion: Math.min(GENERATOR_VERSION, Math.max(1, finiteInteger(active.generatorVersion, GENERATOR_VERSION))),
      seed,
      givens: givens.slice(),
      solution: solution.slice(),
      board: active.board.slice(),
      notes: sanitizeNotes(active.notes, mode.size),
      mistakes: Math.max(0, finiteInteger(active.mistakes, 0)),
      hintsLeft: Math.min(99, Math.max(0, finiteInteger(active.hintsLeft ?? mode.hints, mode.hints))),
      usedHints: Math.min(99, Math.max(0, finiteInteger(active.usedHints, 0))),
      selected: Number.isInteger(active.selected) ? Math.max(0, Math.min(length - 1, active.selected)) : active.board.findIndex((value) => !value),
      elapsed: Math.max(0, finiteInteger(active.elapsed, 0)),
      savedAt: finiteInteger(active.savedAt, Date.now())
    };
  }

  function sanitizeNotes(notes, size) {
    return deserializeNotes(notes, size).map((set) => Array.from(set));
  }

  function validNumberArray(items, length, max) {
    return Array.isArray(items) && items.length === length && items.every((value) => Number.isInteger(value) && value >= 0 && value <= max);
  }

  function isValidCompleteSolution(solution, mode) {
    if (!Array.isArray(solution) || solution.length !== mode.size * mode.size) return false;
    return solution.every((value, index) => Number.isInteger(value) && value >= 1 && value <= mode.size && canPlaceWithSelf(solution, mode, index, value));
  }

  function loadLocalData() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      state.data = migrateSave(parsed);
    } catch (error) {
      state.data = migrateSave(null);
    }
    syncSettingsControls();
  }

  function saveLocalImmediately() {
    state.data.updatedAt = Date.now();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state.data));
      return true;
    } catch (error) {
      return false;
    }
  }

  function saveLocalData(syncCloud = true) {
    saveLocalImmediately();
    if (syncCloud) scheduleCloudSave();
  }

  function scheduleCloudSave() {
    clearTimeout(state.cloudTimer);
    state.cloudTimer = window.setTimeout(writeCloudData, 7000);
  }

  function flushCloudSave() {
    clearTimeout(state.cloudTimer);
    return writeCloudData(true);
  }

  function syncSettingsControls() {
    el.soundToggle.checked = state.data.settings.sound;
    el.autoCheckToggle.checked = state.data.settings.autoCheck;
    el.highlightToggle.checked = state.data.settings.highlight;
    const textScale = normalizeTextScale(state.data.settings.textScale);
    el.textScaleInputs?.forEach((input) => {
      input.checked = input.value === textScale;
    });
    applyTextScale(textScale);
  }

  function applyTextScale(value) {
    document.documentElement.dataset.textScale = normalizeTextScale(value);
  }

  function updateSetting(key, value) {
    if (key === "textScale") value = normalizeTextScale(value);
    state.data.settings[key] = value;
    if (key === "textScale") applyTextScale(value);
    saveLocalData();
    if (key === "sound") {
      if (value) playTone("ok", true);
      else suspendAudio();
    } else {
      playTone("tap", true);
    }
    renderGameState({ numberPad: false });
  }

  function renderMenu() {
    el.modeGrid.innerHTML = "";
    modes.forEach((mode) => {
      const activeMode = state.data.active?.modeId === mode.id;
      const card = document.createElement("article");
      card.className = `mode-card mode-${mode.id}`;
      if (activeMode) card.classList.add("active-mode");
      const best = state.data.best[mode.id];
      const bestText = best ? formatTime(best.time) : t("noRecord");
      card.innerHTML = `
        <div class="mode-topline">
          <span class="mode-icon mode-icon-${mode.id}" aria-hidden="true"></span>
          ${activeMode ? `<span class="current-label">${t("currentGame")}</span>` : ""}
        </div>
        <h3>${modeTitle(mode)}</h3>
        <span class="difficulty-chip">${modeDifficulty(mode)}</span>
        <p>${modeDescription(mode)}</p>
        <p class="mode-rules">${modeRules(mode)}</p>
        <div class="mode-meta">
          ${modeTags(mode).map((tag) => `<span class="pill">${tag}</span>`).join("")}
          <span class="pill">${bestText}</span>
        </div>
        <div class="mode-actions ${activeMode ? "has-active" : ""}">
          <button class="primary-button mode-play has-svg" type="button">${svgIcon(activeMode ? "continue" : "play")}<span>${activeMode ? t("continue") : t("play")}</span></button>
          <button class="secondary-mode-button mode-tutorial" type="button">${t("tutorialButton")}</button>
          ${activeMode ? `<button class="secondary-mode-button mode-new" type="button">${t("newPuzzle")}</button>` : ""}
        </div>
      `;
      card.querySelector(".mode-play").addEventListener("click", () => activeMode ? continueGame() : chooseMode(mode.id));
      card.querySelector(".mode-tutorial").addEventListener("click", () => showModeTutorial(mode.id));
      card.querySelector(".mode-new")?.addEventListener("click", () => {
        showMessage(t("messages.modeNewTitle"), t("messages.modeNewText"), [
          { label: t("messages.startNew"), primary: true, action: () => runFullscreenAdBefore(() => startMode(mode.id, false)) },
          { label: t("messages.stay") }
        ], { icon: "warning" });
      });
      el.modeGrid.appendChild(card);
    });
    el.continueButton.hidden = !state.data.active;
    el.continueButton.disabled = !state.data.active;
    if (el.continueInfo) {
      const activeMode = modes.find((mode) => mode.id === state.data.active?.modeId);
      el.continueInfo.textContent = activeMode ? `${modeTitle(activeMode)} - ${modeDifficulty(activeMode)}` : t("savedGame");
    }
  }

  function showMenu() {
    saveActiveState();
    flushCloudSave();
    stopTimer();
    notifyGameplayStop();
    state.screen = "menu";
    syncStickyBanner(true);
    syncScreenChrome();
    clearPauses();
    el.menuScreen.hidden = false;
    el.levelScreen.hidden = true;
    el.gameScreen.hidden = true;
    el.backButton.hidden = true;
    renderMenu();
  }

  function showLevelSelect() {
    saveActiveState();
    flushCloudSave();
    stopTimer();
    notifyGameplayStop();
    state.screen = "levels";
    syncStickyBanner(true);
    syncScreenChrome();
    clearPauses();
    el.menuScreen.hidden = true;
    el.levelScreen.hidden = false;
    el.gameScreen.hidden = true;
    el.backButton.hidden = false;
    renderMenu();
  }

  function goBack() {
    if (state.screen === "game") {
      showLevelSelect();
      return;
    }
    showMenu();
  }

  function continueGame() {
    if (state.data.active && restoreActivePuzzle()) {
      showGame();
      return;
    }
    startMode(state.data.lastMode || "diagonal", false);
  }

  function chooseMode(modeId) {
    const active = state.data.active;
    if (!active) {
      startMode(modeId, false);
      return;
    }
    if (active.modeId === modeId) {
      showMessage(t("messages.continueTitle"), t("messages.continueText"), [
        { label: t("continue"), primary: true, action: continueGame },
        { label: t("messages.newGrid"), action: () => runFullscreenAdBefore(() => startMode(modeId, false)) }
      ], { icon: "warning" });
      return;
    }
    showMessage(t("messages.replaceTitle"), t("messages.replaceText"), [
        { label: t("messages.replace"), primary: true, action: () => runFullscreenAdBefore(() => startMode(modeId, false)) },
      { label: t("messages.stay") }
    ], { icon: "warning" });
  }

  function showCurrentTutorial() {
    if (!state.puzzle) return;
    showModeTutorial(state.puzzle.mode.id, { inGame: true });
  }

  function showModeTutorial(modeId, options = {}) {
    showModeTutorialStep(modeId, 0, options);
  }

  function showModeTutorialStep(modeId, stepIndex, options = {}) {
    const mode = modes.find((item) => item.id === modeId) || modes[0];
    const pages = modeTutorialPages(mode);
    const safeIndex = Math.max(0, Math.min(stepIndex, pages.length - 1));
    const page = pages[safeIndex];
    const html = `
      <span class="tutorial-block tutorial-step-card">
        <span class="tutorial-chip">${escapeHtml(tf("tutorialStep", { current: safeIndex + 1, total: pages.length }))} &middot; ${escapeHtml(modeDifficulty(mode))} &middot; ${mode.size}x${mode.size}</span>
        <strong>${escapeHtml(page.title)}</strong>
        <span>${escapeHtml(page.text)}</span>
      </span>
    `;
    const actions = [];
    if (safeIndex > 0) {
      actions.push({ label: t("tutorialBack"), action: () => showModeTutorialStep(modeId, safeIndex - 1, options) });
    }
    if (safeIndex < pages.length - 1) {
      actions.push({ label: t("tutorialNext"), primary: true, action: () => showModeTutorialStep(modeId, safeIndex + 1, options) });
    } else if (options.inGame) {
      actions.push({ label: t("messages.ok"), primary: true });
    } else {
      actions.push({ label: t("play"), primary: true, action: () => chooseMode(mode.id) });
      actions.push({ label: t("messages.ok") });
    }
    showMessage(`${t("tutorialTitle")}: ${modeTitle(mode)}`, html, actions, { icon: "hint", html: true });
  }

  function modeTutorialPages(mode) {
    if (currentLanguage !== "ru") {
      if (mode.id === "irregular") {
        return [
          { title: "What Islands mean", text: "Rows and columns work normally. The usual 3x3 boxes are replaced by colored islands with thicker borders." },
          { title: "What the highlight means", text: "When you select a cell, highlighted cells show its row, column and island. The number you place cannot already be in those cells." },
          { title: "How to solve", text: "Check three things before placing a number: row, column and the selected cell's island. Same numbers cannot repeat inside one island." }
        ];
      }
      if (mode.id === "diagonal") {
        return [
          { title: "Classic rules plus diagonals", text: "Rows, columns and 3x3 boxes cannot repeat numbers. In this mode both long diagonals also contain 1-9 without repeats." },
          { title: "What the highlight means", text: "A selected diagonal cell is connected not only to its row, column and box, but also to the diagonal line." },
          { title: "How to solve", text: "If a number is already on the same diagonal, you cannot place it in another cell of that diagonal." }
        ];
      }
      if (mode.id === "mini") {
        return [
          { title: "Small board", text: "Mini uses a 6x6 board and numbers 1-6." },
          { title: "Blocks are 2x3", text: "A number cannot repeat in a row, column or 2x3 block." },
          { title: "How to solve", text: "Start with rows, columns or blocks that already have many numbers. Mini is faster, but the logic is the same." }
        ];
      }
      return [
        { title: "Choose a cell", text: "Tap an empty cell. The highlight shows cells connected to it: the same row, column and 3x3 box." },
        { title: "Place a number", text: "Pick a number below the board. It must not repeat in any highlighted rule area." },
        { title: "Classic rule", text: "Every row, column and 3x3 box must contain numbers 1-9 without repeats. Use notes when several numbers are possible." }
      ];
    }

    if (mode.id === "irregular") {
      return [
        { title: "Что такое острова", text: "Строки и столбцы работают как обычно. Но вместо квадратов 3x3 здесь цветные острова с толстыми границами." },
        { title: "Что значит подсветка", text: "Когда ты нажимаешь на клетку, подсвечиваются её строка, столбец и остров. Число, которое ты ставишь, не должно уже встречаться в этих подсвеченных клетках." },
        { title: "Как ходить", text: "Перед ходом проверь три зоны: строку, столбец и остров выбранной клетки. Внутри одного острова одинаковые числа запрещены." }
      ];
    }
    if (mode.id === "diagonal") {
      return [
        { title: "Классика плюс диагонали", text: "В строках, столбцах и квадратах 3x3 числа не повторяются. В этом режиме две большие диагонали тоже должны содержать числа 1-9 без повторов." },
        { title: "Что значит подсветка", text: "Если клетка лежит на диагонали, она связана не только со строкой, столбцом и квадратом, но и со всей диагональю." },
        { title: "Как ходить", text: "Если число уже стоит на той же диагонали, второе такое число на этой диагонали ставить нельзя. Сначала проверяй диагонали, потом обычные зоны." }
      ];
    }
    if (mode.id === "mini") {
      return [
        { title: "Маленькое поле", text: "Мини использует сетку 6x6 и числа от 1 до 6." },
        { title: "Блоки 2x3", text: "Число не должно повторяться в строке, столбце и маленьком блоке 2x3." },
        { title: "Как ходить", text: "Ищи строки, столбцы или блоки, где уже много чисел. В Мини быстрее находятся единственные возможные варианты." }
      ];
    }
    return [
      { title: "Выбери клетку", text: "Нажми на пустую клетку. Подсветка покажет связанные места: ту же строку, столбец и квадрат 3x3." },
      { title: "Поставь число", text: "Выбери число снизу. Оно не должно повторяться в подсвеченных связанных местах." },
      { title: "Классическое правило", text: "Каждая строка, каждый столбец и каждый квадрат 3x3 должны содержать числа 1-9 без повторов. Если не уверен, включай заметки." }
    ];
  }

  function showGame() {
    state.screen = "game";
    syncStickyBanner(false);
    syncScreenChrome();
    el.menuScreen.hidden = true;
    el.levelScreen.hidden = true;
    el.gameScreen.hidden = false;
    el.backButton.hidden = false;
    removePause("user");
    startTimer();
    renderGame();
    notifyGameplayStart();
  }

  function syncScreenChrome() {
    document.body.dataset.screen = state.screen;
  }

  function startMode(modeId, keepSeed) {
    const mode = modes.find((item) => item.id === modeId) || modes[0];
    const seed = keepSeed && state.puzzle ? state.puzzle.seed : createSeed(mode.id);
    let puzzle;
    try {
      puzzle = createPuzzle(mode, seed);
    } catch (error) {
      showMessage(t("messages.createErrorTitle"), t("messages.createErrorText"), [
        { label: t("messages.toModes"), primary: true, action: showLevelSelect }
      ], { icon: "error" });
      return;
    }
    state.completed = false;
    state.puzzle = puzzle;
    state.board = state.puzzle.givens.slice();
    state.notes = Array.from({ length: mode.size * mode.size }, () => new Set());
    state.history = [];
    state.mistakes = 0;
    state.hintsLeft = mode.hints;
    state.usedHints = 0;
    state.notesMode = false;
    state.showErrors = false;
    el.notesButton.setAttribute("aria-pressed", "false");
    state.selected = firstEmptyCell();
    state.elapsed = 0;
    state.startedAt = Date.now();
    state.data.lastMode = mode.id;
    showGame();
    saveActiveState();
    flushCloudSave();
  }

  function createSeed(modeId) {
    state.seedCounter += 1;
    const now = Date.now();
    let hash = 17;
    for (const char of modeId) hash = (hash * 31 + char.charCodeAt(0)) % rngMod;
    return (now + hash + state.seedCounter * 9973) % rngMod;
  }

  function restoreActivePuzzle() {
    const active = state.data.active;
    if (!active) return false;
    const mode = modes.find((item) => item.id === active.modeId);
    if (!mode) return false;
    const sanitized = sanitizeActiveSave(active);
    if (!sanitized) {
      state.data.active = null;
      saveLocalData();
      return false;
    }
    state.puzzle = {
      mode,
      seed: sanitized.seed,
      generatorVersion: sanitized.generatorVersion,
      solution: sanitized.solution.slice(),
      givens: sanitized.givens.slice()
    };
    state.completed = false;
    state.board = sanitized.board.map((value, index) => state.puzzle.givens[index] || Number(value) || 0);
    state.notes = deserializeNotes(sanitized.notes, mode.size);
    state.history = [];
    state.mistakes = sanitized.mistakes;
    state.hintsLeft = sanitized.hintsLeft;
    state.usedHints = sanitized.usedHints;
    state.notesMode = false;
    el.notesButton?.setAttribute("aria-pressed", "false");
    state.selected = Number.isInteger(sanitized.selected) ? sanitized.selected : firstEmptyCell();
    state.elapsed = sanitized.elapsed;
    state.startedAt = Date.now();
    state.data.lastMode = mode.id;
    return true;
  }

  function serializeNotes() {
    return state.notes.map((set) => Array.from(set));
  }

  function deserializeNotes(notes, size) {
    const length = size * size;
    if (!Array.isArray(notes) || notes.length !== length) {
      return Array.from({ length }, () => new Set());
    }
    return notes.map((items) => new Set((Array.isArray(items) ? items : []).filter((n) => Number.isInteger(n) && n >= 1 && n <= size)));
  }

  function saveActiveState(syncCloud = true) {
    if (!state.puzzle || state.completed) return;
    const active = {
      modeId: state.puzzle.mode.id,
      generatorVersion: state.puzzle.generatorVersion || GENERATOR_VERSION,
      seed: state.puzzle.seed,
      givens: state.puzzle.givens.slice(),
      solution: state.puzzle.solution.slice(),
      board: state.board.slice(),
      notes: serializeNotes(),
      mistakes: state.mistakes,
      hintsLeft: state.hintsLeft,
      usedHints: state.usedHints,
      selected: state.selected,
      elapsed: currentElapsed(),
      savedAt: Date.now()
    };
    state.data.active = active;
    saveLocalData(syncCloud);
  }

  function createPuzzle(mode, seed) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const attemptSeed = (seed + attempt * 104729) % rngMod;
      const rng = createRng(attemptSeed);
      const solution = generateSolvedGrid(mode, rng);
      const givens = digHoles(solution, mode, rng);
      if (givens.filter(Boolean).length === mode.givens && countSolutions(givens, mode, 2) === 1) {
        return { mode, seed: attemptSeed, generatorVersion: GENERATOR_VERSION, solution, givens };
      }
    }
    throw new Error(`Puzzle generation failed for ${mode.id}`);
  }

  function generateSolvedGrid(mode, rng) {
    const size = mode.size;
    const digitMap = shuffle(Array.from({ length: size }, (_, index) => index + 1), rng);
    if (mode.variant === "diagonal") {
      return diagonalBase.map((value) => digitMap[value - 1]);
    }
    if (mode.variant === "irregular") {
      return irregularBase.map((value) => digitMap[value - 1]);
    }
    const rowOrder = mode.variant === "classic" ? shuffledUnitOrder(size, mode.boxRows, rng) : naturalOrder(size);
    const colOrder = mode.variant === "classic" ? shuffledUnitOrder(size, mode.boxCols, rng) : naturalOrder(size);
    const cells = [];

    for (const row of rowOrder) {
      for (const col of colOrder) {
        cells.push(digitMap[patternValue(mode, row, col) - 1]);
      }
    }
    return cells;
  }

  function patternValue(mode, row, col) {
    return (row * mode.boxCols + Math.floor(row / mode.boxRows) + col) % mode.size + 1;
  }

  function naturalOrder(size) {
    return Array.from({ length: size }, (_, index) => index);
  }

  function shuffledUnitOrder(size, unitSize, rng) {
    const groups = [];
    for (let start = 0; start < size; start += unitSize) {
      groups.push(shuffle(Array.from({ length: unitSize }, (_, index) => start + index), rng));
    }
    return shuffle(groups, rng).flat();
  }

  function digHoles(solution, mode, rng) {
    const target = mode.givens;
    const cells = solution.slice();
    const indices = shuffle(Array.from({ length: cells.length }, (_, index) => index), rng);
    let filled = cells.length;

    for (const index of indices) {
      if (filled <= target) break;
      const previous = cells[index];
      cells[index] = 0;
      if (countSolutions(cells, mode, 2) === 1) {
        filled -= 1;
      } else {
        cells[index] = previous;
      }
    }
    return cells;
  }

  function solveGrid(startGrid, mode, rng) {
    const grid = startGrid.slice();
    const solve = () => {
      const choice = findBestEmptyCell(grid, mode, rng);
      if (!choice) return true;
      if (!choice.candidates.length) return false;
      for (const value of choice.candidates) {
        grid[choice.index] = value;
        if (solve()) return true;
        grid[choice.index] = 0;
      }
      return false;
    };
    if (!solve()) throw new Error(`Solved grid generation failed for ${mode.id}`);
    return grid;
  }

  function countSolutions(board, mode, limit = 2) {
    const size = mode.size;
    const grid = board.slice();
    const allMask = (1 << size) - 1;
    const rowMasks = Array(size).fill(0);
    const colMasks = Array(size).fill(0);
    const areaMasks = Array(size).fill(0);
    let mainDiagMask = 0;
    let antiDiagMask = 0;
    const empties = [];
    for (let index = 0; index < grid.length; index += 1) {
      const value = grid[index];
      if (!value) {
        empties.push(index);
        continue;
      }
      const bit = 1 << (value - 1);
      const row = Math.floor(index / size);
      const col = index % size;
      const area = areaIndex(mode, row, col, index);
      if ((rowMasks[row] & bit) || (colMasks[col] & bit) || (areaMasks[area] & bit)) return 0;
      if (mode.variant === "diagonal" && row === col && (mainDiagMask & bit)) return 0;
      if (mode.variant === "diagonal" && row + col === size - 1 && (antiDiagMask & bit)) return 0;
      rowMasks[row] |= bit;
      colMasks[col] |= bit;
      areaMasks[area] |= bit;
      if (mode.variant === "diagonal" && row === col) mainDiagMask |= bit;
      if (mode.variant === "diagonal" && row + col === size - 1) antiDiagMask |= bit;
    }
    let solutions = 0;
    const search = (filled) => {
      if (solutions >= limit) return;
      if (filled === empties.length) {
        solutions += 1;
        return;
      }
      let bestIndex = -1;
      let bestMask = 0;
      let bestCount = 99;
      for (const index of empties) {
        if (grid[index]) continue;
        const row = Math.floor(index / size);
        const col = index % size;
        const area = areaIndex(mode, row, col, index);
        let used = rowMasks[row] | colMasks[col] | areaMasks[area];
        if (mode.variant === "diagonal" && row === col) used |= mainDiagMask;
        if (mode.variant === "diagonal" && row + col === size - 1) used |= antiDiagMask;
        const mask = allMask & ~used;
        const count = bitCount(mask);
        if (!count) return;
        if (count < bestCount) {
          bestCount = count;
          bestMask = mask;
          bestIndex = index;
          if (count === 1) break;
        }
      }
      const row = Math.floor(bestIndex / size);
      const col = bestIndex % size;
      const area = areaIndex(mode, row, col, bestIndex);
      let mask = bestMask;
      while (mask) {
        const bit = mask & -mask;
        mask -= bit;
        grid[bestIndex] = bitToValue(bit);
        rowMasks[row] |= bit;
        colMasks[col] |= bit;
        areaMasks[area] |= bit;
        const wasMain = mode.variant === "diagonal" && row === col;
        const wasAnti = mode.variant === "diagonal" && row + col === size - 1;
        if (wasMain) mainDiagMask |= bit;
        if (wasAnti) antiDiagMask |= bit;
        search(filled + 1);
        if (wasMain) mainDiagMask ^= bit;
        if (wasAnti) antiDiagMask ^= bit;
        areaMasks[area] ^= bit;
        colMasks[col] ^= bit;
        rowMasks[row] ^= bit;
        grid[bestIndex] = 0;
        if (solutions >= limit) return;
      }
    };
    search(0);
    return solutions;
  }

  function areaIndex(mode, row, col, index) {
    if (mode.variant === "irregular") return irregularRegions[index];
    return Math.floor(row / mode.boxRows) * mode.boxRows + Math.floor(col / mode.boxCols);
  }

  function bitCount(mask) {
    let count = 0;
    while (mask) {
      mask &= mask - 1;
      count += 1;
    }
    return count;
  }

  function bitToValue(bit) {
    let value = 1;
    while (bit > 1) {
      bit >>= 1;
      value += 1;
    }
    return value;
  }

  function findBestEmptyCell(grid, mode, rng) {
    let best = null;
    for (let index = 0; index < grid.length; index += 1) {
      if (grid[index]) continue;
      const candidates = getCandidates(grid, mode, index);
      if (rng) shuffle(candidates, rng);
      if (!best || candidates.length < best.candidates.length) {
        best = { index, candidates };
        if (candidates.length <= 1) break;
      }
    }
    return best;
  }

  function getCandidates(grid, mode, index) {
    const candidates = [];
    for (let value = 1; value <= mode.size; value += 1) {
      if (canPlace(grid, mode, index, value)) candidates.push(value);
    }
    return candidates;
  }

  function canPlace(grid, mode, index, value) {
    const size = mode.size;
    const row = Math.floor(index / size);
    const col = index % size;
    for (let c = 0; c < size; c += 1) {
      const peer = row * size + c;
      if (peer !== index && grid[peer] === value) return false;
    }
    for (let r = 0; r < size; r += 1) {
      const peer = r * size + col;
      if (peer !== index && grid[peer] === value) return false;
    }
    if (mode.variant === "irregular") {
      const region = irregularRegions[index];
      for (let peer = 0; peer < irregularRegions.length; peer += 1) {
        if (peer !== index && irregularRegions[peer] === region && grid[peer] === value) return false;
      }
    } else {
      const startRow = Math.floor(row / mode.boxRows) * mode.boxRows;
      const startCol = Math.floor(col / mode.boxCols) * mode.boxCols;
      for (let r = startRow; r < startRow + mode.boxRows; r += 1) {
        for (let c = startCol; c < startCol + mode.boxCols; c += 1) {
          const peer = r * size + c;
          if (peer !== index && grid[peer] === value) return false;
        }
      }
    }
    if (mode.variant === "diagonal") {
      if (row === col) {
        for (let i = 0; i < size; i += 1) {
          const peer = i * size + i;
          if (peer !== index && grid[peer] === value) return false;
        }
      }
      if (row + col === size - 1) {
        for (let i = 0; i < size; i += 1) {
          const peer = i * size + (size - 1 - i);
          if (peer !== index && grid[peer] === value) return false;
        }
      }
    }
    return true;
  }

  function renderGame() {
    const mode = state.puzzle.mode;
    el.modeEyebrow.textContent = `${modeDifficulty(mode)} - ${mode.size}x${mode.size}`;
    el.modeTitle.textContent = modeTitle(mode);
    const legend = modeLegend(mode);
    if (el.modeLegend) {
      el.modeLegend.textContent = legend;
      el.modeLegend.hidden = !legend;
    }
    el.modeDescription.textContent = modeDescription(mode);
    if (el.modeIcon) el.modeIcon.className = `mode-icon mode-icon-${mode.id}`;
    renderBoard();
    renderNumberPad();
    updateHud();
  }

  function renderGameState(options = {}) {
    if (!state.puzzle) {
      updateHud();
      return;
    }
    const {
      board = true,
      numberPad = true,
      hud = true,
      restoreFocus = false
    } = options;
    if (board) renderBoard();
    if (numberPad) renderNumberPad();
    if (hud) updateHud();
    if (restoreFocus) focusSelectedCell();
  }

  function renderBoard() {
    if (!state.puzzle) return;
    const mode = state.puzzle.mode;
    const size = mode.size;
    const selectedValue = state.selected >= 0 ? state.board[state.selected] : 0;
    el.board.className = `sudoku-board board-size-${size} variant-${mode.variant}`;
    el.board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    el.board.removeAttribute("role");
    el.board.removeAttribute("aria-rowcount");
    el.board.removeAttribute("aria-colcount");
    // Keep cell identity (and focus) stable instead of replacing the whole board.
    const existingCells = Array.from(el.board.children);
    for (let index = 0; index < size * size; index += 1) {
      const row = Math.floor(index / size);
      const col = index % size;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.tabIndex = index === state.selected ? 0 : -1;
      button.setAttribute("aria-label", cellAriaLabel(index, row, col));
      const strongBorderWidth = mode.variant === "irregular" ? "3px" : "2px";
      button.style.borderRightWidth = borderAfterColumn(mode, index, col) ? strongBorderWidth : "1px";
      button.style.borderBottomWidth = borderAfterRow(mode, index, row) ? strongBorderWidth : "1px";
      if (mode.variant === "irregular") button.classList.add(`region-${irregularRegions[index]}`);
      if (mode.variant === "diagonal" && (row === col || row + col === size - 1)) button.classList.add("diagonal");
      if (state.puzzle.givens[index]) button.classList.add("given");
      if (index === state.selected) button.classList.add("selected");
      if (state.data.settings.highlight && state.selected >= 0 && isPeer(mode, index, state.selected)) button.classList.add("peer");
      if (selectedValue && state.board[index] === selectedValue) button.classList.add("same");
      if (state.board[index] && state.board[index] === state.puzzle.solution[index] && !state.puzzle.givens[index]) button.classList.add("correct");
      if (isCellError(index)) button.classList.add("error");
      const value = state.board[index];
      if (value) {
        const span = document.createElement("span");
        span.className = "value";
        span.textContent = String(value);
        button.appendChild(span);
      } else if (state.notes[index].size) {
        const notes = document.createElement("span");
        notes.className = "notes";
        for (let n = 1; n <= size; n += 1) {
          const note = document.createElement("span");
          note.textContent = state.notes[index].has(n) ? String(n) : "";
          notes.appendChild(note);
        }
        button.appendChild(notes);
      }
      const existing = existingCells[index];
      if (existing) {
        syncRenderedButton(existing, button);
      } else {
        button.addEventListener("click", () => selectCell(index));
        el.board.appendChild(button);
      }
    }
    existingCells.slice(size * size).forEach((cell) => cell.remove());
  }

  function syncRenderedButton(existing, rendered) {
    for (const attribute of Array.from(existing.attributes)) {
      if (!rendered.hasAttribute(attribute.name)) existing.removeAttribute(attribute.name);
    }
    for (const attribute of rendered.attributes) {
      if (existing.getAttribute(attribute.name) !== attribute.value) {
        existing.setAttribute(attribute.name, attribute.value);
      }
    }
    if (existing.innerHTML !== rendered.innerHTML) existing.replaceChildren(...rendered.childNodes);
  }

  function setTextIfChanged(node, text) {
    if (node.textContent !== text) node.textContent = text;
  }

  function borderAfterColumn(mode, index, col) {
    if (col === mode.size - 1) return false;
    if (mode.variant === "irregular") return irregularRegions[index] !== irregularRegions[index + 1];
    return (col + 1) % mode.boxCols === 0;
  }

  function borderAfterRow(mode, index, row) {
    if (row === mode.size - 1) return false;
    if (mode.variant === "irregular") return irregularRegions[index] !== irregularRegions[index + mode.size];
    return (row + 1) % mode.boxRows === 0;
  }

  function isCellError(index) {
    if (!state.data.settings.autoCheck && !state.showErrors) return false;
    const value = state.board[index];
    return Boolean(value && state.puzzle && value !== state.puzzle.solution[index]);
  }

  function cellAriaLabel(index, row, col) {
    const value = state.board[index];
    const notes = state.notes[index] ? Array.from(state.notes[index]).join(", ") : "";
    const parts = [tf("aria.row", { row: row + 1 }), tf("aria.col", { col: col + 1 })];
    parts.push(value ? tf("aria.value", { value }) : t("aria.empty"));
    if (state.puzzle.givens[index]) parts.push(t("aria.given"));
    if (notes) parts.push(tf("aria.notes", { notes }));
    if (isCellError(index)) parts.push(t("aria.error"));
    return parts.join(", ");
  }

  function renderNumberPad() {
    const size = state.puzzle.mode.size;
    el.numberPad.className = `number-pad pad-size-${size}`;
    const existingButtons = Array.from(el.numberPad.children);
    for (let value = 1; value <= size; value += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(value);
      const correctlyUsedCount = state.board.filter((item, index) => item === value && item === state.puzzle.solution[index]).length;
      button.disabled = !state.notesMode && correctlyUsedCount >= size;
      if (state.selected >= 0 && state.board[state.selected] === value) button.classList.add("selected-number");
      const existing = existingButtons[value - 1];
      if (existing) {
        syncRenderedButton(existing, button);
      } else {
        button.addEventListener("click", () => enterValue(value));
        el.numberPad.appendChild(button);
      }
    }
    existingButtons.slice(size).forEach((button) => button.remove());
  }

  function selectCell(index) {
    if (state.completed || isPaused()) return;
    state.selected = index;
    renderGameState({ restoreFocus: true });
    saveActiveState(false);
  }

  function enterValue(value) {
    if (!state.puzzle || state.completed || state.selected < 0 || isPaused()) return;
    const index = state.selected;
    if (state.puzzle.givens[index]) {
      setTip(t("messages.givenCell"));
      playTone("warn");
      return;
    }
    if (state.notesMode) {
      const hadValue = state.notes[index].has(value);
      const hadBoardValue = state.board[index] !== 0;
      if (hadBoardValue || !hadValue) {
        pushHistory();
        state.board[index] = 0;
        state.notes[index].add(value);
      } else if (hadValue) {
        pushHistory();
        state.notes[index].delete(value);
      }
      playTone("tap");
    } else {
      const same = state.board[index] === value;
      if (same) {
        pushHistory();
        state.board[index] = 0;
        state.notes[index].clear();
        setTip(t("messages.erased"));
        playTone("tap");
        renderGameState();
        saveActiveState();
        return;
      }
      pushHistory();
      state.board[index] = same ? 0 : value;
      state.notes[index].clear();
      if (state.data.settings.autoCheck && value !== state.puzzle.solution[index]) {
        state.mistakes += 1;
        setTip(t("messages.wrongNumber"));
        playTone("warn");
      } else {
        removeSolvedValueFromPeers(index, value);
        setTip(t("messages.goodMove"));
        playTone("ok");
        moveSelectionForward();
      }
    }
    renderGameState();
    saveActiveState();
    checkWin();
  }

  function eraseSelected() {
    if (!state.puzzle || state.completed || state.selected < 0 || isPaused()) return;
    const index = state.selected;
    if (state.puzzle.givens[index] || (!state.board[index] && !state.notes[index].size)) return;
    pushHistory();
    state.board[index] = 0;
    state.notes[index].clear();
    renderGameState();
    saveActiveState();
  }

  function pushHistory() {
    state.history.push({
      board: state.board.slice(),
      notes: serializeNotes(),
      mistakes: state.mistakes,
      hintsLeft: state.hintsLeft,
      usedHints: state.usedHints,
      selected: state.selected,
      notesMode: state.notesMode
    });
    if (state.history.length > 80) state.history.shift();
  }

  function undo() {
    if (state.completed || !state.history.length || isPaused()) return;
    const previous = state.history.pop();
    state.board = previous.board;
    state.notes = deserializeNotes(previous.notes, state.puzzle.mode.size);
    state.mistakes = previous.mistakes;
    state.hintsLeft = previous.hintsLeft;
    state.usedHints = previous.usedHints || 0;
    state.selected = previous.selected;
    state.notesMode = Boolean(previous.notesMode);
    el.notesButton.setAttribute("aria-pressed", String(state.notesMode));
    renderGameState();
    saveActiveState();
  }

  function toggleNotesMode() {
    if (state.completed) return;
    state.notesMode = !state.notesMode;
    el.notesButton.setAttribute("aria-pressed", String(state.notesMode));
    setTip(state.notesMode ? t("messages.notesOn") : t("messages.notesOff"));
    renderGameState({ board: false });
  }

  function requestHint() {
    if (!state.puzzle || state.completed || isPaused()) return;
    if (state.hintsLeft <= 0) {
      if (!requestRewardedHint()) {
        setTip(t("messages.noFreeHints"));
        playTone("warn");
      }
      return;
    }
    applyHint();
  }

  function requestRewardedHint() {
    if (!state.sdk?.adv || typeof state.sdk.adv.showRewardedVideo !== "function") return false;
    let rewardGranted = false;
    const handleError = () => {
      removePause("ad");
      setTip(t("messages.adUnavailable"));
    };
    addPause("ad");
    saveActiveState(false);
    flushCloudSave();
    try {
      const result = state.sdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: () => addPause("ad"),
          onRewarded: () => {
            if (rewardGranted) return;
            rewardGranted = true;
            state.hintsLeft += 1;
            setTip(t("messages.rewardedHint"));
            renderGame();
            saveActiveState();
            flushCloudSave();
          },
          onClose: () => removePause("ad"),
          onError: handleError
        }
      });
      if (result && typeof result.catch === "function") result.catch(handleError);
      return true;
    } catch (error) {
      handleError();
      return true;
    }
  }

  function runFullscreenAdBefore(continuation) {
    if (state.fullscreenAdInFlight) return;
    const showFullscreenAdv = state.sdk?.adv?.showFullscreenAdv;
    let continued = false;
    const continueOnce = () => {
      if (continued) return;
      continued = true;
      state.fullscreenAdInFlight = false;
      removePause("ad");
      syncStickyBanner(state.screen !== "game");
      continuation?.();
    };
    if (typeof showFullscreenAdv !== "function") {
      continueOnce();
      return;
    }
    state.fullscreenAdInFlight = true;
    saveActiveState(false);
    flushCloudSave();
    addPause("ad");
    try {
      const result = showFullscreenAdv.call(state.sdk.adv, {
        callbacks: {
          onOpen: () => addPause("ad"),
          onClose: () => continueOnce(),
          onError: () => continueOnce()
        }
      });
      if (result && typeof result.catch === "function") result.catch(() => continueOnce());
    } catch (error) {
      continueOnce();
    }
  }

  function syncStickyBanner(shouldShow) {
    const wanted = Boolean(shouldShow);
    if (state.stickyBannerWanted === wanted && state.stickyBannerInFlight === null) return;
    state.stickyBannerWanted = wanted;
    applyStickyBanner();
  }

  function applyStickyBanner() {
    if (state.stickyBannerInFlight !== null) return;
    const adv = state.sdk?.adv;
    const shouldShow = state.stickyBannerWanted;
    const method = shouldShow ? adv?.showBannerAdv : adv?.hideBannerAdv;
    if (typeof method !== "function") return;
    state.stickyBannerInFlight = shouldShow;
    const finish = () => {
      if (state.stickyBannerInFlight !== shouldShow) return;
      state.stickyBannerInFlight = null;
      if (state.stickyBannerWanted !== shouldShow) applyStickyBanner();
    };
    try {
      const result = method.call(adv);
      Promise.resolve(result).then(finish, finish);
    } catch (error) {
      finish();
    }
  }

  function applyHint() {
    const target = findHintTarget();
    if (target < 0) return;
    pushHistory();
    state.board[target] = state.puzzle.solution[target];
    state.notes[target].clear();
    state.selected = target;
    state.hintsLeft -= 1;
    state.usedHints += 1;
    removeSolvedValueFromPeers(target, state.board[target]);
    setTip(t("messages.hintApplied"));
    playTone("ok");
    renderGameState();
    saveActiveState();
    checkWin();
  }

  function findHintTarget() {
    if (!state.puzzle) return -1;
    const canChange = (index) => index >= 0 && !state.puzzle.givens[index];
    if (canChange(state.selected) && state.board[state.selected] !== state.puzzle.solution[state.selected]) {
      return state.selected;
    }
    const wrongFilled = state.board.findIndex((value, index) => canChange(index) && value && value !== state.puzzle.solution[index]);
    if (wrongFilled >= 0) return wrongFilled;
    return state.board.findIndex((value, index) => canChange(index) && !value);
  }

  function removeSolvedValueFromPeers(index, value) {
    if (!value || !state.puzzle) return;
    for (let peer = 0; peer < state.board.length; peer += 1) {
      if (isPeer(state.puzzle.mode, peer, index)) state.notes[peer].delete(value);
    }
  }

  function checkWin() {
    if (!state.puzzle || state.completed) return;
    const filled = state.board.every(Boolean);
    if (!filled) return;
    const solved = state.board.every((value, index) => value === state.puzzle.solution[index]);
    if (!solved) {
      state.showErrors = true;
      renderBoard();
      showMessage(t("messages.errorsTitle"), t("messages.errorsText"), [
        { label: t("continue"), primary: true }
      ], { icon: "error" });
      return;
    }
    state.completed = true;
    stopTimer();
    const modeId = state.puzzle.mode.id;
    const time = currentElapsed();
    const best = state.data.best[modeId];
    if (!best || time < best.time) {
      state.data.best[modeId] = { time, mistakes: state.mistakes, completedAt: Date.now() };
    }
    const unlockedAchievements = updateCompletionStats(modeId, time);
    playTone("win");
    updateHud();
    state.data.active = null;
    saveLocalData();
    flushCloudSave();
    notifyGameplayStop();
    showMessage(t("messages.winTitle"), buildWinMessage(time, state.mistakes, unlockedAchievements), [
      { label: t("messages.newGrid"), primary: true, action: () => runFullscreenAdBefore(() => startMode(modeId, false)) },
      { label: t("messages.toModes"), action: showLevelSelect },
      { label: t("messages.toMenu"), action: showMenu }
    ], { icon: "win", lockEscape: true, html: true });
  }

  function updateCompletionStats(modeId, time) {
    const stats = state.data.stats || createEmptyStats();
    const achievements = state.data.achievements || createEmptyAchievements();
    const unlocked = [];
    const unlock = (key) => {
      if (achievements[key]) return;
      achievements[key] = true;
      unlocked.push(key);
    };
    const modeStats = stats.byMode[modeId] || { wins: 0, totalTime: 0, perfectWins: 0, noHintWins: 0, bestTime: 0 };
    const noMistakes = state.mistakes === 0;
    const noHints = state.usedHints === 0;
    stats.wins += 1;
    stats.totalTime += time;
    if (noMistakes) stats.perfectWins += 1;
    if (noHints) stats.noHintWins += 1;
    modeStats.wins += 1;
    modeStats.totalTime += time;
    if (noMistakes) modeStats.perfectWins += 1;
    if (noHints) modeStats.noHintWins += 1;
    modeStats.bestTime = modeStats.bestTime ? Math.min(modeStats.bestTime, time) : time;
    stats.byMode[modeId] = modeStats;
    unlock("firstWin");
    if (noMistakes) unlock("noMistakes");
    if (noHints) unlock("noHints");
    if (modes.every((mode) => (stats.byMode[mode.id]?.wins || 0) > 0)) unlock("allModes");
    if (modeId === "mini" && time <= 180) unlock("fastMini");
    state.data.stats = stats;
    state.data.achievements = achievements;
    return unlocked;
  }

  function updateHud() {
    setTextIfChanged(el.timerText, formatTime(currentElapsed()));
    setTextIfChanged(el.mistakesText, String(state.mistakes));
    setTextIfChanged(el.hintsText, String(state.hintsLeft));
    el.gameScreen.classList.toggle("is-user-paused", state.pausedReasons.has("user"));
    el.gameScreen.classList.toggle("is-completed", state.completed);
    if (!state.puzzle) {
      el.progressText.textContent = "0%";
      if (el.progressFill) el.progressFill.style.width = "0%";
      if (el.progressTrack) el.progressTrack.setAttribute("aria-valuenow", "0");
      el.undoButton.disabled = true;
      el.eraseButton.disabled = true;
      el.hintButton.disabled = true;
      el.hintButton.classList.remove("rewarded-mode");
      state.lastHintButtonMode = null;
      return;
    }
    const hintMode = state.hintsLeft > 0 ? "free" : "rewarded";
    const rewardedMode = hintMode === "rewarded";
    const hintLabel = hintMode === "free" ? t("hint") : t("adHint");
    el.hintButton.classList.toggle("rewarded-mode", rewardedMode);
    el.hintButton.setAttribute("aria-label", hintLabel);
    if (state.lastHintButtonMode !== hintMode) {
      state.lastHintButtonMode = hintMode;
      setIconButton(el.hintButton, hintLabel, "hint");
    }
    const correct = state.board.filter((value, index) => value && value === state.puzzle.solution[index]).length;
    const progress = Math.round((correct / state.board.length) * 100);
    setTextIfChanged(el.progressText, `${progress}%`);
    if (el.progressFill) el.progressFill.style.width = `${progress}%`;
    if (el.progressTrack) el.progressTrack.setAttribute("aria-valuenow", String(progress));
    el.undoButton.disabled = !state.history.length;
    const selectedValue = state.selected >= 0 ? state.board[state.selected] : 0;
    const hasNotes = state.selected >= 0 && state.notes[state.selected]?.size > 0;
    el.eraseButton.disabled = state.selected < 0 || Boolean(state.puzzle.givens[state.selected]) || (!selectedValue && !hasNotes);
    el.hintButton.disabled = state.board.every(Boolean) && state.board.every((value, index) => value === state.puzzle.solution[index]);
  }

  function startTimer() {
    stopTimer();
    state.startedAt = Date.now();
    state.timerId = window.setInterval(() => {
      if (!isPaused()) updateHud();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = 0;
    }
  }

  function currentElapsed() {
    if (!state.puzzle) return 0;
    if (isPaused()) return state.elapsed;
    return state.elapsed + Math.floor((Date.now() - state.startedAt) / 1000);
  }

  function addPause(reason) {
    if (state.screen !== "game") return;
    if (!state.pausedReasons.size) {
      state.elapsed = currentElapsed();
      notifyGameplayStop();
    }
    state.pausedReasons.add(reason);
    suspendAudio();
    updateHud();
  }

  function removePause(reason) {
    if (!state.pausedReasons.has(reason)) return;
    state.pausedReasons.delete(reason);
    if (!state.pausedReasons.size && state.screen === "game" && state.puzzle && !state.completed) {
      state.startedAt = Date.now();
      resumeAudioIfNeeded();
      notifyGameplayStart();
    }
    updateHud();
  }

  function clearPauses() {
    state.pausedReasons.clear();
    updateHud();
  }

  function resumeAudioIfNeeded() {
    if (state.screen !== "game" || !state.puzzle || state.completed || isPaused()) return;
    if (state.audio && state.audio.state === "suspended" && state.data.settings.sound) {
      state.audio.resume().catch(() => {});
    }
  }

  function suspendAudio() {
    if (state.audio && state.audio.state === "running") {
      state.audio.suspend().catch(() => {});
    }
  }

  function isPaused() {
    return state.pausedReasons.size > 0;
  }

  function pauseByUser() {
    addPause("user");
    saveActiveState();
    flushCloudSave();
    showMessage(t("messages.pauseTitle"), t("messages.pauseText"), [
      { label: t("continue"), primary: true, action: resumeFromPause },
      { label: t("messages.toMenu"), action: showMenu }
    ], { icon: "pause" });
  }

  function resumeFromPause() {
    removePause("user");
  }

  function confirmNewPuzzle() {
    showMessage(t("messages.newPuzzleTitle"), t("messages.newPuzzleText"), [
      { label: t("messages.startNew"), primary: true, action: () => runFullscreenAdBefore(() => startMode(state.puzzle.mode.id, false)) },
      { label: t("messages.stay") }
    ], { icon: "warning" });
  }

  function showStats() {
    const stats = state.data.stats || createEmptyStats();
    const average = stats.wins ? Math.round(stats.totalTime / stats.wins) : 0;
    const modeLines = modes
      .map((mode) => {
        const item = stats.byMode[mode.id];
        const best = state.data.best[mode.id];
        if (!item?.wins && !best) return null;
        const bestTime = item?.bestTime || best?.time || 0;
        return tf("statsText.modeLine", {
          mode: modeTitle(mode),
          wins: item?.wins || 0,
          best: bestTime ? formatTime(bestTime) : t("statsText.none")
        });
      })
      .filter(Boolean);
    const text = [
      tf("statsText.wins", { wins: stats.wins, average: average ? formatTime(average) : t("statsText.none") }),
      tf("statsText.clean", { perfect: stats.perfectWins, noHints: stats.noHintWins }),
      modeLines.length ? modeLines.join("\n") : t("statsText.empty")
    ].join("\n");
    showMessage(t("statistics"), text, [{ label: t("messages.ok"), primary: true }], { icon: "stats" });
  }

  function showAchievements() {
    showAchievementsDetailed();
  }

  function showAchievementsDetailed() {
    const achievements = state.data.achievements || createEmptyAchievements();
    const html = `<span class="achievement-list">${achievementDefinitions.map((item) => achievementCardHtml(item, Boolean(achievements[item.key]))).join("")}</span>`;
    showMessage(t("achievements"), html, [{ label: t("messages.ok"), primary: true }], { icon: "trophy", html: true });
  }

  function buildWinMessage(time, mistakes, unlockedKeys) {
    const base = `<span class="message-paragraph">${escapeHtml(tf("messages.winText", { time: formatTime(time), mistakes }))}</span>`;
    if (!unlockedKeys.length) return base;
    const unlocked = unlockedKeys
      .map((key) => achievementDefinitions.find((item) => item.key === key))
      .filter(Boolean)
      .map((item) => achievementCardHtml(item, true, true))
      .join("");
    return `${base}<span class="achievement-unlocked-title">${escapeHtml(t("achievementUnlockedTitle"))}</span><span class="achievement-list">${unlocked}</span>`;
  }

  function achievementCardHtml(item, done, fresh = false) {
    const status = done ? t("achievementReceived") : t("achievementLocked");
    return `
      <span class="achievement-card ${done ? "is-done" : "is-locked"} ${fresh ? "is-fresh" : ""}">
        ${achievementIconHtml(item.key)}
        <span class="achievement-copy">
          <strong>${escapeHtml(t(item.titleKey))}</strong>
          <span>${escapeHtml(t(item.descriptionKey))}</span>
          <small>${escapeHtml(t("achievementRewardPrefix"))}: ${escapeHtml(t(item.rewardKey))} &middot; ${escapeHtml(status)}</small>
        </span>
      </span>
    `;
  }

  function achievementIconHtml(key) {
    const path = achievementIconPaths[key] || achievementIconPaths.firstWin;
    return `
      <span class="achievement-badge achievement-badge-${key}" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">${path}</svg>
      </span>
    `;
  }

  function showMessage(title, text, actions, options = {}) {
    addPause("modal");
    pushModal(el.messageModal, "modal", document.activeElement, options);
    if (el.messageModalIcon) {
      const icon = options.icon || "pause";
      el.messageModalIcon.className = `modal-icon modal-icon-${icon}`;
      el.messageModalIcon.innerHTML = svgIcon(icon, "modal-svg");
    }
    el.messageTitle.textContent = title;
    if (options.html) el.messageText.innerHTML = text;
    else el.messageText.textContent = text;
    el.messageActions.innerHTML = "";
    actions.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.label;
      if (item.primary) button.className = "primary-button";
      button.addEventListener("click", () => {
        const action = item.action;
        hideMessage();
        action?.();
      });
      el.messageActions.appendChild(button);
    });
    el.messageModal.hidden = false;
    el.messageActions.querySelector("button")?.focus?.();
  }

  function hideMessage() {
    const entry = closeModal(el.messageModal);
    removePause("modal");
    if (entry?.returnFocus && document.contains(entry.returnFocus)) entry.returnFocus.focus?.();
  }

  function openSettings(event) {
    addPause("settings");
    // Safari does not always focus a button when it is tapped/clicked.
    // Remember the actual opener rather than whichever element kept focus.
    pushModal(el.settingsModal, "settings", event?.currentTarget || document.activeElement);
    syncSettingsControls();
    el.settingsModal.hidden = false;
    el.closeSettingsButton.focus?.();
  }

  function closeSettings() {
    const entry = closeModal(el.settingsModal);
    removePause("settings");
    if (entry?.returnFocus && document.contains(entry.returnFocus)) entry.returnFocus.focus?.();
  }

  function pushModal(modal, pauseReason, returnFocus, options = {}) {
    state.modalStack = state.modalStack.filter((entry) => entry.modal !== modal);
    state.modalStack.push({ modal, pauseReason, returnFocus, lockEscape: Boolean(options.lockEscape) });
    modal.hidden = false;
    syncModalAccessibility();
  }

  function closeModal(modal) {
    const index = state.modalStack.findIndex((entry) => entry.modal === modal);
    const entry = index >= 0 ? state.modalStack.splice(index, 1)[0] : null;
    modal.hidden = true;
    syncModalAccessibility();
    return entry;
  }

  function syncModalAccessibility() {
    const hasModal = state.modalStack.length > 0;
    const appShell = document.querySelector(".app-shell");
    if (appShell) appShell.inert = hasModal;
    document.body.classList.toggle("has-open-modal", hasModal);
  }

  function closeTopModal() {
    const top = state.modalStack[state.modalStack.length - 1];
    if (!top) return false;
    if (top.modal === el.messageModal) {
      if (top.lockEscape) return true;
      const wasUserPaused = state.pausedReasons.has("user");
      hideMessage();
      if (wasUserPaused) resumeFromPause();
      return true;
    }
    if (top.modal === el.settingsModal) {
      closeSettings();
      return true;
    }
    return false;
  }

  function resetProgress() {
    showMessage(t("messages.resetTitle"), t("messages.resetText"), [
      { label: t("messages.reset"), primary: true, action: confirmResetProgress },
      { label: t("messages.keep") }
    ], { icon: "warning" });
  }

  function confirmResetProgress() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (error) {}
    state.data = sanitizeSave(null);
    syncSettingsControls();
    state.puzzle = null;
    saveLocalData();
    closeSettings();
    showMenu();
  }

  function setTip(text) {
    el.tipText.textContent = text;
  }

  function handleKey(event) {
    if (state.modalStack.length) {
      const topModal = state.modalStack[state.modalStack.length - 1].modal;
      if (event.key === "Tab") {
        trapModalFocus(event, topModal);
        return;
      }
      if (event.key === "Escape") {
        closeTopModal();
        return;
      }
      return;
    }
    if (state.screen !== "game" || !state.puzzle || state.completed) return;
    const size = state.puzzle.mode.size;
    if (/^[1-9]$/.test(event.key)) {
      const value = Number(event.key);
      if (value <= size) enterValue(value);
    } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      eraseSelected();
    } else if (event.key.toLowerCase() === "n") {
      toggleNotesMode();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      moveSelectionByKey(event.key);
      event.preventDefault();
    }
  }

  function trapModalFocus(event, modal) {
    const focusable = Array.from(modal.querySelectorAll("button, input, [href], select, textarea, [tabindex]:not([tabindex='-1'])"))
      .filter((item) => !item.disabled && item.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function moveSelectionByKey(key) {
    if (state.completed) return;
    const size = state.puzzle.mode.size;
    let row = Math.floor(state.selected / size);
    let col = state.selected % size;
    if (key === "ArrowUp") row = (row + size - 1) % size;
    if (key === "ArrowDown") row = (row + 1) % size;
    if (key === "ArrowLeft") col = (col + size - 1) % size;
    if (key === "ArrowRight") col = (col + 1) % size;
    state.selected = row * size + col;
    renderGameState({ restoreFocus: true });
    saveActiveState(false);
  }

  function focusSelectedCell() {
    const selected = el.board.querySelector(".cell.selected");
    selected?.focus?.({ preventScroll: true });
  }

  function moveSelectionForward() {
    const size = state.puzzle.mode.size;
    for (let step = 1; step <= size * size; step += 1) {
      const next = (state.selected + step) % (size * size);
      if (!state.board[next] && !state.puzzle.givens[next]) {
        state.selected = next;
        return;
      }
    }
  }

  function firstEmptyCell() {
    if (!state.puzzle) return -1;
    return state.puzzle.givens.findIndex((value) => !value);
  }

  function isPeer(mode, a, b) {
    if (a === b || a < 0 || b < 0) return false;
    const size = mode.size;
    const ar = Math.floor(a / size);
    const ac = a % size;
    const br = Math.floor(b / size);
    const bc = b % size;
    if (ar === br || ac === bc) return true;
    if (mode.variant === "irregular") return irregularRegions[a] === irregularRegions[b];
    if (Math.floor(ar / mode.boxRows) === Math.floor(br / mode.boxRows) && Math.floor(ac / mode.boxCols) === Math.floor(bc / mode.boxCols)) return true;
    if (mode.variant === "diagonal") {
      const mainA = ar === ac;
      const mainB = br === bc;
      const antiA = ar + ac === size - 1;
      const antiB = br + bc === size - 1;
      return (mainA && mainB) || (antiA && antiB);
    }
    return false;
  }

  function hasConflict(index) {
    const value = state.board[index];
    return Boolean(value && !canPlaceWithSelf(state.board, state.puzzle.mode, index, value));
  }

  function createRng(seed) {
    let value = Math.max(1, Math.floor(seed) % rngMod);
    return () => {
      value = (value * 48271) % rngMod;
      return value / rngMod;
    };
  }

  function shuffle(items, rng) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function playTone(kind, force = false) {
    if (!state.data.settings.sound) return;
    if (!force && (state.screen !== "game" || !state.puzzle || state.completed || isPaused())) return;
    try {
      if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = state.audio;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const freq = kind === "warn" ? 180 : kind === "win" ? 660 : kind === "ok" ? 420 : 300;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "win" ? 0.22 : 0.08));
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (kind === "win" ? 0.24 : 0.1));
    } catch (error) {
      state.data.settings.sound = false;
    }
  }

  function notifyGameplayStart() {
    if (state.gameplayMarkedActive || state.screen !== "game" || !state.puzzle || state.completed || state.pausedReasons.size) return;
    const start = state.sdk?.features?.GameplayAPI?.start;
    if (typeof start !== "function") return;
    try {
      start.call(state.sdk.features.GameplayAPI);
      state.gameplayMarkedActive = true;
    } catch (error) {
      state.gameplayMarkedActive = false;
    }
  }

  function notifyGameplayStop() {
    if (!state.gameplayMarkedActive) return;
    state.gameplayMarkedActive = false;
    const stop = state.sdk?.features?.GameplayAPI?.stop;
    if (typeof stop !== "function") return;
    try {
      stop.call(state.sdk.features.GameplayAPI);
    } catch (error) {
      // Gameplay state remains stopped even if the SDK signal fails.
    }
  }

  function installSelfTests() {
    window.lightSudokuSelfTest = (seedCount = 50) => {
      const started = Date.now();
      const problems = [];
      let testedPuzzles = 0;
      const regionProblem = validateIrregularRegions();
      if (regionProblem) problems.push(regionProblem);
      modes.forEach((mode) => {
        for (let offset = 0; offset < seedCount; offset += 1) {
          const seed = 12345 + mode.size * 1000 + mode.order.charCodeAt(0) * 17 + offset;
          const puzzle = createPuzzle(mode, seed);
          testedPuzzles += 1;
          if (puzzle.solution.length !== mode.size * mode.size) {
            problems.push({ mode: mode.id, seed, type: "wrong-solution-size" });
          }
          if (puzzle.givens.filter(Boolean).length !== mode.givens) {
            problems.push({ mode: mode.id, seed, type: "wrong-givens-count", expected: mode.givens, actual: puzzle.givens.filter(Boolean).length });
          }
          if (!puzzle.solution.every((value, index) => canPlaceWithSelf(puzzle.solution, mode, index, value))) {
            problems.push({ mode: mode.id, seed, type: "invalid-solution" });
          }
          if (puzzle.givens.some((value, index) => value && value !== puzzle.solution[index])) {
            problems.push({ mode: mode.id, seed, type: "givens-do-not-match-solution" });
          }
          const solutionsFound = countSolutions(puzzle.givens, mode, 2);
          if (solutionsFound !== 1) {
            problems.push({ mode: mode.id, seed, type: solutionsFound > 1 ? "multiple-solutions" : "no-solution", solutionsFound });
          }
        }
      });
      return { ok: problems.length === 0, testedPuzzles, durationMs: Date.now() - started, problems };
    };
  }

  function validateIrregularRegions() {
    const buckets = Array.from({ length: 9 }, () => []);
    irregularRegions.forEach((region, index) => {
      if (!Number.isInteger(region) || region < 0 || region > 8) return;
      buckets[region].push(index);
    });
    for (let region = 0; region < buckets.length; region += 1) {
      if (buckets[region].length !== 9) {
        return { mode: "irregular", type: "bad-region-size", region, size: buckets[region].length };
      }
      if (!isConnectedRegion(buckets[region], 9)) {
        return { mode: "irregular", type: "disconnected-region", region };
      }
      const rows = new Set(buckets[region].map((index) => Math.floor(index / 9)));
      const cols = new Set(buckets[region].map((index) => index % 9));
      if (rows.size === 1) return { mode: "irregular", type: "region-is-row", region };
      if (cols.size === 1) return { mode: "irregular", type: "region-is-column", region };
      if (rows.size === 3 && cols.size === 3) {
        const rowGroup = Math.floor(buckets[region][0] / 27);
        const colGroup = Math.floor((buckets[region][0] % 9) / 3);
        const isBox = buckets[region].every((index) => Math.floor(Math.floor(index / 9) / 3) === rowGroup && Math.floor((index % 9) / 3) === colGroup);
        if (isBox) return { mode: "irregular", type: "region-is-box", region };
      }
    }
    return null;
  }

  function isConnectedRegion(indices, size) {
    const cells = new Set(indices);
    const seen = new Set([indices[0]]);
    const stack = [indices[0]];
    while (stack.length) {
      const index = stack.pop();
      const row = Math.floor(index / size);
      const col = index % size;
      [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {
        const next = r * size + c;
        if (r >= 0 && r < size && c >= 0 && c < size && cells.has(next) && !seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      });
    }
    return seen.size === indices.length;
  }

  function canPlaceWithSelf(grid, mode, index, value) {
    const copy = grid.slice();
    copy[index] = 0;
    return canPlace(copy, mode, index, value);
  }

  if (window.__LIGHT_SUDOKU_TEST__ === true) {
    window.lightSudokuDebug = {
      newPuzzle: (modeId) => startMode(modeId || state.data.lastMode || "classic", false),
      selfTest: () => window.lightSudokuSelfTest(),
      countSolutions,
      solveCurrent: () => {
        if (!state.puzzle) return;
        state.board = state.puzzle.solution.slice();
        renderGame();
        checkWin();
      }
    };
  }
})();
