from typing import Any
from pydantic import BaseModel, Field
from agents import Agent, Runner, ModelSettings, set_default_openai_client, set_tracing_disabled
from openai import AsyncOpenAI


class ChessBoard(BaseModel):
    fen : str = Field(description="Chess positions based on the Forsyth-Edwards Notation (FEN) standard")
    uci : str = Field(description="Chess move based on the Universal Chess Interface (UCI) standard")
    score : int = Field(description="Score based on the current state of the chess board")
    appreciation : str = Field(description="Appreciation given by the human player to the move (like or dislike)")

    def __str__(self) -> str:
        return f"ChessBoard: fen={self.fen}, uci={self.uci}, score={self.score}, appreciation={self.appreciation}"

class ChessBoardList(BaseModel):
    moves : list[ChessBoard] = Field(description="The list of chess board moves")

    def __str__(self) -> str:
        return str(map(lambda move: str(move), self.moves))


class AgentComputer():
    agent : Agent
    name : str
    model : str
    tools : [Any]
    api_key : str
    base_url : str
    chess_board_history : ChessBoardList = ChessBoardList(moves=[])

    def __init__(self, name: str, instructions: str, model: str, tools: [Any], api_key: str = None, base_url: str = None) -> None:
        self.name = name
        self.instructions = instructions
        self.model = model
        self.tools = tools
        self.api_key = api_key
        self.base_url = base_url

    def update_history(self, fen: str, uci: str, score: int):
        self.chess_board_history.moves.append(ChessBoard(fen=fen, uci=uci, score=score, appreciation=''))

    def update_last_move(self, fen: str, uci: str, score: int, appreciation: str):
        self.chess_board_history.moves[-1] = ChessBoard(fen=fen, uci=uci, score=score, appreciation=appreciation)

    async def make_move(self, current_fen: str, legal_moves: str) -> ChessBoard | None:
        # Set up the OpenAI client with custom API key and base URL
        external_client = AsyncOpenAI(
            base_url=self.base_url,
            api_key=self.api_key
        )
        
        set_default_openai_client(external_client)
        set_tracing_disabled(True)

        self.agent = Agent(
            name = self.name, 
            instructions = f"{self.instructions}\n\n" +
                f"Chess board history: \n{',\n'.join(str(self.chess_board_history))}\n\n" + 
                f"Curremt chess board (FEN): \n'{current_fen}'\n\n" +
                f"List of legal moves (UCI) and their scores: \n{legal_moves}",
            model = self.model,
            tools = self.tools,
            output_type = ChessBoard,
            model_settings=ModelSettings(timeout=30))

        result = await Runner.run(self.agent, f"Choose the next best move for Blacks", max_turns=30)
        
        try:
            return result.final_output_as(ChessBoard)
        except Exception:
            print('agent result processing error')
            return None
