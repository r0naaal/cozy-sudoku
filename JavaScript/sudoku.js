document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);

    // change mobile status bar color
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
})

// initial values

let cells = document.querySelectorAll('.main-grid-cell');

const name_input = document.querySelector('#input-name');
const start_screen = document.querySelector('#start-screen'); 

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

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

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const showStartScreen = () => {
    start_screen.classList.add('active');
    document.querySelector('.main-game').classList.remove('active');
};

const showGameScreen = () => {
    start_screen.classList.remove('active');
    document.querySelector('.main-game').classList.add('active');
};

// Add spacing between the 3x3 boxes in the Sudoku grid
const initializeGameGrid = () => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            let index = row * CONSTANT.GRID_SIZE + col;
            // Add bottom margin after rows 2 and 5 (to separate boxes vertically)
            if (row === 2 || row === 5) {
                cells[index].style.marginBottom = '10px';
            }
            // Add right margin after columns 2 and 5 (to separate boxes horizontally)
            if (col === 2 || col === 5) {
                cells[index].style.marginRight = '10px';
            }
        }
    }
}


const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode') || 'false');
    document.body.classList.add(darkmode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkmode ? '#1a1a2e' : '#fff');
    
    const game = getGameInfo();

    if (game) {
        showGameScreen();
    } else {
        showStartScreen();
    }

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initializeGameGrid();
}

init();