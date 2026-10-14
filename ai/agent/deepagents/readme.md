# DeepAgents

学会了langchain/langgraph 基于他们实现各种Agent。

复杂的Agent, 全部从头实现比较麻烦。 
DeepAgent 半成品的Agent 框架， 提供了基础的Agent 模型， 可以快速实现复杂的Agent。

LangChain 是给你一堆AI 开发积木， 
LangGraph 搭建复杂工作流的底层蓝图 
DeepAgent  大幅度降低复杂Agent的开发门槛， 适合快速落地复杂Agent应用。
跳过重复的底层基建，直接聚焦Agent的业务逻辑与能力迭代， 是LangGraph生态
面向生产落地的高阶封装方案。 
状态管理 state , 循环路由  持久化执行能力   底层
任务规划，长期记忆， 子Agent 调度 ， 上下文压缩等核心能力 

## createAgent  Langchain
快速启动Agent 开发， 帮我们打理底层的活。
messages , 
配置model, tools, systemPrompt, middleware

## middleware 中间件
用户 request 者对象   中间件(函数)  生成 response
中间件函数插入到每一次的agent 运行的中间来，提供一些额外的功能。
生命周期
添加状态


boss, 你好。 我是一位AI Native开发者，codex/claude codex 重度用户，熟悉sdd 开发。
具备react+ts, nextjs/nestjs 全栈开发能力，了解python,fastapi 等后端框架。熟练
掌握docker, git, 项目部署。 擅长基于langchain/langgraph/langsmith/deepagents 
全栈Agent开发， 有多个ai coding 的项目经验，Agentic RAG 优化经验。 对贵公司的岗位挺感兴趣，能安排面试不？
期待加入团队，开发让用户尖叫的AI Agent 产品。

## 深度调研助手

只需要给它一个主题

调研国家统计局公开的2023年省级地区生产总值（GDP）数据： 提取GDP总量前6名省份的具体数值及同比增速， 计算六省GDP 总和、各省占全国GDP 的比重， 并按增速从高到低排名。 

## Agents 划分
### 主Agent 
整个系统的编排中心，负责把用户输入的调研主题拆解成可执行流程（内置 `write_todos` 规划工具），并协调各子Agent分工完成。 
它不亲自包揽所有调研细节， 而是按 规划 -> 调研 -> 分析 -> 起草 -> 审阅 -> 定稿
推荐任务；先用待办列表明确步骤， 再按需委派子Agent, 最后由自己整合材料， 撰写报告并根据编辑反馈修订定稿。

### 调研员子Agent (researcher): 

每次只负责一个聚焦的子主题。 通过网络搜索收集资料， 将关键事实与来源URL 整理成结构化摘要， 写入 finds_*.md。 多个调研员可并行工作， 适合大主题拆成若干子方向同时推进。 

### 分析师子Agent （analyst） 可选

当调研涉及数字对比、排名、增长率等计算时启用。
@langcin/quickjs 提供一个**沙箱（安全）**， 编写js 代码， 并在沙箱中执行，得到执行的结果。
 不会影响Agent 的正常运行。 llm 不擅长计算，llm 擅长写代码并完成计算， 写入 analysis_*.md。 
 供主Agent 写报告时引用。

## 编辑子Agent(editor)
在报告草稿完成后介入， 从准确性、结构完整性、来源引用、语言表达等维度审阅， 返回具体修改建议。
编辑部直接改写报告， 审阅与修订分离， 便于主Agent 在保持整体思路的前提下做针对性修改。

