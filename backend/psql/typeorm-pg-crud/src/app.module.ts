import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './conversations/entities/message.entity';
import { User } from './conversations/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "user",
      password: "123456",
      database: "hello_pg",
      // 会自动根据实体类同步数据库表结构，实体改了就自动改数据库表
      synchronize: true,
      // 开启 TypeORM 日志，会把执行的每一条 SQL 语句打印到控制台，方便调试查看实际跑的 SQL，生产环境建议关掉。
      logging: true,
      // entities 用来放**实体类** 注册一下
      entities: [User, Conversation, Message] // 每个表的类都是一个实体
    }),
    ConversationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
