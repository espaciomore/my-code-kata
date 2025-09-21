#!/usr/bin/env python
import sys
import warnings

from datetime import datetime, timedelta

from financial_advisor.crew import FinancialAdvisor

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    inputs = {
        'from_date': str(datetime.now() - timedelta(days=10)),
        'to_date': str(datetime.now())
    }
    
    try:
        FinancialAdvisor().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'from_date': (datetime.now() - timedelta(days=10)).strftime("%A, %B %d, %Y"),
        'to_date': datetime.now().strftime("%A, %B %d, %Y")
    }
    try:
        FinancialAdvisor().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        FinancialAdvisor().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'from_date': str(datetime.now() - timedelta(days=10)),
        'to_date': str(datetime.now())
    }
    
    try:
        FinancialAdvisor().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
