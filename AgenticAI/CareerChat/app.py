#!/usr/bin/env python3.12.10

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

import gradio as gr
import os

load_dotenv(override=True)

openai = OpenAI()

def read_file(file_path):
    content = ""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    return content

resume = read_file("./resume.txt")
name = "John Snow"
rules = """
- Answer in the same language as the question.
- Be polite and friendly.
- Do not speak like an assistant.
- Do not ask questions deliberately.
- If you don't know the answer, say so.
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

def chat(message, history):
    messages = [{"role": "system", "content": system_prompt}] + history + [{"role": "user", "content": message}]
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    reply = response.choices[0].message.content
    evaluation = evaluate(reply, message, messages[:1])

    if not evaluation.is_acceptable:
        print(evaluation.feedback)
        reply = rerun(reply, message, history, evaluation.feedback)

    return reply 

gr.ChatInterface(chat, type="messages", theme="soft").launch()    