# Project Requirements:

* Write a web app for playing chess game using python-chess library (only for Backen API)
* One page web application playable offline
* Gameplay runs on Flask as web server (serving homepage "http//localhost:5000/" with template "index.html")
* Application must have memory to keep the chess board state
* Human versus Computer gameplay
* Human can choose to play as White or Black
* UI display a timer for each turn
* UI keep track of scores
* UI track each play during the game
* UI on the Universal Chess Interface (UCI) protocol to share information with the backend API
* UI should communicate with the API using the FEN (Forsyth-Edwards Notation) standard to store the chessboard as JSON
* UI must initialize the chess board through an API call then use the FEN object to render the board
* Each chess piece must be displayed with a special symbol
* Human should be able to make a move by drag and drop
* Human should be able to make a move by clicking on the start square and then another click on the end square
* Computer should be able to make a move autonomously
* Show a playable chess board and pieces (whites and blacks) on the web Application
* Application directory "**/output/app/"

# About Chess Rules:

The chess board is an 8 by 8 square where horzonuares are named with numbers 1 to 8 and vertical squares are named with letters A to H.

Each player controls sixteen pieces :

- 1 King
- 1 Queen
- 2 Rook (s)
- 2 Bishop (s)
- 2 Knight (s)
- 8 Pawn (s)

## ASCII chars for chess pieces:

- Black Rook : `&#9820`
- Black Knight : `&#9822`
- Black Bishop : `&#9821`
- Black King : `&#9818`
- Black Queen : `&#9819`
- Black Pawn : `&#9823`
- White Rook : `&#9814`
- White Knight : `&#9816`
- White Bishop : `&#9815`
- White King : `&#9812`
- White Queen : `&#9813`
- White Pawn : `&#9817`

## The pieces are placed, one per square, as follows:

* Rooks are placed on the outside corners, right and left edge.
* Knights are placed immediately inside of the rooks.
* Bishops are placed immediately inside of the knights.The queen is placed on the central square of the same color of that of the piece: white queen on the white square and black queen on the black square.
* The king takes the vacant spot next to the queen.
* Pawns are placed one square in front of all of the other pieces.

Popular mnemonics used to remember the setup are "queen on her own color" and "white on right". The latter refers to setting up the board so that the square closest to each player's right is white.

The player controlling the white pieces is named "White"; the player controlling the black pieces is named "Black". White moves first, then players alternate moves. Making a move is required; it is not legal to skip a move.

## How The Chess Pieces Move

* King - Moves one square in any direction.Queen - Moves any number of squares diagonally, horizontally, or vertically.
* Rook - Moves any number of squares horizontally or vertically.
* Bishop - Moves any number of squares diagonally.
* Knight - Moves in an ‘L-shape,’ two squares in a straight direction, and then one square perpendicular to that.
* Pawn - Moves one square forward, but on its first move, it can move two squares forward. It captures diagonally one square forward.

# About python-chess library (only for backend API):

This library will be helpful in pyhton scripts for the backend API. 

- Create a new board : `board = chess.Board()`
- Get legal or valid movements : `board.legal_moves`
- Validate a move : `chess.Move.from_uci("a8a1") in board.legal_moves`
- Make a move : `board.push_san("e4")` or `board.push(chess.Move.from_uci("g1f3"))`
- Unmake the last move : `board.pop()`
- Check if oponent is check : `board.is_check()`
- Check if checkmate : `board.is_checkmate()`
- Check if stalemate : `board.is_stalemate())`
- Print a board : `print(board)`

## Understanding the FEN String

A FEN string consists of six fields separated by spaces:

1. **Piece placement** : Describes the board layout row by row. A number represents the number of empty squares with no pieces. This field can be split and parsed to draw a board with all the pieces.
2. **Active color** : `w` for white, `b` for black.
3. **Castling availability** : `KQkq` for kingside/queenside castling rights.
4. **En passant target square** : `-` if none.
5. **Halfmove clock** : Number of halfmoves since the last pawn move or capture.
6. **Fullmove number** : The move number in the game.

Examples:

- "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
- "r1bqkbnr/pppppppp/2n5/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

# Suggested API endpoints:

- GET /api/board/init-reset
  - Creates a new board and returns the FEN object
- POST /api/board/status
  - with payload { "fen" :  currentFEN }
- POST /api/board/make-move
  - with payload { "fen" :  currentFEN, "uci" : currentUCI }
- POST /api/board/validate-move
  - with payload { "fen" :  currentFEN, "uci" : currentUCI }
- POST /api/board/undo
  - with payload { "fen" :  currentFEN, "uci" : currentUCI }

# Suggested Project Structure:

output/
  app/
    main.py
    run.py
    requirements.txt
    README.md
    static/
        css/
            global_style.css
        js/
            chess_game.js
    templates/
      index.html

# Render board with FEN object:

```javascript
function getSquareClass(colIndex, rowIndex) {
    return (colIndex % 2 !== 0) !== (rowIndex %2 === 0) ? 'white' : 'black';
}

function renderChessBoard(fen) {
    const chessBoard = document.getElementById('chess-board');
    chessBoard.innerHTML = '';
    const pieces = fen.split(' ')[0].split('/');
    pieces.forEach((row, rowIndex) => {
        let emptySquares = 0;
        row.split('').forEach((piece, colIndex) => {
            if (isNaN(piece)) {
                const squareClass = getSquareClass(rowIndex, (colIndex + emptySquares));
                const square = document.createElement('div');
                square.className = `square ${squareClass}`;
                square.textContent = piece;
                chessBoard.appendChild(square);
            } else {
                for (let i = 0; i < parseInt(piece); i++) {
                    const squareClass = getSquareClass(rowIndex, (colIndex + emptySquares));
                    const square = document.createElement('div');
                    square.className = `square ${squareClass}`;
                    chessBoard.appendChild(square);
                    emptySquares++;
                }
            }
        });
    });
}
```


**NOTE**: This file is readonly. Do not edit.
