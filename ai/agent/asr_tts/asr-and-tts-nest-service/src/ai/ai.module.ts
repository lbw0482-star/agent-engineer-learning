import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConfigService } from "@nestjs/config";
import { ChatOpenAI } from "@langchain/openai";

@Module({
  controllers: [AiController],
  // 配置模块可以使用的服务
  providers: [
    // 引入
    AiService,
    // 自定义  
    {
      provide: 'CHAT_MODEL', // llm 和service 解耦 好维护， 更换模型
      // 工厂模式
      useFactory: (configService: ConfigService) => {
        console.log(configService.get("MODEL_NAME"));
        return new ChatOpenAI({
          modelName: configService.get("MODEL_NAME"),
          apiKey: configService.get("OPENAI_API_KEY"),
          configuration: {
            baseURL: configService.get("OPENAI_BASE_URL"),
          }
        })
      },
      // 依赖.env ,注入 ConfigService
      inject: [ConfigService],
    }
  ]
})
export class AiModule {}
