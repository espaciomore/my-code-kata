document.addEventListener('DOMContentLoaded', () => {
    initializeBoard()
});

let data_fen = undefined

function initializeBoard() {
    if (data_fen === undefined) {
        fetch('/api/board/init-reset')
            .then(response => response.json())
            .then(data => {
                data_fen = data.fen;
                renderChessBoard(data.fen)
            });
    } else {
        renderChessBoard(data_fen)
    }
}

function getSquareClass(colIndex, rowIndex) {
    return ((colIndex + rowIndex + 2) % 2 === 0) ? 'white' : 'black'
}

function renderChessBoard(fen) {
    const chessBoard = document.getElementById('chess-board')
    chessBoard.replaceChildren()

    fen.split(' ')[0].split('/').forEach((row, rowIndex) => {
        let emptySquares = 0
        let busySquares = 0
        row.split('').forEach((piece, colIndex) => {
            if (piece.match(/[a-z]/i)) {
                const squareClass = getSquareClass((busySquares + emptySquares), rowIndex)
                const square = document.createElement('div')
                square.className = `square ${squareClass}`
                square.textContent = piece
                square.dataset.position = `${String.fromCharCode(97 + busySquares + emptySquares)}${8 - rowIndex}`
                square.id = `${Date.now()}${busySquares}${emptySquares}${rowIndex}`
                square.addEventListener('click', handleSquareClick)
                chessBoard.appendChild(square)
                busySquares++
            } else {
                for (let i = 0; i < parseInt(piece); i++) {
                    const squareClass = getSquareClass((busySquares + emptySquares), rowIndex)
                    const square = document.createElement('div')
                    square.className = `square ${squareClass}`
                    square.textContent = ''
                    square.dataset.position = `${String.fromCharCode(97 + busySquares + emptySquares)}${8 - rowIndex}`
                    square.id = `${Date.now()}${busySquares}${emptySquares}${rowIndex}`
                    square.addEventListener('click', handleSquareClick)
                    chessBoard.appendChild(square)
                    emptySquares++
                }
            }
        });
    });
}

let lastClicked = undefined

function handleSquareClick(event) {
    if (event.alreadyClicked) {
        return
    }
    if (lastClicked === undefined) {
        lastClicked = event.target
        return
    }
    const fromSquare = lastClicked.dataset.position
    const toSquare = event.target.dataset.position

    lastClicked = undefined;

    if (fromSquare && toSquare) {
        setTimeout(function() { makeMove(fromSquare, toSquare) }, 100)
        // Next pass empty string and an AI agent will make a move
        setTimeout(function() { makeMove('', '') }, 1000)
    }
}

function makeMove(from, to) {
    api_url = '/api/board/' + (from && to ? 'make-move':'make-ai-move')
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, uci: `${from}${to}` })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.fen) {
            data_fen = data.fen;
            renderChessBoard(data.fen)
        } else {
            console.error('Error making move')
        }
    });
}