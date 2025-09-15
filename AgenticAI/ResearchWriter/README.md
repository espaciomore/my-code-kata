# ResearchWriter

A multi-agent research system demonstrating advanced AI orchestration patterns. This project showcases how to build complex workflows using specialized AI agents, each with distinct responsibilities and capabilities.

## Architecture Overview

ResearchWriter implements a **Multi-Agent Orchestration Pattern** where specialized AI agents collaborate to accomplish complex research tasks. The system follows several key architectural patterns:

### 1. Agent-Based Architecture Pattern

Each agent is a specialized component with:

- **Single Responsibility**: Each agent handles one specific aspect of the research process
- **Encapsulated State**: Agents maintain their own configuration and behavior
- **Standardized Interface**: All agents implement consistent async methods
- **Tool Integration**: Agents can use external tools (like SendGrid) through function tools

### 2. Orchestrator Pattern

The `AgentManager` acts as the orchestrator, implementing:

- **Workflow Coordination**: Manages the sequence of agent execution
- **Data Flow Management**: Passes structured data between agents
- **Error Handling**: Manages failures and fallbacks
- **Progress Reporting**: Provides real-time updates via async generators

### 3. Pipeline Pattern

The research process follows a linear pipeline:

```
Query → Planning → Research → Writing → Delivery
```

### 4. Data Transfer Object (DTO) Pattern

Structured data flows between agents using Pydantic models:

- `WebSearchItem` & `WebSearchPlan` (Planner → Searcher)
- `WebSearchResult` (Searcher → Writer)
- `ReportData` (Writer → Sender)

## Agent Specialization

### AgentPlanner

**Pattern**: Strategy Pattern + Template Method

- **Responsibility**: Query decomposition and search strategy
- **Input**: Natural language research query
- **Output**: Structured search plan with multiple focused topics
- **AI Model**: GPT-4o-mini with structured output (Pydantic)

### AgentSearcher

**Pattern**: Adapter Pattern + Retry Pattern

- **Responsibility**: Web research and content summarization
- **Input**: Individual search topics with context
- **Output**: Summarized research findings
- **Error Handling**: Graceful failure with null return

### AgentWriter

**Pattern**: Template Method + Builder Pattern

- **Responsibility**: Content synthesis and report generation
- **Input**: Original query + multiple research results
- **Output**: Multi-format report (Markdown, HTML, summary, questions)
- **Structure**: Academic writing format with clear sections

### AgentSender

**Pattern**: Facade Pattern + Function Tool Integration

- **Responsibility**: External service integration (email delivery)
- **Input**: Complete report data
- **Output**: Delivery confirmation
- **Tools**: SendGrid API integration via function tools

### AgentManager

**Pattern**: Mediator Pattern + Observer Pattern

- **Responsibility**: Workflow orchestration and progress reporting
- **Coordination**: Manages agent execution sequence
- **Communication**: Provides async generator for real-time updates
- **Error Management**: Handles agent failures and continues workflow

## Design Patterns in Detail

### Async Generator Pattern

The system uses Python's async generators for real-time progress reporting:

```python
async def run(self, query: str):
    yield "Search plan created"      # Progress update
    # ... processing ...
    yield "Searches completed"       # Progress update
    # ... processing ...
    yield report.markdown_report     # Final result
```

### Function Tool Pattern

External services are integrated through function tools:

```python
@function_tool
def send_email(subject: str, html_body: str) -> Dict[str, str]:
    # SendGrid integration
    return {"status": "success"}
```

### Structured Output Pattern

All agents use Pydantic models for type-safe data exchange:

```python
class WebSearchPlan(BaseModel):
    search_items: list[WebSearchItem] = Field(description="Search topics")
```

### Error Handling Strategy

- **Graceful Degradation**: Failed searches don't stop the entire workflow
- **Null Object Pattern**: Agents return None instead of throwing exceptions
- **Circuit Breaker**: Individual agent failures are isolated

## Implementation Patterns

### Agent Factory Pattern

Each agent is instantiated with specific configuration:

```python
def __init__(self) -> None:
    self.agent = Agent(
        name="Search Planner Agent",
        instructions="...",
        model="gpt-4o-mini",
        output_type=WebSearchPlan
    )
```

### Dependency Injection

Environment variables and external services are injected:

- Configuration via environment variables
- External API keys through dependency injection
- Tool registration through function decorators

### Observer Pattern

The Gradio interface observes the async generator for real-time updates:

```python
textbox_query.submit(fn=search, inputs=textbox_query, outputs=result_canvas)
```

## Project Structure

```
ResearchWriter/
├── agent-app/                 # Agent implementations
│   ├── agent_manager.py      # Orchestrator (Mediator + Observer)
│   ├── agent_planner.py      # Strategy + Template Method
│   ├── agent_searcher.py     # Adapter + Retry
│   ├── agent_writer.py       # Template Method + Builder
│   ├── agent_sender.py       # Facade + Function Tool
│   └── app.py                # UI Layer (Observer)
├── main.py                   # Entry point
└── pyproject.toml            # Dependencies
```

## Key Architectural Benefits

1. **Modularity**: Each agent can be developed, tested, and deployed independently
2. **Scalability**: Agents can be distributed across different services
3. **Maintainability**: Clear separation of concerns makes code easier to modify
4. **Testability**: Individual agents can be unit tested in isolation
5. **Extensibility**: New agents can be added without modifying existing ones
6. **Fault Tolerance**: Agent failures don't cascade through the system

## Usage

### Quick Start

```bash
# Install dependencies
uv sync

# Set up environment
cp .env.example .env  # Configure your API keys

# Run the system
uv run agent-app/app.py
```

### Environment Configuration

```env
OPENAI_API_KEY=your_key_here
SENDGRID_API_KEY=your_key_here
SENDGRID_SENDER_EMAIL=sender@example.com
SENDGRID_RECIPIENT_EMAIL=recipient@example.com
SEARCH_DEPTH=5
```

## Learning Objectives

This project demonstrates:

- **Multi-Agent System Design**: How to coordinate multiple AI agents
- **Async Programming**: Using async/await for concurrent operations
- **Design Patterns**: Practical application of common patterns
- **API Integration**: Connecting AI agents with external services
- **Type Safety**: Using Pydantic for robust data validation
- **Error Handling**: Building resilient distributed systems

## Contributing

This project serves as a reference implementation for multi-agent AI systems. Contributions that improve the architectural patterns or add new agent types are welcome.

**Note**: This description was generated by AI.
