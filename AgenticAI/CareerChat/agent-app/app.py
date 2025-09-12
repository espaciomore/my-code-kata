#!/usr/bin/env python3.12.10

from dotenv import load_dotenv
from pydantic import BaseModel
from openai import AsyncOpenAI
from agents import Agent, function_tool, Runner, OpenAIChatCompletionsModel, set_tracing_disabled

import gradio as gr
import os
import requests

load_dotenv(override=True)

set_tracing_disabled(disabled=True)

def read_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

resume = read_file("./resume.txt")
name = "Manuel Cerda"
rules = """
- Answer in the same language as the question.
- Be polite and friendly.
- Do not speak like an assistant.
- Do not ask questions deliberately.
- If you don't know the answer, say so and use unable_to_answer tool with the given question.
"""

main_chat_agent_instructions = f"""
You are acting in behalf of {name}.
You are answering questions about your resume.

You need to comply with the following rules:
{rules}

Here is your resume:

{resume}
"""

pushover_user = os.getenv("PUSHOVER_USER")
pushover_token = os.getenv("PUSHOVER_TOKEN")
pushover_url = "https://api.pushover.net/1/messages.json"

def push_notification(message):
    payload = {"user": pushover_user, "token": pushover_token, "message": message}
    requests.post(pushover_url, payload)
    
@function_tool
def unable_to_answer(question: str) -> dict:
    """Use this tool when unable to answer a question"""
    push_notification(f"Agent was unable to answer this : '{question}'")
    return {"status": "OK"}

# Create the main agent
main_chat_agent = Agent(
    name="Main chat agent",
    model="gpt-4o-mini",
    instructions=main_chat_agent_instructions,
    tools=[unable_to_answer]
) 

class Evaluation(BaseModel):
    is_acceptable: bool
    feedback: str

evaluator_agent_instructions = f"""
You are an evaluator.
You are evaluating the responses of an agent acting in behalf of {name}.
Your task is to accept or reject based on the quality of the response.

The agent is suppose to follow the following rules :
{rules}

The agent has been provided the following information:
{resume}

With this context, please evaluate the last response by replying acceptable or rejected.
"""

# Create evaluator agent
evaluator_agent = Agent(
    name="Evaluator agent",
    model=OpenAIChatCompletionsModel(
        model="gemini-2.0-flash", 
        openai_client=AsyncOpenAI(base_url="https://generativelanguage.googleapis.com/v1beta/openai/", api_key=os.getenv("GOOGLE_API_KEY"))
    ),
    instructions=evaluator_agent_instructions,
    output_type=Evaluation
)   

async def evaluate(reply, message, history) -> Evaluation:
    evaluate_instructions = f"Here's the conversation between the User and the Agent: \n\n{history}\n\n"
    evaluate_instructions += f"Here's the last message from the User: \n\n{message}\n\n"
    evaluate_instructions += f"Here's the last response from the Agent: \n\n{reply}\n\n"
    evaluate_instructions += "Please evaluate the last response by replying acceptable or rejected and your feedback."
    
    response = await Runner.run(evaluator_agent, evaluate_instructions)
    return response.final_output

async def rerun(reply, message, history, feedback):
    updated_instructions = main_chat_agent_instructions
    updated_instructions += f"\n\nChat History:\n{history}\n\n"
    updated_instructions += "ATTENTION : You previous answer was rejected.\n"
    updated_instructions += f"## Attempted answer:\n{reply}\n\n"
    updated_instructions += f"## Rejection reason:\n{feedback}\n\n"
    
    # Create a temporary agent with updated system prompt
    temp_agent = Agent(
        name="Retry agent",
        model="gpt-4o-mini",
        instructions=updated_instructions,
        tools=[unable_to_answer]
    )

    response = await Runner.run(temp_agent, message)
    return response.final_output


def chat(message, history):
    import asyncio
    
    async def async_chat():
        response = await Runner.run(main_chat_agent, message)
        reply = response.final_output

        evaluation = await evaluate(reply, message, history)

        if not evaluation.is_acceptable:
            reply = await rerun(reply, message, history, evaluation.feedback)

        return reply
    
    return asyncio.run(async_chat())

gr.ChatInterface(chat, type="messages", theme="soft").launch()
