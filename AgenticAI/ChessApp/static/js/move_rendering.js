export function renderLastMove(uci) {
    const startSquare = document.getElementById(uci.substring(0,2))
    const endSquare = document.getElementById(uci.substring(2,4))
    
    eval(`${endSquare.dataset.name}Move(startSquare, endSquare)`)
}

export function kingMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    document.getElementById(endSquare.id).classList.add("last-move")
}

export function queenMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    // TODO : middle steps
    document.getElementById(endSquare.id).classList.add("last-move")
}

export function bishopMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    // TODO : middle steps
    document.getElementById(endSquare.id).classList.add("last-move")
}

export function knightMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    // TODO : middle steps
    document.getElementById(endSquare.id).classList.add("last-move")
}

export function rookMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    // TODO : middle steps
    document.getElementById(endSquare.id).classList.add("last-move")
}

export function pawnMove(startSquare, endSquare) {
    document.getElementById(startSquare.id).classList.add("step-move")
    // TODO : middle steps
    document.getElementById(endSquare.id).classList.add("last-move")
}