const piece_meta_map = new Map([
    ['K', {unicode: '\u{2654}', class: 'white', name: 'king'}],
    ['k', {unicode: '\u{265A}', class: 'black', name: 'king'}],
    ['Q', {unicode: '\u{2655}', class: 'white', name: 'queen'}],
    ['q', {unicode: '\u{265B}', class: 'black', name: 'queen'}],
    ['R', {unicode: '\u{2656}', class: 'white', name: 'rook'}],
    ['r', {unicode: '\u{265C}', class: 'black', name: 'rook'}],
    ['B', {unicode: '\u{2657}', class: 'white', name: 'bishop'}],
    ['b', {unicode: '\u{265D}', class: 'black', name: 'bishop'}],
    ['N', {unicode: '\u{2658}', class: 'white', name: 'knight'}],
    ['n', {unicode: '\u{265E}', class: 'black', name: 'knight'}],
    ['P', {unicode: '\u{2659}', class: 'white', name: 'pawn'}],
    ['p', {unicode: '\u{265F}', class: 'black', name: 'pawn'}]
]);
const first_place_metal = '\u{1F947}'
let human_team = 'white'
let data_fen = undefined
let data_score = undefined
let data_uci = undefined
let selected_piece = undefined
let global_clock_interval_id = undefined
let move_call_in_progress = false
let match_ended = false


document.addEventListener('DOMContentLoaded', () => {
    resetBoard();
});

function getCurrentFen() {
    return data_fen
}

function getLastMove() {
    return data_uci
}

function getLastScore() {
    return data_score
}

function getCurrentTime() {
    return document.getElementById('clock-control').textContent
}

function stopTime() {
    document.getElementById('clock-control').classList.add('stopped')
}

function updateTime() {
    global_clock = document.getElementById('clock-control')

    let date = new Date()
    let [hours, minutes, seconds] = global_clock.textContent.split(':')

    date.setHours(parseInt(hours.trim()))
    date.setMinutes(parseInt(minutes.trim()))
    date.setSeconds(parseInt(seconds.trim()) + 1)

    hours = date.getHours().toString().padStart(2, '0');
    minutes = date.getMinutes().toString().padStart(2, '0');
    seconds = date.getSeconds().toString().padStart(2, '0');

    global_clock.textContent = `${hours} : ${minutes} : ${seconds}`
}

function resetBoard() {
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
    return ((colIndex + rowIndex + 1) % 2 === 0) ? 'black' : 'white'
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
                piece_meta = piece_meta_map.get(piece)
                square.className = `square ${squareClass} ${piece_meta.class}-${piece_meta.name}`
                square.textContent = piece_meta.unicode
                square.dataset.position = `${String.fromCharCode(97 + busySquares + emptySquares)}${8 - rowIndex}`
                square.dataset.team = piece_meta.class
                square.id = `${Date.now()}${busySquares}${emptySquares}${rowIndex}`
                square.addEventListener('click', handleSquareClick)
                chessBoard.appendChild(square)
                busySquares++
            } else {
                for (let i = 0; i < parseInt(piece); i++) {
                    const squareClass = getSquareClass((busySquares + emptySquares), rowIndex)
                    const square = document.createElement('div')
                    square.className = `square ${squareClass} free`
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

function registerMove(table_id, fen, uci, time, score) {
    let new_entry = document.createElement("tr")
    new_entry.dataset.fen = fen

    let td_move = document.createElement("td")
    td_move.classList.add("move")
    td_move.textContent = uci
    new_entry.appendChild(td_move)

    let td_time = document.createElement("td")
    td_time.classList.add("time")
    td_time.textContent = time
    new_entry.appendChild(td_time)

    let td_score = document.createElement("td")
    td_score.classList.add("score")
    td_score.textContent = score
    new_entry.appendChild(td_score)

    document.getElementById(table_id).prepend(new_entry)
}

function setWinner(name_id) {
    document.getElementById(name_id).textContent += ` ${first_place_metal}`
}

function handleSquareClick(event) {
    if (move_call_in_progress || match_ended) return
    if (event.target.className.includes("selected")) { 
        selected_piece.classList.remove("selected")
        selected_piece = undefined
        return 
    }
    if (human_team === undefined && event.target.dataset.team) { human_team = event.target.dataset.team }
    if (selected_piece === undefined && human_team) {
        if (event.target.className.includes(human_team)) { 
            selected_piece = event.target 
            selected_piece.classList.add("selected")
            
            if (global_clock_interval_id === undefined && data_fen.endsWith('0 1')) {

                global_clock_interval_id = setInterval(updateTime, 1000)
            }
        }

        return
    }
    if (selected_piece && event.target.dataset.team === human_team) {
        return
    }
    
    const fromSquare = selected_piece.dataset.position
    const toSquare = event.target.dataset.position

    if (fromSquare && toSquare) {
        validateMove(fromSquare, toSquare, () => {
            makeMove(fromSquare, toSquare, () =>  {
                registerMove("player-white-moves", getCurrentFen(), getLastMove(), getCurrentTime(), getLastScore())
                selected_piece.classList.remove("selected")
                selected_piece = undefined
                // Move by AI agent
                makeMove('', '', () => {
                    registerMove("player-black-moves", getCurrentFen(), getLastMove(), getCurrentTime(), getLastScore())
                }, () => {
                    stopTime()
                    setWinner("player-white-name")
                })
            }, () => {
                stopTime()
                setWinner("player-black-name")
            })
        }, () => {})
    }
}

function validateMove(from, to, ok, ko) {
    move_call_in_progress = true;
    api_url = '/api/board/validate-move'
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, uci: `${from}${to}` })
    }).then(response => {
        if (!response.ok) throw `${response.url} ${response.status} ${response.statusText}`
        
        return response.json()
    }).then(data => {
        if (data.fen && data.status === 'OK') {
            if (ok) ok()
        } else if (data.fen && data.status === 'KO') {
            if (ok) ko()
        } else {
            throw data
        }
    }).catch(error => {
        console.log(`Safe catch : ${error}`)
        // Match must end
        clearInterval(global_clock_interval_id)
        global_clock_interval_id = undefined
        match_ended = true
    }).finally(() => {
        move_call_in_progress = false;
    });
}

function makeMove(from, to, ok, checkmate) {
    move_call_in_progress = true;
    api_url = '/api/board/' + (from && to ? 'make-move':'make-ai-move')
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, uci: `${from}${to}` })
    }).then(response => {
        if (!response.ok) throw `${response.url} ${response.status} ${response.statusText}`
        
        return response.json()
    }).then(data => {
        if (data.fen && data.status === 'OK') {
            data_fen = data.fen
            data_uci = data.uci
            data_score = data.score
            renderChessBoard(data.fen)
            if (ok) ok()
        } else if (data.fen && data.status === 'CHECKMATE') {
            // Match has succesfully ended
            clearInterval(global_clock_interval_id)
            global_clock_interval_id = undefined
            match_ended = true        
            if (checkmate) checkmate()    
        } else {
            throw data
        }
    }).catch(error => {
        console.log(`Safe catch : ${error}`)
        // Match must end
        clearInterval(global_clock_interval_id)
        global_clock_interval_id = undefined
        match_ended = true
    }).finally(() => {
        move_call_in_progress = false;
    });
}