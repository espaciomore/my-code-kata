from pydantic import BaseModel, Field
from agents import Agent, Runner
from agent_planner import WebSearchItem


class WebSearchResult(BaseModel):
    text : str = Field(description="The result of the seach")

class AgentSearcher():
    agent : Agent

    def __init__(self) -> None:
        self.agent = Agent(
            name = "Search Agent",
            instructions = "You are a reasearch assistant. Given a query or topic, search the web for explaining the subject.\n" +
            "Summarize the content capturing the main points. Do not add additional comments or personal opinions.",
            model = "gpt-4o-mini",
            output_type = WebSearchResult
        )

    async def search(self, item: WebSearchItem) -> WebSearchResult | None:
        try:
            message = f"Search topic: {item.topic}\nReason: {item.reason}"
            result = await Runner.run(self.agent, message)
            return result.final_output_as(WebSearchResult)
        except Exception:
            return None
   