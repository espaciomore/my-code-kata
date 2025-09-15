#!/usr/bin/env python3.12.10

from dotenv import load_dotenv
from agent_manager import AgentManager

import gradio as gr


load_dotenv(override=True)

async def search(query: str):
    async for chunk in AgentManager().run(query):
        yield chunk

with gr.Blocks(theme=gr.themes.Ocean()) as ui:
    
    textbox_query = gr.Textbox(label="Research Writer", placeholder="Type the research topic then press Enter")
    result_canvas = gr.Markdown(label="Report canvas")

    textbox_query.submit(fn=search, inputs=textbox_query, outputs=result_canvas)

ui.launch(inbrowser=True)