# Financial Advisor Crew

Welcome to the Financial Advisor Crew project, powered by [crewAI](https://crewai.com). This project implements a sophisticated multi-agent AI system for financial market analysis and investment recommendations. The crew consists of specialized AI agents that collaborate to research financial markets and provide strategic investment advice, maximizing their collective intelligence and analytical capabilities.

## Installation

Ensure you have Python >=3.10 <3.14 installed on your system. This project uses [UV](https://docs.astral.sh/uv/) for dependency management and package handling, offering a seamless setup and execution experience.

### Prerequisites

1. **Install UV** (if you haven't already):

```bash
pip install uv
```

2. **Clone and navigate to the project directory**:

```bash
cd CrewAI/financialadvisor
```

3. **Install dependencies**:

```bash
uv sync
```

### Environment Setup

Create a `.env` file in the project root directory with your API keys:

```bash
# .env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Customizing

You can customize the Financial Advisor Crew by modifying the following configuration files:

- **`src/financialadvisor/config/agents.yaml`** - Define your AI agents (Financial Advisor and Finance Director)
- **`src/financialadvisor/config/tasks.yaml`** - Configure the research and analysis tasks
- **`src/financialadvisor/crew.py`** - Add custom logic, tools, and specific arguments
- **`src/financialadvisor/main.py`** - Modify date ranges and input parameters for analysis

### Available Agents

1. **Financial Advisor** - Researches global financial markets and identifies profitable securities
2. **Finance Director** - Reviews recommendations and provides strategic buy/sell/hold decisions

## Running the Project

To kickstart your crew of AI agents and begin financial market analysis, run this from the root folder of your project:

```bash
crewai run
```

This command initializes the Financial Advisor Crew, assembling the agents and assigning them tasks as defined in your configuration.

### Output Files

The crew generates two comprehensive reports:

1. **`output/financial_info.md`** - Contains a list of 10 securities with detailed analysis and reasoning based on recent market performance
2. **`output/financial_advise.md`** - Provides strategic recommendations (Buy/Sell/Hold) with detailed rationale for each security

### Alternative Commands

You can also use the following commands for different workflows:

```bash
# Train the crew (requires iteration count and filename)
uv run train <iterations> <filename>

# Replay execution from a specific task
uv run replay <task_id>

# Test the crew execution
uv run test <iterations> <eval_llm>
```

## Project Structure

```
financialadvisor/
├── src/
│   └── financialadvisor/
│       ├── __init__.py
│       ├── main.py              # Entry point with run, train, replay, test functions
│       ├── crew.py              # Crew configuration and orchestration
│       └── config/
│           ├── agents.yaml      # Agent definitions (Financial Advisor, Finance Director)
│           └── tasks.yaml       # Task definitions (research and analysis tasks)
├── output/                      # Generated reports
│   ├── financial_info.md        # Securities research results
│   └── financial_advise.md      # Investment recommendations
├── pyproject.toml               # Project dependencies and configuration
├── uv.lock                      # Dependency lock file
└── README.md                    # This file
```

## Understanding Your Crew

The Financial Advisor Crew is composed of two specialized AI agents that work together to provide comprehensive financial market analysis:

1. **Financial Advisor Agent** - Conducts thorough research on global financial markets and identifies the most promising securities based on recent performance data
2. **Finance Director Agent** - Reviews the research findings and provides strategic investment recommendations with detailed buy/sell/hold decisions

These agents collaborate through a series of tasks defined in `config/tasks.yaml`, leveraging their collective expertise to deliver actionable financial insights.

## Support

For support, questions, or feedback regarding the Financial Advisor Crew or crewAI:

- 📚 **Documentation**: Visit our [official documentation](https://docs.crewai.com)
- 🐛 **Issues & Contributions**: Reach out through our [GitHub repository](https://github.com/joaomdmoura/crewai)
- 💬 **Community**: [Join our Discord](https://discord.com/invite/X4JWnZnxPb)
- 🤖 **AI Assistant**: [Chat with our docs](https://chatg.pt/DWjSBZn)

## Features

- **Automated Market Research**: AI agents automatically research global financial markets
- **Intelligent Analysis**: Advanced algorithms analyze market trends and security performance
- **Strategic Recommendations**: Get detailed buy/sell/hold recommendations with reasoning
- **Customizable Timeframes**: Analyze markets over any specified date range
- **Multi-Agent Collaboration**: Specialized agents work together for comprehensive analysis
- **Extensible Architecture**: Easy to customize agents, tasks, and workflows

---

*Let's create intelligent financial insights together with the power and simplicity of crewAI.*

**Note**: This description was generated by AI.
