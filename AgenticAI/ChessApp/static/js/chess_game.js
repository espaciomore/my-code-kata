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

const REMOTE_AGENT = "REMOTE_AGENT"
const REMOTE_USER = "REMOTE_USER"
const LOCAL_AGENT = "LOCAL_AGENT"
const LOCAL_USER = "LOCAL_USER"
const WHITE = "white"
const BLACK = "black"
const piece_meta_map = new Map([
    ['K', {unicode: '\u{2654}', class: WHITE, name: 'king'}],
    ['k', {unicode: '\u{265A}', class: BLACK, name: 'king'}],
    ['Q', {unicode: '\u{2655}', class: WHITE, name: 'queen'}],
    ['q', {unicode: '\u{265B}', class: BLACK, name: 'queen'}],
    ['R', {unicode: '\u{2656}', class: WHITE, name: 'rook'}],
    ['r', {unicode: '\u{265C}', class: BLACK, name: 'rook'}],
    ['B', {unicode: '\u{2657}', class: WHITE, name: 'bishop'}],
    ['b', {unicode: '\u{265D}', class: BLACK, name: 'bishop'}],
    ['N', {unicode: '\u{2658}', class: WHITE, name: 'knight'}],
    ['n', {unicode: '\u{265E}', class: BLACK, name: 'knight'}],
    ['P', {unicode: '\u{2659}', class: WHITE, name: 'pawn'}],
    ['p', {unicode: '\u{265F}', class: BLACK, name: 'pawn'}]
]);
const first_place_medal = '\u{1F947}'
const thumbs_up = '\u{1F592}'
const thumbs_down = '\u{1F593}'
let white_team = undefined
let black_team = undefined
let current_player = undefined
let agent_data = undefined
let prev_fen = undefined
let data_fen = undefined
let data_score = undefined
let data_uci = undefined
let selected_piece = undefined
let global_clock_interval_id = undefined
let move_call_in_progress = false
let match_ended = false


document.addEventListener('DOMContentLoaded', () => {
    initializeAgentDropdown()
    initializePromotionPieces()
    initializeChessBoard()
    initializeSocialButtons()
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
                    agent_data = agent
                }

                if (index === 0) {
                    option.selected = true;
                }
                
                option.value = agent.id;
                option.textContent = agent.name;

                option.dataset.id = agent.id
                option.dataset.name = agent.name
                option.dataset.type = agent.type
                
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
        agent_data = selected_option.dataset
    });
}

function initializePromotionPieces() {
    const promotion_pieces = document.getElementById('promotion-pieces')
    
    Array.from(promotion_pieces.children).forEach(square => {
        square.addEventListener('click', (event) => {
            if (current_player.team === WHITE) {
                white_team.promotion = event.target.dataset.piece
                current_player.promotion = white_team.promotion
            } else {
                black_team.promotion = event.target.dataset.piece
                current_player.promotion = black_team.promotion
            }
            updatePromotionPieces()
        })
    })
}

function updatePromotionPieces() {
    const promotion_pieces = document.getElementById('promotion-pieces')
    
    Array.from(promotion_pieces.children).forEach(square => {
        const is_white_team = current_player.team === WHITE;

        square.dataset.piece = is_white_team ? square.dataset.piece.toUpperCase() : square.dataset.piece.toLowerCase()
        
        square.textContent = piece_meta_map.get(square.dataset.piece).unicode

        current_player.promotion = is_white_team ? white_team.promotion : black_team.promotion

        square.classList.remove('selected')

        if (current_player.promotion === square.dataset.piece) {
            square.classList.add('selected')
        }
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

function isRemoteAgentTurn() {
    return current_player.type === REMOTE_AGENT
}

function validateFEN(fen) {
    return !!`${fen}`.match(/([kqbnrpKQBNRP1-9]{1,8}\/?){8} [wb]{1} [-KQkq]{1,4} [-KQkq]{1,4} \d+ \d+/g)
}

function getSquareClass(colIndex, rowIndex) {
    return ((colIndex + rowIndex + 1) % 2 === 0) ? BLACK : WHITE
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

    new_entry.classList.add('clickable')

    new_entry.addEventListener('click', (event) => {
        const event_target = event.target.parentNode
        const query_params = new URLSearchParams(window.location.search)
        query_params.set("fen", event_target.dataset.fen)
        query_params.set("clock", event_target.dataset.clock)

        window.open(`${window.location.origin}/?${query_params.toString()}`, '_blank')
    })

    document.getElementById(table_id).prepend(new_entry)
}

function setWinner(name_id) {
    document.getElementById(name_id).textContent += ` ${first_place_medal}`
}

function executeMove(from_square, to_square) {
    const is_pawn_promotion = from_square.dataset.name === 'pawn' && from_square.dataset.position.includes(current_player.team === WHITE ? '7':'2', 1)

    const uci_from = from_square.dataset.position
    const uci_to = to_square.dataset.position + (!isRemoteAgentTurn() && is_pawn_promotion ? current_player.promotion.dataset.piece.toLowerCase() : '')

    if (uci_from && uci_to) {
        validateMove(from_square.dataset.name, uci_from, uci_to, () => {
            makeMove(from_square.dataset.name, uci_from, uci_to, () =>  {
                registerMove(`player-${current_player.team}-moves`, getCurrentFen(), getLastMove(), getCurrentTime(), getLastScore())
                if (selected_piece) {
                    selected_piece.classList.remove("selected")
                    selected_piece = undefined
                }
                // Change turn
                current_player = current_player === white_team ? black_team : white_team;
                updatePromotionPieces();
                // Check if next turn is a remote agent
                if (isRemoteAgentTurn()) {
                    getRemoteAgentMove(() => {
                        const this_from_square = document.getElementById(data_uci.substring(0, 2))
                        const this_to_square = document.getElementById(data_uci.substring(2,5))
                        executeMove(this_from_square, this_to_square)
                    })
                }
            }, () => {
                stopTime()
                setWinner(`player-${current_player.team}-name`)
            })
        })
    }
}

function assignCurrentPlayer(team) {
    if (team === WHITE) {
        white_team = { type: LOCAL_USER, team: WHITE, player: 'User', promotion: 'Q' }
        black_team = { type: agent_data.type, team: BLACK, player: agent_data.name, promotion: 'q' }
    } else {
        white_team = { type: agent_data.type, team: WHITE, player: agent_data.name, promotion: 'Q' }
        black_team = { type: LOCAL_USER, team: BLACK, player: 'User', promotion: 'q' }
    }

    document.getElementById('player-white-name').textContent = white_team.player
    document.getElementById('player-black-name').textContent = black_team.player

    current_player = white_team
    
    updatePromotionPieces();
}

function handleSquareClick(event) {    
    if (move_call_in_progress || match_ended) return
    // Remove piece selection if selected piece is clicked
    if (event.target.className.includes("selected")) { 
        selected_piece.classList.remove("selected")
        selected_piece = undefined
        return 
    }
    // Assign the preferred team when selecting the first piece
    if (current_player === undefined) { 
        assignCurrentPlayer(event.target.dataset.team)
    }

    if (selected_piece === undefined && current_player.type === LOCAL_USER && current_player.team === event.target.dataset.team) {
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
    if (selected_piece && event.target.dataset.team === current_player.team) {
        selected_piece.classList.remove('selected')
        selected_piece = event.target
        selected_piece.classList.add('selected')
        return
    }
    
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
    if (current_player === undefined && event.target.dataset.team) { 
        assignCurrentPlayer(event.target.dataset.team)
    }
    
    // Only allow dragging pieces that belong to the human player
    if (selected_piece === undefined && current_player.type === LOCAL_USER && current_player.team === event.target.dataset.team) {
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
    if (event.target.dataset.team === current_player.team) {
        return
    }
    
    // Reuse the executeMove function from handleSquareClick
    // Mark that we successfully completed a drag and drop operation after validation succeeds
    executeMove(fromSquare, event.target)
}

function validateMove(piece_name, from, to, ok, ko) {
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
        console.log(`Safe catch on validateMove : ${error}`)
        // Match must end
        clearInterval(global_clock_interval_id)
        global_clock_interval_id = undefined
        match_ended = true
    }).finally(() => {
        move_call_in_progress = false;
    });
}

function getRemoteAgentMove(ok, ko) {
    move_call_in_progress = true;
    const api_url = '/api/board/remote-agent-move'
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: data_fen, agent: agent_data })
    }).then(response => {
        if (!response.ok) throw `${response.url} ${response.status} ${response.statusText}`
        
        return response.json()
    }).then(data => {
        if (data.uci && data.status === 'OK') {
            data_uci = data.uci
            if (ok) ok()
        } else if (data.fen && data.status === 'KO' && ko) {
            ko()
        } else {
            throw data
        }
    }).catch(error => {
        console.log(`Safe catch on getRemoteAgentMove : ${error}`)
        // Match must end
        clearInterval(global_clock_interval_id)
        global_clock_interval_id = undefined
        match_ended = true
    }).finally(() => {
        move_call_in_progress = false;
    });
}

function makeMove(piece_name, from, to, ok, checkmate) {
    move_call_in_progress = true;
    const api_url = '/api/board/make-move'
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