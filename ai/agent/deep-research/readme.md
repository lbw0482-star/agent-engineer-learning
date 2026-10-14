# 深度研究智能体

## LangChain LangGraph DeepAgents 区别和框架？

官方定义： 同一套技术栈的不同层。 

## LangGraph
底层引擎， 一台发动机。管的是Agent 执行流程设计。 掌握着最大控制权，最小抽象。
适合精细掌控的每个步骤， 都在LangGraph 层面敲定。

## LangChain 
上层框架， 给了最简单的Agent 抽象（createAgent）, 模型跑在循环里调工具（Agentic Loop）
中间件机制，  各种业务流程 控制力度比LangGraph 粗（RunnableSequence）。

##  DeepAgents
建立在LangGraph上， 开箱即用harness。
是langchain 的核心Agent, 叫上一堆开箱即用的高级Agent。
它自带文件系统、子Agent 拆分， 会话记忆， 快速上手，
代价是他的设计是带观点的。 官方已经帮你做了很多决策， 
如果不认同， 就得下沉到LangChain 或LangGraph 层去修改。

LangGraph 是发动机， LangChain 是整车框架， DeepAgents 是精装车（小米鹏程 ）