from typing import Any
from pydantic import BaseModel, Field
from agents import Agent, Runner, ModelSettings


class ChessBoard(BaseModel):
    fen : str = Field(description="Chess positions based on the Forsyth-Edwards Notation (FEN) standard")
    uci : str = Field(description="Chess move based on the Universal Chess Interface (UCI) standard")

class ChessBoardList(BaseModel):
    moves : list[ChessBoard] = Field(description="The list of chess board moves")


class AgentComputer():
    agent : Agent
    name : str
    model : str
    tools : [Any]
    chess_board_history : ChessBoardList = ChessBoardList(moves=[])

    def __init__(self, name: str, instructions: str, model: str, tools: [Any]) -> None:
        self.name = name
        self.instructions = instructions
        self.model = model
        self.tools = tools

    async def make_move(self, current_fen: str) -> ChessBoard | None:
        self.agent = Agent(
            name = self.name, 
            instructions = f"{self.instructions}\n\n" +
                f"Chess board history: {self.chess_board_history.moves}\n\n" + 
                f"Current chess board to pass as fen argument to validate_move tool: '{current_fen}'",
            model = self.model,
            tools = self.tools,
            output_type = ChessBoard,
            model_settings=ModelSettings(timeout=30, max_turns=30))

        result = await Runner.run(self.agent, f"Find the next best move for Blacks", max_turns=30)
        
        try:
            next_move: ChessBoard = result.final_output_as(ChessBoard)
            self.chess_board_history.moves.append(next_move)
            
            return next_move
        except Exception:
            print('agent result processing error')
            return None
