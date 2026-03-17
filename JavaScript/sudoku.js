/* HANDLE SUDOKU LOGIC AND GAME STATE */

// screens
const start_screen = document.querySelector('#start-screen'); 
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');

let cells = document.querySelectorAll('.main-grid-cell');

// values
const name_input = document.querySelector('#input-name');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');

// handle level logic
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

const name_display = document.querySelector('#player-name-display');
let timer = null;
let timeElapsed = 0;



const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const initialize = () => {
    const theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);

    const game = getGameInfo();

    // reset level name display on reload
    level_index = 0;
    level = CONSTANT.LEVEL[level_index];
    document.querySelector('#btn-level').innerHTML = CONSTANT.LEVEL_NAME[level_index];

    showStartScreen();

    const continueBtn = document.querySelector('#btn-continue');
    if (continueBtn) continueBtn.style.display = game ? 'grid' : 'none';

    initializeGameGrid();
}

const applyTheme = (theme) => {
    document.body.classList.remove('dark','blueberry', 'sage', 'matcha', 'pink', 'honey', 'lavender', 'polar'); 
    
    if (theme !== 'light') {
        document.body.classList.add(theme);
    }

    localStorage.setItem('theme', theme);

    // metadata color map for mobile browsers
    const metaColors = {
        'light': '#f5ebe0',
        'dark': '#1e1e2e',
        'blueberry': '#1a1c2c',
        'sage': '#f1f7ed',
        'matcha': '#e2efc7',
        'pink': '#fff1f2',
        'honey': '#fff9ec',
        'lavender': '#f3f0ff',
        'polar': '#e0f2f1'
    };

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', metaColors[theme] || '#f5ebe0');
    }
}

// add spacing between the 3x3 boxes in the sudoku grid
const initializeGameGrid = () => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            let index = row * CONSTANT.GRID_SIZE + col;
            // add bottom margin after rows 2 and 5 (to separate boxes vertically)
            if (row === 2 || row === 5) {
                cells[index].style.marginBottom = '10px';
            }
            // add right margin after columns 2 and 5 (to separate boxes horizontally)
            if (col === 2 || col === 5) {
                cells[index].style.marginRight = '10px';
            }
        }
    }
}

// add event listeners to buttons
document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1  ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];

    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

document.querySelector('#btn-play').addEventListener('click', () => {
    const nameValue = name_input.value.trim();
    if(nameValue.length > 0){
        name_input.classList.add('input-confirm-anim');
        setTimeout(() => {
            startGame(false, nameValue);
            name_input.classList.remove('input-confirm-anim');
        }, 500);
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});

document.querySelector('#btn-continue').addEventListener('click', () => {
    startGame(true); // isContinue = true so it restores saved time/level
});

// handle theme toggle
document.querySelectorAll('#theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const themeMenu = e.target.parentNode.querySelector('#theme-menu');
        themeMenu.classList.toggle('active');
    });
});

// handle theme selection
document.querySelectorAll('.theme-opt').forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        applyTheme(theme);

        // close the menu after selection
        document.querySelectorAll('#theme-menu').forEach(menu => {
            menu.classList.remove('active', 'show');
        });
    });
});

const startGame = (isContinue = false, providedName = null) => {
    const savedGame = getGameInfo();
    let finalName = "";

    // level timer and name handling
    if (isContinue && savedGame) {
        finalName = localStorage.getItem('player_name') || 'Guest';
        
        level_index = savedGame.level_index;
        level = savedGame.level;                // restore what was saved 
        timeElapsed = savedGame.timeElapsed;
        console.log("Continuing as:", finalName);
    } else {
        finalName = providedName || name_input.value.trim() || "Guest";
        timeElapsed = 0;

        localStorage.setItem('player_name', finalName);
        console.log("New game started for:", finalName);
    }

    // update displays
    name_display.innerHTML = finalName;
    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];
    
    if (timer) clearInterval(timer);
    startTimer();

    showGameScreen();

    // save the state
    localStorage.setItem('game', JSON.stringify({ 
        level: level, 
        level_index: level_index,
        timeElapsed: timeElapsed,
        started: true 
    }));
}

const startTimer = () => {
    timer = setInterval(() => {
        timeElapsed++;
        
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        game_time.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // save only time progress to the existing game object
        const currentGame = getGameInfo();
        if (currentGame) {
            currentGame.timeElapsed = timeElapsed;
            localStorage.setItem('game', JSON.stringify(currentGame));
        }
    }, 1000);
};

// show screen methods
const showStartScreen = () => {
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    pause_screen.classList.remove('active');
    document.querySelector('.main-game').classList.remove('active');

    name_input.value = "";
    
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    game_time.innerHTML = '00:00';
};

const showGameScreen = () => {
    start_screen.classList.remove('active');
    document.querySelector('.main-game').classList.add('active');
};

document.querySelector('#btn-pause').addEventListener('click', () => {
    // stop the interval
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // update the stats in the pause screenn
    document.querySelector('#pause-timer-display').innerHTML = game_time.innerHTML;
    document.querySelector('#pause-level-display').innerHTML = CONSTANT.LEVEL_NAME[level_index];
    
    // show pause screen
    pause_screen.classList.add('active');
});

// handle resume
document.querySelector('#btn-resume').addEventListener('click', () => {
    const pauseScreen = document.querySelector('#pause-screen');
    pauseScreen.classList.add('exit-anim');

    setTimeout(() => {
        pauseScreen.classList.remove('active', 'exit-anim');
        startTimer();
    }, 300);
});

// handle quit to menu
document.querySelector('#btn-quit').addEventListener('click', () => {
    pause_screen.classList.remove('active');
    showStartScreen();
});

// side pop up theme
const btnThemePause = document.querySelector('#btn-theme-pause');
const themePopup = document.querySelector('#theme-popup');

if (btnThemePause) {
    btnThemePause.addEventListener('click', (e) => {
        e.stopPropagation(); 
        themePopup.classList.toggle('active');
    });
}

// close when clicking anywhere else
document.addEventListener('click', (e) => {
    if (themePopup && !themePopup.contains(e.target)) {
        themePopup.classList.remove('active');
    }
});

// Setters
const setPlayerName = (name) => localStorage.setItem('player_name', name);

// Getters
const getPLayerName = () => localStorage.getItem('player_name');


initialize();