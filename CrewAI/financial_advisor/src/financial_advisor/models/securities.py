from pydantic import BaseModel, Field
from enum import Enum


class SecuritiesNews(BaseModel):
    """ Information schema for securities """
    name: str = Field(description="Formal entity name")
    code: str = Field(description="Code or identifier")
    description: str = Field(description="Describe the products or services that make it valuable")
    reasoning: str = Field(description="Reason for selection")
    news: list[str] = Field(description="List of relevant information from the news")

class SecuritiesNewsList(BaseModel):
    items: list[SecuritiesNews] = Field(description="List of securities news")    

class SecuritiesAdvice(Enum):
    BUY = str("Buy")
    SELL = str("Sell")
    HOLD = str("Hold")

class SecuritiesEval(BaseModel):
    name: str = Field(description="Formal entity name")
    code: str = Field(description="Code or identifier")
    advice: SecuritiesAdvice = Field(description="Advise given after evaluation")
    reasoning: str = Field(description="Reason for advise")

class SecuritiesAdviceList(BaseModel):
    items: list[SecuritiesEval] = Field(description="List of securities advises")        