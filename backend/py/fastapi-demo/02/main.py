from dotenv import load_dotenv
import os 
from fastapi import FastAPI
# 基类 类型检测的功能
from pydantic import BaseModel
from langchain_openai import ChatOpenAI

load_dotenv()

app = FastAPI(title="LangChain & FastAPI")

llm = ChatOpenAI(
  api_key = os.getenv("DEEPSEEK_API_KEY"),
  base_url = os.getenv("DEEPSEEK_BASE_URL"),
  model=os.getenv("DEEPSEEK_MODEL"),
  temperature=0.7
)

class ChatReq(BaseModel):
  prompt: str

# 校验请求体的类型
@app.post("/chat")
async def chat(req: ChatReq):
  resp = llm.invoke(req.prompt)
  return {
    "input": req.prompt,
    "replay": resp.content
  }
  # print("")


if __name__ == "__main__":
  import uvicorn
  uvicorn.run("main:app", host="0.0.0.0", port=8000, 
  reload=True)