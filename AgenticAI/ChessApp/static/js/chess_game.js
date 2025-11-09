import { renderLastMove } from "./move_rendering.js";

// Mobile Navigation Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

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
const first_place_medal = '\u{1F947}'
const thumbs_up = '\u{1F592}'
const thumbs_down = '\u{1F593}'
let agent_data = undefined
let human_team = 'white'
let prev_fen = undefined
let data_fen = undefined
let data_score = undefined
let data_uci = undefined
let selected_piece = undefined
let selected_promotion = undefined
let global_clock_interval_id = undefined
let move_call_in_progress = false
let match_ended = false


document.addEventListener('DOMContentLoaded', () => {
    initializeAgentDropdown();
    initializePromotionPieces();
    initializeChessBoard();
    initializeSocialButtons();
});

function initializeSocialButtons() {
    const dislikeButton = document.getElementById('dislike-button')
    dislikeButton.textContent = thumbs_down
    dislikeButton.addEventListener('click', () => {
        if (prev_fen) {
            fetch('/api/board/dislike-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fen: prev_fen, uci: data_uci })
            })
        }
    })

    const likeButton = document.getElementById('like-button')
    likeButton.textContent = thumbs_up
    likeButton.addEventListener('click', () => {
        if (prev_fen) {
            fetch('/api/board/like-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fen: prev_fen, uci: data_uci })
            })
        }
    })
}

function initializeAgentDropdown() {
    const agent_select = document.getElementById('agent-select')
    const black_player_name = document.getElementById('player-black-name')
    
    // Load agents from JSON file
    fetch('/api/agents')
        .then(response => response.json())
        .then(agents => {
            // Clear existing options
            agent_select.innerHTML = ''
            
            // Add each agent as an option
            agents.forEach((agent, index) => {
                const option = document.createElement('option');
                
                if (agent_data === undefined) {
                    agent_data = {
                        id: agent.id,
                        name: agent.name,
                        model: agent.model
                    };

                    black_player_name.textContent = agent_data.name;
                    option.selected = true;
                }
                
                option.value = agent.id;
                option.textContent = agent.name;
                option.dataset.model = agent.model;
                
                agent_select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading agents:', error);
            // Fallback: add a default agent option
            const option = document.createElement('option');
            option.value = 'default';
            option.textContent = 'Default Agent';
            agent_select.appendChild(option);
        });
    
    // Handle agent selection
    agent_select.addEventListener('change', function() {
        const selected_option = this.options[this.selectedIndex];
        if (selected_option.value) {
            agent_data = {
                id: selected_option.value,
                name: selected_option.textContent,
                model: selected_option.dataset.model
            };
            
            black_player_name.textContent = agent_data.name;
        }
    });
}

function initializePromotionPieces() {
    const promotion_pieces = document.getElementById('promotion-pieces')
    
    Array.from(promotion_pieces.children).forEach(square => {
        if (human_team === 'black') { square.dataset.piece.toUpperCase() }
        
        square.textContent = piece_meta_map.get(square.dataset.piece).unicode

        if (square.className.includes('selected')) { selected_promotion = square }

        square.addEventListener('click', (event) => {
            if (selected_promotion && selected_promotion !== event.target) {
                selected_promotion.classList.remove('selected')
            }
            
            if (!event.target.className.includes('selected')) {
                event.target.classList.add('selected')
                selected_promotion = event.target
            }
        })
    })
}

function initializeChessBoard() {
    const query_params = new URLSearchParams(window.location.search)
    data_fen = query_params.get('fen')
    const clock_time = query_params.get('clock')
    
    if (!validateFEN(data_fen)) {
        fetch('/api/board/init-reset')
            .then(response => response.json())
            .then(data => {
                data_fen = data.fen;
                setCurrentTime(data.clock)
                renderChessBoard(data.fen)
            });
    } else {
        setCurrentTime(clock_time)
        renderChessBoard(data_fen)
    }
}

function getCurrentFen() {
    return data_fen
}

function getLastMove() {
    return data_uci
}

function getLastScore() {
    return data_score
}

function setCurrentTime(clock_time) {
    document.getElementById('clock-control').textContent = clock_time
}

function getCurrentTime() {
    return document.getElementById('clock-control').textContent
}

function stopTime() {
    document.getElementById('clock-control').classList.add('stopped')
}

function updateTime() {
    const global_clock = document.getElementById('clock-control')

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

function validateFEN(fen) {
    return !!`${fen}`.match(/([kqbnrpKQBNRP1-9]{1,8}\/?){8} [wb]{1} [-KQkq]{1,4} [-KQkq]{1,4} \d+ \d+/g)
}

function getSquareClass(colIndex, rowIndex) {
    return ((colIndex + rowIndex + 1) % 2 === 0) ? 'black' : 'white'
}

function renderChessBoard(fen, callback) {
    const chessBoard = document.getElementById('chess-board')
    chessBoard.replaceChildren()

    fen.split(' ')[0].split('/').forEach((row, rowIndex) => {
        let emptySquares = 0
        let busySquares = 0
        row.split('').forEach((piece, colIndex) => {
            if (piece.match(/[a-z]/i)) {
                const squareClass = getSquareClass((busySquares + emptySquares), rowIndex)
                const square = document.createElement('div')
                const positionId = `${String.fromCharCode(97 + busySquares + emptySquares)}${8 - rowIndex}`
                const piece_meta = piece_meta_map.get(piece)
                square.className = `square ${squareClass} ${piece_meta.class}-${piece_meta.name}`
                square.textContent = piece_meta.unicode
                square.dataset.position = positionId
                square.dataset.team = piece_meta.class
                square.dataset.name = piece_meta.name
                square.id = positionId
                square.draggable = true
                square.addEventListener('click', handleSquareClick)
                square.addEventListener('dragstart', handleDragStart)
                square.addEventListener('dragend', handleDragEnd)
                square.addEventListener('dragover', handleDragOver)
                square.addEventListener('drop', handleDrop)
                square.addEventListener('dragenter', handleDragEnter)
                square.addEventListener('dragleave', handleDragLeave)
                chessBoard.appendChild(square)
                busySquares++
            } else {
                for (let i = 0; i < parseInt(piece); i++) {
                    const squareClass = getSquareClass((busySquares + emptySquares), rowIndex)
                    const square = document.createElement('div')
                    const positionId = `${String.fromCharCode(97 + busySquares + emptySquares)}${8 - rowIndex}`
                    square.className = `square ${squareClass} free`
                    square.textContent = ''
                    square.dataset.position = positionId
                    square.id = positionId
                    square.addEventListener('click', handleSquareClick)
                    square.addEventListener('dragover', handleDragOver)
                    square.addEventListener('drop', handleDrop)
                    square.addEventListener('dragenter', handleDragEnter)
                    square.addEventListener('dragleave', handleDragLeave)
                    chessBoard.appendChild(square)
                    emptySquares++
                }
            }
        });
    });

    if (callback) callback()
}

function registerMove(table_id, fen, uci, time, score) {
    const new_entry = document.createElement("tr")
    new_entry.dataset.fen = fen
    new_entry.dataset.uci = uci
    new_entry.dataset.clock = time
    new_entry.dataset.score = score

    const td_move = document.createElement("td")
    td_move.classList.add("move")
    td_move.textContent = uci
    new_entry.appendChild(td_move)

    const td_time = document.createElement("td")
    td_time.classList.add("time")
    td_time.textContent = time
    new_entry.appendChild(td_time)

    const td_score = document.createElement("td")
    td_score.classList.add("score")
    td_score.textContent = score
    new_entry.appendChild(td_score)

    if (!table_id.includes(human_team)) {
        new_entry.classList.add('clickable')

        new_entry.addEventListener('click', (event) => {
            const event_target = event.target.parentNode
            const query_params = new URLSearchParams(window.location.search)
            query_params.set("fen", event_target.dataset.fen)
            query_params.set("clock", event_target.dataset.clock)

            window.location.replace(`${window.location.origin}/?${query_params.toString()}`)
        })
    } 

    document.getElementById(table_id).prepend(new_entry)
}

function setWinner(name_id) {
    document.getElementById(name_id).textContent += ` ${first_place_medal}`
}

function executeMove(fromElement, toElement) {
    const fromSquare = fromElement.dataset.position
    const toSquare = toElement.dataset.position

    if (fromSquare && toSquare) {
        validateMove(fromElement.dataset.name, fromSquare, toSquare, () => {
            makeMove(fromElement.dataset.name, fromSquare, toSquare, () =>  {
                registerMove("player-white-moves", getCurrentFen(), getLastMove(), getCurrentTime(), getLastScore())
                if (selected_piece) {
                    selected_piece.classList.remove("selected")
                    selected_piece = undefined
                }
                // Move by AI agent
                makeMove(fromElement.dataset.name, '', '', () => {
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

function handleSquareClick(event) {    
    if (move_call_in_progress || match_ended) return
    // Remove piece selection if selected piece is clicked
    if (event.target.className.includes("selected")) { 
        selected_piece.classList.remove("selected")
        selected_piece = undefined
        return 
    }
    // Assign the human team choice when selecting the first piece
    if (human_team === undefined && event.target.dataset.team) { 
        human_team = event.target.dataset.team 
    }

    if (selected_piece === undefined && human_team && human_team === event.target.dataset.team) {
        selected_piece = event.target 
        selected_piece.classList.add("selected")
        
        if (global_clock_interval_id === undefined) {
            global_clock_interval_id = setInterval(updateTime, 1000)
            
            // Disable agent selection once the game starts
            const agent_select = document.getElementById('agent-select')
            if (agent_select) {
                agent_select.disabled = true
            }
        }

        return
    }
    // Do not allow to move one piece over another of the same team
    if (selected_piece && event.target.dataset.team === human_team) {
        return
    }
    
    // Execute the move using the shared function
    if (selected_piece) {
        executeMove(selected_piece, event.target)
    }
}

function handleDragStart(event) {
    if (move_call_in_progress || match_ended) {
        event.preventDefault()
        return
    }
    
    // Initial assignement
    if (human_team === undefined && event.target.dataset.team) { 
        human_team = event.target.dataset.team 
    }
    
    // Only allow dragging pieces that belong to the human player
    if (selected_piece === undefined && human_team && human_team === event.target.dataset.team) {
        selected_piece = event.target 
        selected_piece.classList.add("selected")

        event.target.classList.add('dragging')
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', event.target.dataset.position)
        
        // Start clock if this is the first move
        if (global_clock_interval_id === undefined) {
            global_clock_interval_id = setInterval(updateTime, 1000)
            
            // Disable agent selection once the game starts
            const agent_select = document.getElementById('agent-select')
            if (agent_select) {
                agent_select.disabled = true
            }
        }
    } else {
        event.preventDefault()
    }
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging')
    // Remove hover effect from all squares
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach(square => {
        square.classList.remove('drag-over')
                
        // Clear any selected piece when dragging starts
        if (selected_piece) {
            selected_piece.classList.remove("selected")
            selected_piece = undefined
        }
    })
}

function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
}

function handleDragEnter(event) {
    event.preventDefault()
    event.target.classList.add('drag-over')
}

function handleDragLeave(event) {
    event.target.classList.remove('drag-over')
}

function handleDrop(event) {
    event.preventDefault()
    event.target.classList.remove('drag-over')
    
    const fromPosition = event.dataTransfer.getData('text/plain')
    const toPosition = event.target.dataset.position
    
    if (!fromPosition || !toPosition) return
    
    const fromSquare = document.getElementById(fromPosition)
    if (!fromSquare) return
    
    // Don't allow dropping on your own pieces
    if (event.target.dataset.team === human_team) {
        return
    }
    
    // Reuse the executeMove function from handleSquareClick
    // Mark that we successfully completed a drag and drop operation after validation succeeds
    executeMove(fromSquare, event.target)
}

function validateMove(piece_name, from, to, ok, ko) {
    if (piece_name === 'pawn' && from.includes('7', 1)) to = to + selected_promotion.dataset.piece
    move_call_in_progress = true;
    const api_url = '/api/board/validate-move'
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, uci: `${from}${to}`, piece: piece_name })
    }).then(response => {
        if (!response.ok) throw `${response.url} ${response.status} ${response.statusText}`
        
        return response.json()
    }).then(data => {
        if (data.fen && data.status === 'OK') {
            if (ok) ok()
        } else if (data.fen && data.status === 'KO') {
            if (ko) ko()
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

function makeMove(piece_name, from, to, ok, checkmate) {
    if (piece_name === 'pawn' && from.includes('7', 1)) to = to + selected_promotion.dataset.piece
    move_call_in_progress = true;
    const api_url = '/api/board/' + (from && to ? 'make-move':'make-ai-move')
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, uci: `${from}${to}`, agent: agent_data, piece: piece_name })
    }).then(response => {
        if (!response.ok) throw `${response.url} ${response.status} ${response.statusText}`
        
        return response.json()
    }).then(data => {
        if (data.fen && data.status === 'OK') {
            prev_fen = data_fen
            data_fen = data.fen
            data_uci = data.uci
            data_score = data.score
            
            const toElement = document.getElementById(data.uci.substring(2,4))
            const audio_movement = new Audio('/static/audio/movement.mp3')
            const audio_break = new Audio('/static/audio/small-rock-break.mp3')
            
            if (toElement.dataset.team) {
                audio_break.play()
            } else {
                audio_movement.play()
            } 

            renderChessBoard(data.fen)
            renderLastMove(data.uci)

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