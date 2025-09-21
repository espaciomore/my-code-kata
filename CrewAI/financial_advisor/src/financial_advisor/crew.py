from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool
from typing import List
from .models.securities import SecuritiesNewsList, SecuritiesAdviceList
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class FinancialAdvisor():
    """FinancialAdvisor crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def financial_advisor(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_advisor'], # type: ignore[index]
            tools=[SerperDevTool()],
            verbose=True
        )

    @agent
    def finance_director(self) -> Agent:
        return Agent(
            config=self.agents_config['finance_director'], # type: ignore[index]
            verbose=True
        )

    @agent
    def report_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['report_writer'], # type: ignore[index]
            verbose=True
        )    

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def advisor_task(self) -> Task:
        return Task(
            config=self.tasks_config['advisor_task'], # type: ignore[index]
            output_pydantic=SecuritiesNewsList,
        )

    @task
    def director_task(self) -> Task:
        return Task(
            config=self.tasks_config['director_task'], # type: ignore[index]
            output_pydantic=SecuritiesAdviceList,
        )

    @task
    def report_task(self) -> Task:
        return Task(
            config=self.tasks_config['report_task'], # type: ignore[index]
        )        

    @crew
    def crew(self) -> Crew:
        """Creates the FinancialAdvisor crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
