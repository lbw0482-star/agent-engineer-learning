# 结构化大模型输出： 

## 流式输出
- stream: true 开启流式输出
- 水管， 一头接着llm server, 一头 客户端， 不断地有token流向 客户端
  buffer 

## stream  服务器端本质
- llm server
- http 协议 
  基于请求响应的简单协议
- 响应？ response 
  - 同步
  - 流式 ？ pipe

## SSE 
Server Sent Events 
服务器单向不停地往浏览器推送消息，发送多次， 不会断开链接
浏览器建立一条长链接，服务器一点一点(chunk发数据)， 也就是流式输出。
```
Conetent-Type: text/event-stream;
Cache-control: no-cache;
Connection: keep-alive;

```


相比于传统的http 同步传输， 请求，响应， 断开链接？
```
Conetent-Type: text/plain
Conetent-Type: text/html
```
## EventSource 类
用于连接SSE , 给他url 
sse 不只有llm 返回， 股票...
stream fs流 pip一下 
当服务器端有新的数据chunk 到达后， 触发 onmessage 事件

## outputparser
json -> 继续执行
prompt 约束
大模型按照我们的格式要求， 返回一个json 
key:value,... 
JSON.parse()

## 失败了
json 固定格式 输出， 被markdown 格式包裹，llm 输出常是markdown 格式，
这是展示的需要。
- 移除```json    ``` 包裹
- 正则 replace 方法

prompt output 技巧 -> llm 返回 markdown 格式 -> 正则业务取出md格式 -> JSON.parse()
每次AI 调用的常见业务， langchain 提供相应的业务API, 省去开发的复杂度。

## JsonOutputParser 
langchain 用来解析json 结果的。
约束返回格式json， JSON.parse()
parser.getFormatInstructions() 空， json太常见的格式需求
parser.parse 

本质 就是 通过 getFormatInstructions() 在prompt 里添加对output 的结构化格式约定， 
parser.parse() 取出markdown 拿到json 

## StructuredOutputParser
- fromNamesAndDescriptions
- fromZodSchema

下流业务用上靠谱的JSON 输出

- tool 
  参数的schema 约束， 顺手完成了llm 输出的格式化，结构化
  - 来自llm 原生的工作机制
  - 非常严苛且准确的校验参数 利用
  - 工具函数没有执行？ 


没有必要用output parser 了， tool calls 的参数 ， 也能拿到结构化的数据， 而且，
因为tool_calls llm 自身的机制， 会更严格， 更好。

为了语义化， langchain 封装了 model.withStructureOutput(schema),
高阶Api, 它的内部实现 tool call 
有的大模型不支持tool call, 降级为使用
Prompt + JSON 描述来做 

JsonOutputParser -> StructuredOutputParser (fromNamesAndDescriptions + fromZodSchema) ->tool call (args) -> model.withStructuredOutput(schema) 可读性

output-parser 模块 是不是可以丢了？
不可以， 格式化输出， 不只有JSON格式， XML, YAML, 等
推荐用的是 model.withStructuredOutput， 格式特殊， 用 output_parsers 解析

流式输出  
