# 给Agent 加上语音交互： ASR + TTS

常用的Agent 都有语音功能。

语音输入会转成文本（ASR），大模型的回答通过语音朗读（TTS）,可以切换音色。Agent开发的必备技术。

点击录音， 输入一段语音， 服务器端提供接口来转文字， 之后用大模型生成回答。
流式SSE返回文字， 同时用WebSocket 返回流式语音。
这样就可以实现语音输入、流式的文字、语音输入。
为啥不直接用SSE 返回音频数据呢？ 
因为 SSE 是基于HTTP的文本协议， 需要转base64才行， 传这种二进制数据还是WebSocket更
合适。SSE 是基于GET 请求。 

Content-Type: text/event‑stream

## ASR 前端功能
- 静态服务器 @nestjs/serve-static
- 录音功能
  asr.html  用户交互
  navigator.mediaDevices.getUserMedia
  MediaRecorder 录音API  stream -> chunk
- 二进制音频 提交到 nest 服务端
- 服务端再调用腾讯云ASR  返回文本
- 向大模型 发送流式请求 sse 
- 显示文本