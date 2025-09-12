# CareerChat

An intelligent AI-powered career chat application that simulates conversations with a professional persona based on a resume. The project provides two different implementations using different AI frameworks while maintaining quality through an automated evaluation and feedback system.

## Features

- **AI-Powered Chat Interface**: Interactive chat interface built with Gradio
- **Resume-Based Persona**: AI agent that responds as a specific professional based on provided resume
- **Quality Assurance**: Automated evaluation system using Google's Gemini model to ensure response quality
- **Multi-Language Support**: Responds in the same language as the user's question
- **Self-Improvement**: Automatic retry mechanism when responses are rejected by the evaluator
- **Notification System**: Pushover integration for tracking unanswered questions
- **Dual Implementation**: Two different approaches using OpenAI's agents framework and direct OpenAI API

## Technology Stack

- **Python 3.12+**
- **OpenAI GPT-4o-mini**: Primary AI model for generating responses
- **Google Gemini 2.0 Flash**: Evaluation model for quality assessment
- **Gradio**: Web interface framework
- **Pydantic**: Data validation and parsing
- **python-dotenv**: Environment variable management
- **OpenAI Agents Framework**: Advanced agent orchestration (agent-app)
- **uv**: Fast Python package manager and workspace management

## Project Structure

```
CareerChat/
├── agent-app/          # Implementation using OpenAI Agents framework
│   ├── app.py          # Main application with agent-based architecture
│   ├── requirements.txt # Dependencies for agent implementation
│   ├── resume.txt      # Resume data for the AI persona
│   ├── pyproject.toml  # Project configuration
│   └── README.md       # Agent-specific documentation
├── openai-app/         # Implementation using direct OpenAI API
│   ├── app.py          # Main application with direct API calls
│   ├── requirements.txt # Dependencies for OpenAI implementation
│   ├── resume.txt      # Resume data for the AI persona
│   ├── pyproject.toml  # Project configuration
│   └── README.md       # OpenAI-specific documentation
├── main.py             # Entry point (placeholder)
├── pyproject.toml      # Workspace configuration
├── uv.lock            # Dependency lock file
└── README.md          # This file
```

## Setup

### Prerequisites

- Python 3.12 or higher
- OpenAI API key
- Google API key (for Gemini)
- Pushover account (optional, for notification features)
- uv package manager (recommended)

### Installation

1. Clone the repository and navigate to the CareerChat directory:

   ```bash
   cd AgenticAI/CareerChat
   ```

2. Install uv (if not already installed):

   ```bash
   pip install uv
   ```

3. Install dependencies using uv:

   ```bash
   uv sync
   ```

   Or install dependencies for a specific application:

   ```bash
   # For agent-app (using OpenAI Agents framework)
   cd agent-app
   uv sync

   # For openai-app (using direct OpenAI API)
   cd openai-app
   uv sync
   ```

4. Create a `.env` file in each application directory with your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   PUSHOVER_USER=your_pushover_user_key  # Optional
   PUSHOVER_TOKEN=your_pushover_app_token  # Optional
   ```

### Running the Applications

#### Agent-App (OpenAI Agents Framework)

1. Navigate to the agent-app directory:

   ```bash
   cd agent-app
   ```

2. Start the application:

   ```bash
   uv run python app.py
   ```

#### OpenAI-App (Direct OpenAI API)

1. Navigate to the openai-app directory:

   ```bash
   cd openai-app
   ```

2. Start the application:

   ```bash
   uv run python app.py
   ```

3. Open your web browser and navigate to the URL provided in the terminal (typically `http://localhost:7860`)

## Application Differences

### Agent-App (OpenAI Agents Framework)

- **Architecture**: Uses OpenAI's agents framework for more sophisticated agent orchestration
- **Features**: 
  - Built-in function calling with `@function_tool` decorator
  - Async/await pattern for better performance
  - More structured agent management
- **Dependencies**: `openai-agents`, `requests`, `python-dotenv`, `gradio`
- **Best for**: More complex agent interactions and future extensibility

### OpenAI-App (Direct OpenAI API)

- **Architecture**: Uses direct OpenAI API calls with manual tool handling
- **Features**:
  - Manual function calling implementation
  - Synchronous execution
  - More direct control over API interactions
- **Dependencies**: `openai`, `openai-agents`, `requests`, `python-dotenv`, `gradio`
- **Best for**: Simpler implementations and direct API control

## How It Works

### 1. Persona Creation

The application reads the resume from `resume.txt` and creates a system prompt that instructs the AI to respond as the professional described in the resume.

### 2. Chat Interface

Users can interact with the AI through a Gradio chat interface. The AI responds based on the resume information while following specific rules:

- Answer in the same language as the question
- Be polite and friendly
- Don't speak like an assistant
- Don't ask questions deliberately
- Admit when you don't know something

### 3. Quality Evaluation

Each response is automatically evaluated by a separate AI model (Gemini) that:

- Checks if the response follows the established rules
- Ensures the response is appropriate and helpful
- Provides feedback for improvement if needed

### 4. Self-Improvement

If a response is rejected by the evaluator, the system:

- Incorporates the feedback into an updated system prompt
- Regenerates the response with the improved context
- Ensures higher quality responses over time

### 5. Notification System

When the AI agent is unable to answer a question, it:

- Uses the `unable_to_answer` function tool
- Sends a notification via Pushover (if configured)
- Tracks unanswered questions for future improvement

## Configuration

### Customizing the Persona

To change the professional persona, simply replace the content in `resume.txt` in either application directory with the desired resume information. The AI will automatically adapt to the new persona.

### Modifying Rules

The conversation rules can be modified in the `rules` variable in each `app.py`:

```python
rules = """
- Answer in the same language as the question.
- Be polite and friendly.
- Do not speak like an assistant.
- Do not ask questions deliberately.
- If you don't know the answer, say so and use unable_to_answer tool with the given question.
"""
```

### Pushover Notifications (Optional)

To enable notifications for unanswered questions:

1. Create a Pushover account at https://pushover.net/
2. Create an application to get your API token
3. Add the following to your `.env` file:

   ```env
   PUSHOVER_USER=your_user_key
   PUSHOVER_TOKEN=your_app_token
   ```

## API Keys Required

- **OpenAI API Key**: Required for the main chat functionality using GPT-4o-mini
- **Google API Key**: Required for the evaluation system using Gemini 2.0 Flash
- **Pushover Credentials**: Optional, for notification features

## Dependencies

### Agent-App Dependencies

- `openai-agents`: OpenAI Agents framework
- `requests`: HTTP library for Pushover notifications
- `python-dotenv`: Environment variable management
- `gradio`: Web interface framework

### OpenAI-App Dependencies

- `openai`: OpenAI API client
- `openai-agents`: Additional OpenAI functionality
- `requests`: HTTP library for Pushover notifications
- `python-dotenv`: Environment variable management
- `gradio`: Web interface framework

### Workspace Management

- `uv`: Fast Python package manager and workspace management
- `pydantic`: Data validation (included with agents framework)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a personal code kata collection and is available for educational purposes.

## Future Enhancements

- **Multi-Persona Support**: Switch between different professional personas during conversations
- **Conversation History Persistence**: Save and load conversation history across sessions
- **Advanced Evaluation Metrics**: More sophisticated quality assessment beyond binary accept/reject
- **Integration with Additional AI Models**: Support for other LLM providers (Anthropic, Cohere, etc.)
- **Customizable Evaluation Criteria**: User-defined evaluation rules and criteria
- **Real-time Analytics Dashboard**: Monitor conversation quality and agent performance
- **Voice Interface**: Add speech-to-text and text-to-speech capabilities
- **Document Upload**: Allow users to upload additional documents for context
- **Conversation Export**: Export conversations in various formats (PDF, JSON, etc.)
- **A/B Testing Framework**: Compare different agent configurations and prompts
- **Webhook Integration**: Send conversation events to external systems
- **Rate Limiting and Usage Tracking**: Monitor API usage and implement rate limiting

**Note**: This description was generated by AI.


