from pydantic import BaseModel, Field
from agents import Agent, Runner
from agent_searcher import WebSearchResult


class ReportData(BaseModel):
    summary : str = Field(description="The short summary of the findings")
    markdown_report : str = Field(description="The final report in markdown format")
    html_report : str = Field(description="The final report in HTML format")
    questions : str = Field(description="The suggested questions to follow up for further investigation")

class AgentWriter():
    agent : Agent

    def __init__(self) -> None:
        self.agent = Agent(
            name = "Report Writer Agent",
            instructions = "You are an experienced researcher writing a coherent report for a research query or topic.\n" +
            "An assistant researcher has given a query or topic along with a list of summarized search results.\n" + 
            "You need to plan the structure of the report in a very academic writing format.\n" +
            "Provide summary, a markdown_report and an html_report version, and finally, the follow up questions to investigate further.\n" +
            "Focus on clarity and readability.",
            model = "gpt-4o-mini",
            output_type=ReportData
        )
    
    async def write_report(self, query: str, search_results: list[WebSearchResult]) -> ReportData:
        """Writes the report for the query"""
        message = f"Original query: {query}\nSummarized search results: {[result.text for result in search_results]}"
        result = await Runner.run(self.agent, message)
        return result.final_output_as(ReportData)
   