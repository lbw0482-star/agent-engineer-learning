# Memory 管理 

Agent = LLM + Harness(tool+RAG+memory+...)
给模型扩展Tool， 不只是回答问题，干活。
RAG， 基于query 获取向量数据库相关的知识放入prompt。 
都依赖于**Memory**。

大模型是无状态的， 基于上次的问答继续问，回答。 
之前已经通过chatMessages 数组？ 做了简单的Memory 管理。

- 持久化 
- 上下文窗口大小 200k? 开销 
- /compact 总结 最近，  /clear 

Agent 执行流程 ReAct ， messages 数组 -> Memory

上下文大小、开销、持久化
Memory 三种思路 截断（slice(-4)）、总结、检索 
临时记忆 
长期记忆

用InMemoryChatMessageHistory 来管理message, 放到内存里。
用addMessage 添加HumanMessage, AIMessage, ToolMessage, 
调用大模型， 返回（AIMessage）直接添加到history。
getMessage() 获取所有message 每个message 对象
HumanMessage/AIMessage/ToolMessage, 实例 type content 等属性

##  长时记忆
- 文件
- 向量数据库 


## memory 逻辑
- 存储逻辑
  内存 文件 数据库 
- 管理逻辑
  截断（slice(-4)）、总结、检索 
- trimMessages 帮我们实现了基于token 的截断
- getBufferString history messages 转为字符串 
- token精确计算

## docker milvus 安装

## 安装milvus

https://github.com/milvus-io/milvus/releases

点击 下载 
milvus-standalone-docker-compose.yml

如果把一个个 Docker 容器比作“乐高积木”，那 Docker Compose 就是那张“乐高模型图纸”。
以前你想搭个复杂的应用，得自己一个个找积木、手动拼，还容易拼错；现在你只需要照着这张“图纸”（配置文件），喊一声“一键启动”，它就能自动帮你把所有积木完美拼成一个完整的模型，省心又省力。

实现整个应用栈的一键自动化编排、部署

新建milvus 目录
将yaml文件放入

```
docker compose -f ./milvus-standalone-docker-compose.yml up -d
```
compose 合成  多容器应用进行操作
-f --file 指定文件
up 启动命令
-d 后台运行

milvus 跑在19530 端口

node 链接milvus

pnpm i @zilliz/milvus2-sdk-node
pnpm i @langchain/openai dotenv

.env

安装 GUI 工具

Attu 是Milvus 生态最好的GUI工具

https://github.com/zilliztech/attu/releases/tag/v3.0.0-beta.6

开发一个聊天应用 codex
每聊20条就出发一次总结，生成摘要， 存入milvus 向量数据库。
从milvus 取出对话历史， 接着回答， Agent更懂我们, Harness 的Memory 模块 。 