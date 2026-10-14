import { Inject, Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import type { Runnable } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class AiService {
  private readonly chain: Runnable;
  // 自动注入 ChatOpenAI 实例， 用于调用模型
  constructor(
    @Inject('CHAT_MODEL') model: ChatOpenAI
  ) {
    const prompt = PromptTemplate.fromTemplate(`
    请回答以下问题：\n\n {query}  
    `);
    this.chain = prompt.pipe(model).pipe(new StringOutputParser())
  }
  // 生成器函数 Generator Function
  // async 函数只会返回一次 
  // 多次返回， 不断地返回， 支持SSE 
  async *streamChain(query: string) {
    // 流式输出
    const stream = await this.chain.stream({query});
    console.log(stream);
    for await (const chunk of stream) {
      yield chunk;
    }
  }
}
