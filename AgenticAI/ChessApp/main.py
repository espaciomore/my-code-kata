from flask import Flask, request, jsonify, render_template
from agent_computer import AgentComputer, ChessBoard

import chess
import random
import json
import os

with open('resources/agent_list.json') as f:
    agent_list = json.load(f)

# Set OPENAI_API_KEY environment variable to avoid trace export warning
if not os.getenv('OPENAI_API_KEY') and agent_list:
    os.environ['OPENAI_API_KEY'] = agent_list[0].get('api_key', '')

if not agent_list:
    raise "No agent available was found during loading"

agent_model = agent_list[0].get('model')
agent_api_key = agent_list[0].get('api_key')
agent_api_url = agent_list[0].get('api_url')

agent_computer = AgentComputer(
    name = "Agent Computer Chessmaster",
    instructions = """You are an avid chess master.
        You master all the rules in the game of chess.
        You understand the Universal Chess Interface (UCI) code to define moves on the board.
        You understand the Forsyth-Edwards Notation (FEN) to analyse chess board piece positions.

        White pieces are uppercase letters (K, Q, R, B, N, P).
        Black pieces are lowercase letters (k, q, r, b, n, p).

        Your pieces are Blacks.
        You cannot move Whites.
        You know that 'k' is for king, 'q' for queen, 'r' for rook, 'b' for bishop, 'n' for knight and 'p' for pawn. 

        Chess Piece Values (Point System) :
        1 Pawn - 1 point 
        1 Knight - 3 points 
        1 Bishop - 3 points 
        1 Rook - 5 points 
        1 Queen - 9 points 
        1 King - 0 points (in fact, if king dies game is over) 

        Examples:
        - Board (FEN) before is "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" where number 8 equals the number of empty squares
        - Move (UCI) to be made is "d2d3" which means moving a white (w) pawn (P) from position 'd2' to 'd3'.
        - Board (FEN) after is "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1" where 4P3 equals 4 empty squares followed by 1 white pawn (P) and 3 empty squares.

        You have to try to loose the least of points.
        You have to make the most points by overtaking the most precious pieces from the adversary.

        You are given the history of moves with FEN and UCI.
        You provide an UCI of length 4 meaning from-to movement.
        Your goal is to win so find the next best move based on the current chess board.
        You must choose the winning UCI move from the list provided to you.

        Think fast and good luck!""",
    tools = [],
    model = agent_model,
    api_key = agent_api_key,
    base_url = agent_api_url
)

app = Flask(__name__)

# Configure Flask for async support
app.config['ASYNC_MODE'] = True

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

def configure_agent_computer(agent_id: str):
    """Configure the agent computer with the specified agent's API settings."""
    agent_data = next(agent for agent in agent_list if agent.get('id') == int(agent_id))
    
    agent_computer.model = agent_data.get('model')
    agent_computer.api_key = agent_data.get('api_key')
    agent_computer.base_url = agent_data.get('api_url')

def give_appreciation(data: dict, appreciation: str):
    board = chess.Board(data['fen'])
    color = chess.WHITE if 'w' in data['fen'] else chess.BLACK
    score = calculate_material_score(board, color)
    agent_computer.update_last_move(data['fen'], data['uci'], score, appreciation)


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

    actual_score = calculate_material_score(board, chess.WHITE)
    moves_with_scores = list(map(lambda obj: [obj, actual_score - calculate_material_score(board, chess.WHITE)], shuffled_legal_moves))
    
    configure_agent_computer(data['agent']['id'])

    chessboard: ChessBoard | None = await agent_computer.make_move(current_fen=data['fen'], legal_moves=str(moves_with_scores))

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

# Like move
@app.route('/api/board/like-move', methods=['POST'])
def like_move():
    data = request.get_json()
    give_appreciation(data, 'like')

    return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'OK'})

# Dislike move
@app.route('/api/board/dislike-move', methods=['POST'])
def dislike_move():
    data = request.get_json()
    give_appreciation(data, 'dislike')

    return jsonify({'fen': data['fen'], 'uci': data['uci'], 'status': 'OK'})

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/agents', methods=['GET'])
def get_agents():
    # Return only id, name, and model for each agent
    agents = [{"id": agent.get('id'), "name": agent.get('name'), "model": agent.get('model')} for agent in agent_list]
    return jsonify(agents)

if __name__ == '__main__':
    app.run(debug=True)