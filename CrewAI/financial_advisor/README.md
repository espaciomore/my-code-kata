# Financial Advisor Crew

Welcome to the Financial Advisor Crew project, powered by [crewAI](https://crewai.com). This project showcases a cutting-edge **Agentic AI Architecture** that demonstrates how multiple specialized AI agents can collaborate autonomously to solve complex financial analysis tasks.

## 🤖 Agentic AI Architecture

This system represents a sophisticated implementation of **Multi-Agent AI**, where autonomous AI agents work together in a coordinated workflow to achieve complex financial analysis goals. Unlike traditional single-model approaches, this agentic system distributes expertise across specialized agents, each with distinct roles, tools, and decision-making capabilities.

### Core Agentic Principles

- **🔄 Autonomous Agent Collaboration**: Each agent operates independently while maintaining context awareness
- **🎯 Specialized Expertise**: Agents have distinct roles, backstories, and capabilities tailored to their function
- **📊 Structured Data Flow**: Pydantic models ensure type-safe data exchange between agents
- **🔗 Sequential Workflow**: Tasks are orchestrated with clear dependencies and context passing
- **🛠️ Tool Integration**: Agents can utilize external tools (like SerperDevTool) for real-time data access
- **📝 Structured Outputs**: Each agent produces validated, structured outputs that feed into subsequent agents

### Key Capabilities

- **Real-time Market Analysis**: Autonomous agents research current market conditions and identify promising securities
- **Data-Driven Recommendations**: Multi-agent collaboration provides Buy/Sell/Hold recommendations with detailed rationale
- **Customizable Timeframes**: Analyze markets over any specified date range
- **Extensible Agent Architecture**: Easy to add new agents, tools, and analysis capabilities
- **Comprehensive Reporting**: Agent-generated detailed investment reports with market insights

## Installation

Ensure you have Python >=3.10 <3.14 installed on your system. This project uses [UV](https://docs.astral.sh/uv/) for dependency management and package handling, offering a seamless setup and execution experience.

### Prerequisites

1. **Install UV** (if you haven't already):

```bash
pip install uv
```

2. **Clone and navigate to the project directory**:

```bash
cd CrewAI/financial_advisor
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

- **`src/financial_advisor/config/agents.yaml`** - Define your AI agents (Financial Advisor and Finance Director)
- **`src/financial_advisor/config/tasks.yaml`** - Configure the research and analysis tasks
- **`src/financial_advisor/crew.py`** - Add custom logic, tools, and specific arguments
- **`src/financial_advisor/main.py`** - Modify date ranges and input parameters for analysis

### Autonomous AI Agents

The system consists of three specialized AI agents, each with unique expertise and decision-making capabilities:

#### 🔍 **Financial Advisor Agent**
- **Role**: Senior Financial Advisor
- **Specialization**: Market research and securities identification
- **Tools**: SerperDevTool for real-time web search and market data retrieval
- **Model**: OpenAI GPT-4o Mini
- **Capabilities**: 
  - Conducts thorough research on global financial markets
  - Identifies the most promising securities based on current performance
  - Gathers relevant news and market information
  - Produces structured output with 10 top securities and reasoning

#### 📊 **Finance Director Agent**
- **Role**: Finance Director
- **Specialization**: Strategic decision-making and investment evaluation
- **Model**: Anthropic Claude 3.7 Sonnet
- **Capabilities**:
  - Reviews and validates securities recommendations
  - Makes strategic Buy/Sell/Hold decisions
  - Provides detailed reasoning for each investment decision
  - Evaluates risk and market conditions

#### 📝 **Report Writer Agent**
- **Role**: Report Writer
- **Specialization**: Professional report generation and formatting
- **Model**: OpenAI GPT-4o Mini
- **Capabilities**:
  - Synthesizes all agent outputs into comprehensive reports
  - Formats information in human-readable markdown
  - Ensures professional presentation of investment recommendations
  - Generates final structured output files

### 🔄 Agent Workflow & Task Orchestration

The agentic system operates through a sophisticated sequential workflow where agents collaborate and pass structured data:

#### Task Dependencies & Context Flow

1. **Advisor Task** → **Director Task** → **Report Task**
   - Each task builds upon the previous agent's structured output
   - Context is automatically passed between agents
   - Dependencies ensure proper data flow and validation

2. **Structured Data Exchange**
   - **SecuritiesNewsList**: Financial Advisor's research results
   - **SecuritiesAdviceList**: Finance Director's investment decisions
   - **Final Report**: Report Writer's synthesized output

3. **Tool Integration**
   - Financial Advisor uses SerperDevTool for real-time market research
   - All agents can access knowledge base for context and constraints

### Knowledge Base

The system includes a knowledge base in the `knowledge/` directory where you can:

- **User Preferences** (`user_preference.txt`) - Define your investment preferences, risk tolerance, and specific requirements that guide the AI agents' analysis and recommendations
- **Market Context** - Add industry-specific knowledge or market conditions that should influence the analysis
- **Investment Constraints** - Specify sectors to avoid, minimum market cap requirements, or other filtering criteria

### 📊 Structured Data Models & Type Safety

The agentic architecture emphasizes **type-safe data exchange** between agents using Pydantic models:

#### Core Data Models

```python
# SecuritiesNewsList (Financial Advisor Output)
class SecuritiesNews(BaseModel):
    name: str                    # Formal entity name
    code: str                    # Stock symbol/identifier
    description: str             # Business description
    reasoning: str               # Selection rationale
    news: list[str]              # Relevant market news

# SecuritiesAdviceList (Finance Director Output)  
class SecuritiesEval(BaseModel):
    name: str                    # Formal entity name
    code: str                    # Stock symbol/identifier
    advice: SecuritiesAdvice     # BUY/SELL/HOLD decision
    reasoning: str               # Decision rationale
```

#### Benefits of Structured Outputs

- **🔒 Type Safety**: Ensures data integrity between agent interactions
- **📋 Validation**: Automatic validation of agent outputs before passing to next agent
- **🔄 Consistency**: Standardized data formats across all agents
- **🐛 Error Prevention**: Catches data format issues early in the workflow

### 🛠️ Tools and Extensions

The system includes several custom tools and extensible components:

- **Custom Tools** (`src/financial_advisor/tools/`) - Extensible tools for financial data retrieval, market analysis, and security evaluation
- **External Tool Integration** - SerperDevTool for real-time web search and market data
- **Extensible Architecture** - Easy to add new tools for different data sources, analysis methods, or reporting formats
- **Model Flexibility** - Support for different LLM providers (OpenAI, Anthropic) per agent

## Running the Project

To kickstart your crew of AI agents and begin financial market analysis, run this from the root folder of your project:

```bash
crewai run
```

This command initializes the Financial Advisor Crew, assembling the agents and assigning them tasks as defined in your configuration.

### Output Files

The crew generates comprehensive financial analysis reports:

1. **`output/financial_report.md`** - Contains a complete securities investment report with detailed analysis, market performance data, and strategic recommendations (Buy/Sell/Hold) for each security

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
financial_advisor/
├── src/
│   └── financial_advisor/
│       ├── __init__.py
│       ├── main.py              # Entry point with run, train, replay, test functions
│       ├── crew.py              # Crew configuration and orchestration
│       ├── config/
│       │   ├── agents.yaml      # Agent definitions (Financial Advisor, Finance Director)
│       │   └── tasks.yaml       # Task definitions (research and analysis tasks)
│       ├── models/
│       │   └── securities.py    # Data models for securities analysis
│       └── tools/
│           ├── __init__.py
│           └── custom_tool.py   # Custom tools for financial analysis
├── knowledge/                   # Knowledge base and user preferences
│   └── user_preference.txt      # User investment preferences and constraints
├── output/                      # Generated reports
│   └── financial_report.md      # Complete securities investment analysis
├── tests/                       # Test files and test data
├── pyproject.toml               # Project dependencies and configuration
├── uv.lock                      # Dependency lock file
└── README.md                    # This file
```

## 🧠 Understanding the Agentic AI System

The Financial Advisor Crew demonstrates advanced **Multi-Agent AI** principles where autonomous agents collaborate to solve complex problems that would be challenging for a single AI system:

### Why Multi-Agent Architecture?

1. **🎯 Specialized Expertise**: Each agent has distinct knowledge domains and decision-making capabilities
2. **🔄 Parallel Processing**: Agents can work on different aspects simultaneously
3. **🛡️ Error Resilience**: If one agent fails, others can continue or compensate
4. **📈 Scalability**: Easy to add new agents or modify existing ones without affecting the entire system
5. **🔍 Quality Assurance**: Multiple agents can validate and cross-check each other's work

### Agent Collaboration Benefits

- **Financial Advisor Agent** → **Finance Director Agent** → **Report Writer Agent**
  - **Research Phase**: Deep market analysis and securities identification
  - **Evaluation Phase**: Strategic decision-making and risk assessment  
  - **Synthesis Phase**: Professional report generation and formatting

This collaborative approach ensures that complex financial analysis tasks are broken down into manageable, specialized components, with each agent contributing their unique expertise to produce comprehensive, high-quality results.

### CrewAI Framework Benefits

- **Automatic Orchestration**: Framework handles agent communication and task dependencies
- **Context Management**: Seamless data passing between agents with full context preservation
- **Tool Integration**: Agents can utilize external tools and APIs autonomously
- **Structured Outputs**: Built-in support for type-safe data validation and exchange

## Support

For support, questions, or feedback regarding the Financial Advisor Crew or crewAI:

- 📚 **Documentation**: Visit our [official documentation](https://docs.crewai.com)
- 🐛 **Issues & Contributions**: Reach out through our [GitHub repository](https://github.com/joaomdmoura/crewai)
- 💬 **Community**: [Join our Discord](https://discord.com/invite/X4JWnZnxPb)
- 🤖 **AI Assistant**: [Chat with our docs](https://chatg.pt/DWjSBZn)

## Features

### 🤖 Agentic AI Architecture
- **Multi-Agent Collaboration**: Three specialized AI agents work autonomously with distinct roles and expertise
- **Sequential Task Orchestration**: Sophisticated workflow with task dependencies and context passing
- **Type-Safe Data Exchange**: Pydantic models ensure data integrity between agent interactions
- **Autonomous Decision Making**: Each agent makes independent decisions while maintaining system coherence

### 🧠 AI Capabilities
- **Real-Time Market Research**: Financial Advisor agent autonomously researches global financial markets
- **Strategic Investment Analysis**: Finance Director agent provides expert Buy/Sell/Hold recommendations
- **Professional Report Generation**: Report Writer agent synthesizes all outputs into comprehensive reports
- **Multi-Model Support**: Different LLM providers (OpenAI, Anthropic) for specialized agent tasks

### 🛠️ Technical Features
- **Tool Integration**: SerperDevTool for real-time web search and market data access
- **Knowledge Base Integration**: User preferences and constraints guide agent decision-making
- **Structured Outputs**: Validated, type-safe data models for reliable agent communication
- **Extensible Architecture**: Easy to add new agents, tools, and analysis capabilities
- **Flexible Timeframes**: Analyze markets over any specified date range or time period

### 🔧 Framework Features
- **Easy Customization**: Simple YAML configuration files for agents, tasks, and workflows
- **Testing & Training**: Built-in support for crew training, testing, and replay functionality
- **Verbose Logging**: Detailed execution logs for monitoring agent interactions and decisions

---

*Experience the future of AI with autonomous agent collaboration. This Financial Advisor Crew demonstrates how specialized AI agents can work together to solve complex problems that would be impossible for a single AI system.*

**🚀 Ready to explore agentic AI?** Start your multi-agent financial analysis system today!

**Note**: This project showcases cutting-edge multi-agent AI architecture using the crewAI framework.
