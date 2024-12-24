const gameboard = (function () {
    let board = ['','','','','','','','',''];
    let currentPlayer = null;

    const gameWinningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinner = function(symbol) {
        for(let i = 0; i < gameWinningConditions.length; i++) {
            const [a, b, c] = gameWinningConditions[i];
            if(board[a] === symbol && board[b] === symbol && board[c] === symbol) {
                return true;
            }
        }
    };

    const checkTie = function() {
        return board.every((cell) => cell !== '');
    };

    const resetBoard = function() {
        board = ['','','','','','','','',''];
    };

    const play = function(index, player) {
        if(board[index] === '') {
            board[index] = player;
        }
    };

    const getActivePlayer = function() {
        return currentPlayer;
    }

    const setActivePlayer = function(player) {
        currentPlayer = player;
    }

    return {checkWinner, checkTie, resetBoard, play, getActivePlayer, setActivePlayer};
});

const player = (symbol) => {
    let score = 0;
    let name = symbol === 'X' ? 'Player 1' : 'Player 2';

    const getSymbol = () => symbol;
    
    const play = function(index, board) {
        board.play(index, symbol);
    };

    const win = function(board) {
        if(board.checkWinner(symbol)) {
            score++;
            return true;
        }
    };

    const getScore = function() {
        return score;
    };

    const resetScore = function() {
        score = 0;
    };

    const setName = function(playerName) {
        name = playerName;
    }

    const getName = function() {
        return name;
    }
    
    return {getSymbol, play, win, getScore, resetScore, setName, getName};
}

let player1 = null;
let player2 = null;
let currentBoard = null;
let cellClickHandlers = [];

const handleCellClick = (cell, index, board, playerTurn, result) => {
    return () => {
        playerTurn.style.color = "black";
        if(cell.textContent !== '') return;
        let currentPlayer = board.getActivePlayer();
        cell.textContent = currentPlayer.getSymbol();
        currentPlayer.play(index, board);
        if(currentPlayer.win(board)) {
            console.log(currentPlayer.getName());
            playerTurn.textContent = currentPlayer === player1 ? `${player1.getName()} wins!` : `${player2.getName()} wins!`;
            playerTurn.style.color = "red";
            result.textContent = `${player1.getName()}: ${player1.getScore()} - ${player2.getName()}: ${player2.getScore()}`;
            board.resetBoard();
            resetCells();
        } else if(board.checkTie()) {
            playerTurn.textContent = "It's a tie!"
            playerTurn.style.color = "red";
            board.resetBoard();
            resetCells();
        } else {
            board.setActivePlayer(currentPlayer === player1 ? player2 : player1);
            playerTurn.textContent = board.getActivePlayer() === player1 ? `${player1.getName()}\'s turn` : `${player2.getName()}\'s turn`;
        }
    };
};

const cleanupGame = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        if (cellClickHandlers[index]) {
            cell.removeEventListener('click', cellClickHandlers[index]);
        }
    });
    playerTurn.textContent = `${player1.getName()}\'s turn`;
    playerTurn.style.color = "black";
    cellClickHandlers = [];
    currentBoard = null;
};

const addEventListeners = function() {
    const playerButton1 = document.getElementById("buttonPlayer1");
    const botButton1 = document.getElementById("buttonBot1");
    const playerButton2 = document.getElementById("buttonPlayer2");
    const botButton2 = document.getElementById("buttonBot2");
    const startGameButton = document.getElementById("startGame");
    const choosePlayerScreen = document.getElementById("choosePlayerScreen");
    const returnButton = document.getElementById("return");

    playerButton1.addEventListener('click', () => {
        playerButton1.style.backgroundColor = "#000000";
        playerButton1.style.color = "#f5f5f5";
        player1 = player('X');
        resetBotButton(botButton1);
        if (player2) {
            startGameButton.classList.remove("hidden");
            startGameButton.classList.add("fadeIn");
        }
    });

    botButton1.addEventListener('click', () => {
        playerButton1.style.backgroundColor = "";
        playerButton1.style.color = "";
        player1 = player('X');
        if (player2) {
            startGameButton.classList.remove("hidden");
            startGameButton.classList.add("fadeIn");
        }
    });

    playerButton2.addEventListener('click', () => {
        playerButton2.style.backgroundColor = "#000000";
        playerButton2.style.color = "#f5f5f5";
        player2 = player('O');
        resetBotButton(botButton2);
        if (player1) {
            startGameButton.classList.remove("hidden");
            startGameButton.classList.add("fadeIn");
        }
    });

    botButton2.addEventListener('click', () => {
        playerButton2.style.backgroundColor = ""; 
        playerButton2.style.color = ""; 
        player2 = player('O');
        if (player1) {
            startGameButton.classList.remove("hidden");
            startGameButton.classList.add("fadeIn");
        }
    });

    startGameButton.addEventListener('click', () => {
        const player1Name = document.getElementById("player1Name");
        const player2Name = document.getElementById("player2Name");
        if(player1Name.value != '') player1.setName(player1Name.value);
        if(player2Name.value != '') player2.setName(player2Name.value);
        player1Name.textContent = '';
        player2Name.textContent = '';

        choosePlayerScreen.classList.remove("fadeOut");
        choosePlayerScreen.classList.remove("fadeIn");
        
        void choosePlayerScreen.offsetWidth;
        
        choosePlayerScreen.classList.add("fadeOut");
        choosePlayerScreen.addEventListener('animationend', () => {
            choosePlayerScreen.classList.add("hidden");
            startGame();
        }, { once: true });
    });

    returnButton.addEventListener('click', () => {
        const gameScreen = document.getElementById("gameScreen");
        gameScreen.classList.add("hidden");
        gameScreen.classList.remove("fadeIn");
        choosePlayerScreen.classList.remove("hidden");
        choosePlayerScreen.classList.remove("fadeOut"); 
        cleanupGame(); 
        startGameButton.classList.add("hidden"); 
        startGameButton.classList.remove("fadeIn");
        player1 = null; 
        player2 = null;
        playerButton1.style.backgroundColor = "";
        playerButton1.style.color = "";
        playerButton2.style.backgroundColor = "";
        playerButton2.style.color = "";
        resetCells();
    });
};

const resetBotButton = function(botButton) {
    botButton.style.backgroundColor = ""; 
    botButton.style.color = ""; 
};

const resetCells = function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.textContent = '';
    });
};


const startGame = function() {
    if (!player1 || !player2) return;
    
    const gameScreen = document.getElementById("gameScreen");
    const playerTurn = document.getElementById("playerTurn");
    const result = document.getElementById("result");
    
    if (currentBoard) {
        cleanupGame();
    }
    
    currentBoard = gameboard();
    currentBoard.setActivePlayer(player1); 
    
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("fadeIn");

    player1.resetScore();
    player2.resetScore();
    
    playerTurn.textContent = `${player1.getName()}'s turn`;
    result.textContent = `${player1.getName()} 0 - ${player2.getName()} 0`;

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const handler = handleCellClick(cell, index, currentBoard, playerTurn, result);
        cellClickHandlers[index] = handler;
        cell.addEventListener('click', handler);
    });
}

addEventListeners();