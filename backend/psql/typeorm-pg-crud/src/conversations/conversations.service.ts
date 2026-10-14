import { 
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
// EntityManager 是 TypeORM 的统一操作工具对象
import { EntityManager } from 'typeorm'; 
// 依赖注入 sql -> orm -> psql 
// 把 EntityManager 数据库操作对象，注入到你的 service 里直接拿来用
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectEntityManager() 
    private readonly em: EntityManager) {
  }
  async findConversationsByUserId(userId: number) {
    // 用面向对象 代替了底层的命令式的sql 
    const user = await this.em.findOne(User, {
      where: { id: userId },
      relations: { conversations: true },
      order: { conversations: {createdAt: 'DESC'} }
    })
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }

  async searchSimilarMessages (
    conversationId: number,
    query: string,
    limit: number
  ) {
    return {
      messages: []
    }
  }

  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
