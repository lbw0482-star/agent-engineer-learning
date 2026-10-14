import { Controller, Sse, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import {
  from,
  map,
  Observable 
} from "rxjs"; // 

@Controller('ai')
export class AiController {
  // 自动注入 AiService 实例， 用于调用服务层的方法
  constructor(private readonly aiService: AiService) {}
  // 装饰器模式， 定义路由/ai/chat/stream`， 用于处理流式输出
  @Sse('chat/stream')
  chatStream(@Query('query') query: string) {
    // 持续输出
    console.log(query);
    // streamChain 是aiService中的生成器函数
    // 执行后得到生成器对象 可迭代对象
    // rsjx 将 可迭代对象 转换为 Observable 观察流式处理的对象
    return from(this.aiService.streamChain(query))
      .pipe(
        // sse 和前端约定的格式 
        map(chunk => ({data: chunk}))
      )
  }
}
