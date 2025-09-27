from multiprocessing import managers
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import FileWriterTool, FileReadTool, DirectoryReadTool
from typing import List
from pathlib import Path
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators
project_root = Path(__file__).parent.parent.parent
directory_read_dir = str(project_root / "output")

@CrewBase
class EngineeringTeam():
    """EngineeringTeam crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def backend(self) -> Agent:
        return Agent(
            config=self.agents_config['backend'], # type: ignore[index]
            verbose=True,
            tools=[FileWriterTool(), FileReadTool(), DirectoryReadTool(directory=directory_read_dir)],
        )

    @agent
    def frontend(self) -> Agent:
        return Agent(
            config=self.agents_config['frontend'], # type: ignore[index]
            verbose=True,
            tools=[FileWriterTool(), FileReadTool(), DirectoryReadTool(directory=directory_read_dir)]
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def backend_task(self) -> Task:
        return Task(
            config=self.tasks_config['backend_task'], # type: ignore[index]
        )

    @task
    def frontend_task(self) -> Task:
        return Task(
            config=self.tasks_config['frontend_task'], # type: ignore[index]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the EngineeringTeam crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        manager = Agent(
            config=self.agents_config['manager'], # type: ignore[index]
            verbose=True,
            allow_delegation=True
        )

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            verbose=True,
            process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
            manager_agent=manager
        )
