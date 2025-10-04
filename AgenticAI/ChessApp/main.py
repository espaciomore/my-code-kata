from flask import Flask, request, jsonify, render_template
from agents import function_tool
from agent_computer import AgentComputer, ChessBoard

import chess
import random

agent_computer = AgentComputer(
    name = "Agent Computer Chessmaster",
    instructions = """You are an avid chess master.
        You master all the rules in the game of chess.
        You understand the Universal Chess Interface (UCI) code to define moves on the board.
        You understand the Forsyth-Edwards Notation (FEN) to analyse chess board piece positions.

        Example:
        Board (FEN) before is "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".
        Move (UCI) to be made is "d2d3" or moving a white (w) pawn 'P' from position 'd2' to 'd3'.
        Board (FEN) after is "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1".

        Your pieces are Blacks, lowercase letters (k, q, r, b, n, p).
        You cannot move Whites, uppercase letters (K, Q, R, B, N, P).
        You know that 'k' is for king, 'q' for queen, 'r' for rook, 'b' for bishop, 'n' for knight and 'p' for pawn. 

        Chess Piece Values (Point System) :
        1 Pawn - 1 point 
        1 Knight - 3 points 
        1 Bishop - 3 points 
        1 Rook - 5 points 
        1 Queen - 9 points 
        1 King - 0 points (in fact, if king dies game is over) 

        You have to try to loose the least of points.
        You have to make the most points by overtaking the most precious pieces from the adversary.

        You are given the history of moves with FEN and UCI.
        You provide an UCI of length 4 meaning from-to movement.
        Your goal is to win so find the next best move based on the current chess board.
        You must choose the winning UCI move from the list provided to you.

        Think fast and good luck!""",
    model = "gpt-4o-mini",
    tools = []
)

app = Flask(__name__)

def calculate_material_score(board, color):
    piece_values = {
        chess.PAWN: 1,
        chess.KNIGHT: 3,
        chess.BISHOP: 3,
        chess.ROOK: 5,
        chess.QUEEN: 9,
        chess.KING: 0  # King value ignored as it is infinite
    }

    score = 0

    for piece_type in piece_values:
        score += len(board.pieces(piece_type, color)) * piece_values[piece_type]

    return 39 - score

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
        return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'OK'})

    return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'KO'})

@app.route('/api/board/legal-moves', methods=['POST'])
def legal_moves():
    data = request.get_json()
    board = chess.Board(data['fen'])
    legal_moves = []

    for move in board.legal_moves:
        legal_moves.append(move.uci())

    return jsonify({'fen': data['fen'], 'uci': legal_moves, 'status': 'OK'})

# Make move
@app.route('/api/board/make-move', methods=['POST'])
def make_move():
    data = request.get_json()
    board = chess.Board(data['fen'])
    move = chess.Move.from_uci(data['uci'])
    list_legal_moves = list(map(lambda obj: obj.uci(), board.legal_moves))

    if len(list_legal_moves) == 0:
        return jsonify({'fen': data['fen'], 'uci': data['uci'], 'score': calculate_material_score(board, chess.BLACK), 'status': 'CHECKMATE'})

    board.push(move)
    score = calculate_material_score(board, chess.BLACK)
    agent_computer.update_history(data['fen'], move.uci(), score)
    
    return jsonify({'fen': board.fen(), 'uci': data['uci'], 'score': score, 'status': 'OK'})

# Make move by an AI agent
@app.route('/api/board/make-ai-move', methods=['POST'])
async def make_ai_move():
    data = request.get_json()
    board = chess.Board(data['fen'])
    list_legal_moves = list(map(lambda obj: obj.uci(), board.legal_moves))

    if len(list_legal_moves) == 0:
        return jsonify({'fen': data['fen'], 'uci': '', 'score': calculate_material_score(board, chess.WHITE), 'status': 'CHECKMATE'})

    shuffled_legal_moves = list_legal_moves.copy()
    random.shuffle(shuffled_legal_moves)
    
    chessboard: ChessBoard | None = await agent_computer.make_move(current_fen=data['fen'], legal_moves=str(shuffled_legal_moves))

    if chessboard is None or len(chessboard.uci) != 4 or chessboard.uci not in list_legal_moves:
        return jsonify({'fen': data['fen'], 'uci': '', 'score': calculate_material_score(board, chess.WHITE), 'status': 'KO'})

    move = chess.Move.from_uci(chessboard.uci)

    board.push(move)    

    score = calculate_material_score(board, chess.WHITE)
    agent_computer.update_history(data['fen'], move.uci(), score)
    
    return jsonify({'fen': board.fen(), 'uci': chessboard.uci, 'score': score, 'status': 'OK'})

# Check for checkmate
@app.route('/api/board/is_checkmate', methods=['POST'])
def is_checkmate():
    data = request.get_json()
    board = chess.Board(data['fen'])

    if board.is_checkmate():
        return jsonify({'fen': board.fen(), 'status': 'OK'})

    return jsonify({'fen': board.fen(), 'status': 'KO'})

# Check if check
@app.route('/api/board/king_in_check', methods=['POST'])
def king_in_check():
    data = request.get_json()
    board = chess.Board(data['fen'])

    if board.is_check():
        return jsonify({'fen': board.fen(), 'status': 'OK'})

    return jsonify({'fen': board.fen(), 'status': 'KO'})

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)