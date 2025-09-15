from agents import Runner, trace, gen_trace_id
from agent_planner import AgentPlanner, WebSearchPlan
from agent_searcher import AgentSearcher, WebSearchResult
from agent_writer import AgentWriter, ReportData
from agent_sender import AgentSender


class AgentManager():

    async def run(self, query: str):
        """ Orchestrates the research, yielding status updates and the final report for display"""
        trace_id = gen_trace_id()
        with trace("Research run", trace_id=trace_id):
            search_plan : WebSearchPlan = await AgentPlanner().plan_searches(query)
            yield "Search plan created"
            search_results : list[WebSearchResult] = []
            for web_search_item in search_plan.search_items:
                result = await AgentSearcher().search(web_search_item)
                if result is not None:
                    search_results.append(result)
            yield "Searches completed"
            report : ReportData = await AgentWriter().write_report(query, search_results) 
            yield "Report written"
            await AgentSender().send_email(report)
            yield "Email sent"
            yield report.markdown_report
