from flask import Flask, request, jsonify, render_template
from agents import function_tool
from agent_computer import AgentComputer, ChessBoard

import chess


@function_tool
def validate_move(fen: str, uci: str) -> str:
    """ Given the current chess board.
        Validate a move using the python-chess library.
        Input 'fen' is the current FEN as instructed.
        Input 'uci' is the suggested move to validate."""
    board = chess.Board(fen)
    move = chess.Move.from_uci(uci)
    
    if move not in board.legal_moves:
        return uci + "is an invalid move"
    
    return uci + "is a valid move"

agent_computer = AgentComputer(
    name = "Agent Computer Chessmaster",
    instructions = """You are an avid chess master.
        You master all the rules in the game of chess.
        You are having a match with a clever opponent or adversary.
        You understand the Universal Chess Interface (UCI) code to define moves on the board.
        You understand the Forsyth-Edwards Notation (FEN) to analyse chess board piece positions.
        Your pieces are Blacks or lowercase letters (k, q, r, b, n, p).
        You cannot move Whites or uppercase letters (K, Q, R, B, N, P).
        You are given the history of moves with FEN and UCI.
        You provide an UCI of length 4 meaning from-to movement.
        Your goal is to win so find the next best move based on the current chess board.
        You use the validate_move tool for your finding your next move to provide an answer ASAP.
        You must stop at first valid response from the validate_move tool.
        You win if your adversary is checkmated.
        Think fast and good luck!""",
    model = "gpt-4o-mini",
    tools = [validate_move]
)

app = Flask(__name__)

# Initialize a new chess board
@app.route('/api/board/init-reset', methods=['GET'])
def init_board():
    board = chess.Board()
    return jsonify({'fen': board.fen()})

# Validate move
@app.route('/api/board/validate-move', methods=['POST'])
def validate_move():
    data = request.get_json()
    board = chess.Board(data['fen'])
    move = chess.Move.from_uci(data['uci'])

    if move in board.legal_moves:
        return jsonify({'fen': board.fen(), 'uci': data['uci'], 'status': 'OK'})

    return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'KO'})

# Make move
@app.route('/api/board/make-move', methods=['POST'])
def make_move():
    data = request.get_json()
    board = chess.Board(data['fen'])
    move = chess.Move.from_uci(data['uci'])

    if move in board.legal_moves:
        board.push(move)
        return jsonify({'fen': board.fen(), 'uci': data['uci'], 'status': 'OK'})

    return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'KO'})

# Make move by an AI agent
@app.route('/api/board/make-ai-move', methods=['POST'])
async def make_ai_move():
    data = request.get_json()
    board = chess.Board(data['fen'])
    chessboard: ChessBoard | None = await agent_computer.make_move(current_fen=data['fen'])
    
    if chessboard is None or len(chessboard.uci) != 4:
        return jsonify({'fen': data['fen'], 'uci': '', 'status': 'KO'})

    move = chess.Move.from_uci(chessboard.uci)
    board.push(move)
    
    return jsonify({'fen': board.fen(), 'uci': chessboard.uci, 'status': 'OK'})

# Check for checkmate
@app.route('/api/board/is_checkmate', methods=['POST'])
def is_checkmate():
    data = request.get_json()
    board = chess.Board(data['fen'])
    if board.is_checkmate():
        return jsonify({'fen': board.fen(), 'status': 'OK'})
    return jsonify({'fen': board.fen(), 'status': 'KO'})

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)