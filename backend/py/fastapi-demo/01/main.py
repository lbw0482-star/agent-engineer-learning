from fastapi import FastAPI
# 初始化FastAPI 应用
app = FastAPI() 
# 装饰器模式 

@app.get("/")
async def root():
  return { "message": "你好，文强" }
# pydantic name -> str
@app.get("/hello/{name}")
async def say_hello(name: str):
  return { "message": f"你好 {name}"}
