/* HANDLE SUDOKU LOGIC AND GAME STATE */

// screens
const start_screen = document.querySelector('#start-screen'); 
const game_screen = document.querySelector('#game-screen');

let cells = document.querySelectorAll('.main-grid-cell');

// values
const name_input = document.querySelector('#input-name');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');

// handle level logic
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const initialize = () => {
    const theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);

    const game = getGameInfo();
    showStartScreen();
    //if (game) {
    //    showGameScreen();
    //} else {
    //    showStartScreen();
    //}

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
    if(name_input.value.trim().length > 0){
        showGameScreen();
        // save game state to localStorage
        localStorage.setItem('game', JSON.stringify({ level: level, started: true }));
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});

document.querySelector('#btn-continue').addEventListener('click', () => {
    showGameScreen();
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

// show screen methods
const showStartScreen = () => {
    start_screen.classList.add('active');
    document.querySelector('.main-game').classList.remove('active');
};

const showGameScreen = () => {
    start_screen.classList.remove('active');
    document.querySelector('.main-game').classList.add('active');
};

// Setters
const setPlayerName = (name) => localStorage.setItem('player_name', name);

// Getters
const getPLayerName = () => localStorage.getItem('player_name');


initialize();