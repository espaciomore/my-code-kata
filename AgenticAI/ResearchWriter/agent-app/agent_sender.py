from email import message
from agents import Agent, Runner, function_tool
from sendgrid.helpers.mail import Email, Mail, Content, To
from typing import Dict
from agent_writer import ReportData

import sendgrid
import os


@function_tool
def send_email(subject: str, html_body: str) -> Dict[str, str]:
    """ Send an email with the given subject and HTML body """
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
    from_email = Email(os.getenv("SENDGRID_SENDER_EMAIL"))
    to_email = To(os.getenv("SENDGRID_RECIPIENT_EMAIL"))
    content = Content("text/html", html_body)
    mail = Mail(from_email, to_email, subject, content).get()
    response = sg.client.mail.send.post(request_body=mail)
    print("Email response", response.status_code)
    return {"status": "success"}

class AgentSender():
    agent : Agent
    
    def __init__(self) -> None:
        self.agent = Agent(
            name = "Report Sender Agent",
            instructions = "You are responsible for sending well formatted report.\n" +
            "You will be provided with the body and you should use the necessary tool to accomplish this task.\n" +
            "Use the send_email for sending email.",
            tools = [send_email],
            model = "gpt-4o-mini"
        )
        
    async def send_email(self, report: ReportData) -> Dict[str, str]:
        """Sends a report by email given an HTML format"""
        message = f"Send report by email with body :\n{report.html_report}"
        result = await Runner.run(self.agent, message)
        return result.final_output