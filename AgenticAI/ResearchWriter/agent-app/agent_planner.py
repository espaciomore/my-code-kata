from pydantic import BaseModel, Field
from agents import Agent,Runner

import os


class WebSearchItem(BaseModel):
    topic : str = Field(description="The item or topic to use for the search")
    reason : str = Field(description="The reason the topic  is relevant")

class WebSearchPlan(BaseModel):
    search_items : list[WebSearchItem] = Field(description="The list of search items to look up")

class AgentPlanner():
    agent : Agent

    def __init__(self) -> None:
        self.agent = Agent(
            name = "Search Planner Agent",
            instructions = f"You are a reasearch assistant. Given a query, create a set of {os.getenv("SEARCH_DEPTH")} related topics to best explain the query.",
            model = "gpt-4o-mini",
            output_type = WebSearchPlan
        )

    async def plan_searches(self, query: str) -> WebSearchPlan:
        result = await Runner.run(self.agent, f"Query: {query}")
        return result.final_output_as(WebSearchPlan)
