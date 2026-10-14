// typeorm 怎么定义 entity 
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm'
import { Conversation } from './conversation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  name: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at'})
  createdAt: Date

  @OneToMany(() => Conversation, (conversation) => conversation.user )
  conversations: Conversation[]
}