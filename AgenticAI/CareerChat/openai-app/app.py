#!/usr/bin/env python3.12.10

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

import gradio as gr
import os
import json
import requests

load_dotenv(override=True)

openai = OpenAI()

def read_file(file_path):
    content = ""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    return content

resume = read_file("./resume.txt")
name = "Manuel Cerda"
rules = """
- Answer in the same language as the question.
- Be polite and friendly.
- Do not speak like an assistant.
- Do not ask questions deliberately.
- If you don't know the answer, say so and use unable_to_answer tool with the given question.
"""

system_prompt = f"""
You are acting in behalf of {name}.
You are answering questions about your resume.

You need to comply with the following rules:
{rules}

Here is your resume:

{resume}
"""

class Evaluation(BaseModel):
    is_acceptable: bool
    feedback: str

evaluator_system_prompt = f"""
You are an evaluator.
You are evaluating the responses of an agent acting in behalf of {name}.
Your task is to accept or reject based on the quality of the response.

The agent is suppose to follow the following rules :
{rules}

The agent has been provided the following information:
{resume}

With this context, please evaluate the last response by replying acceptable or rejected.
"""

def evaluator_user_prompt(reply, message, history):
    user_prompt = f"Here's the conversation between the User and the Agent: \n\n{history}\n\n"
    user_prompt += f"Here's the last message from the User: \n\n{message}\n\n"
    user_prompt += f"Here's the last response from the Agent: \n\n{reply}\n\n"
    user_prompt += "Please evaluate the last response by replying acceptable or rejected and your feedback."

    return user_prompt

gemini = OpenAI(
    api_key=os.getenv("GOOGLE_API_KEY"), 
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)   

def evaluate(reply, message, history) -> Evaluation:
    messages = [{"role": "system", "content": evaluator_system_prompt}] + [{"role": "user", "content": evaluator_user_prompt(reply, message, history)}]
    response = gemini.beta.chat.completions.parse(model="gemini-2.0-flash", messages=messages, response_format=Evaluation)

    return response.choices[0].message.parsed

def rerun(reply, message, history, feedback):
    updated_system_prompt = system_prompt + "\n\nATTENTION : You previous answer was rejected.\n"
    updated_system_prompt += f"## Attempted answer:\n{reply}\n\n"
    updated_system_prompt += f"## Rejection reason:\n{feedback}\n\n"
    messages = [{"role": "system", "content": updated_system_prompt}] + history + [{"role": "user", "content": message}]
    response = openai.chat.completions.create(model="gpt-4o-mini", messages=messages)

    return response.choices[0].message.content

pushover_user = os.getenv("PUSHOVER_USER")
pushover_token = os.getenv("PUSHOVER_TOKEN")
pushover_url = "https://api.pushover.net/1/messages.json"

def push_notification(message):
    payload = {"user": pushover_user, "token": pushover_token, "message": message}
    requests.post(pushover_url, payload)

def unable_to_answer(question):
    push_notification(f"Agent was unable to answer this : '{question}'")

    return { "status": "OK" }

unable_to_answer_meta = {
    "name": "unable_to_answer",
    "description": "Use this tool when unable to answer a question",
    "parameters": {
        "type": "object",
        "properties": {
            "question": {
                "type": "string",
                "description": "The given question"
            },
        },
        "required": ["question"],
        "additionalProperties": False
    }
}

tools = [{"type": "function", "function": unable_to_answer_meta}]

# For more details see https://platform.openai.com/docs/guides/function-calling

def handle_tool_calls(tool_calls):
    results = []
    for tool_call in tool_calls:
        arguments = json.loads(tool_call.function.arguments)
        tool =  globals().get(tool_call.function.name)
        result = tool(**arguments) if tool else {}
        results.append({"role": "tool", "content": json.dumps(result), "tool_call_id": tool_call.id})

    return results    

def chat(message, history, messages=None):
    if messages is None:
        messages = [{"role": "system", "content": system_prompt}] + history + [{"role": "user", "content": message}]

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools
    )

    finish_reason = response.choices[0].finish_reason
    response_message = response.choices[0].message

    if finish_reason == "tool_calls":
        results = handle_tool_calls(response_message.tool_calls)
        messages.append(response_message)
        messages.extend(results)
        reply = chat(message, history, messages)
    else :    
        reply = response_message.content

        evaluation = evaluate(reply, message, messages[:1])

        if not evaluation.is_acceptable:
            reply = rerun(reply, message, history, evaluation.feedback)

    return reply 

gr.ChatInterface(chat, type="messages", theme="soft").launch()    