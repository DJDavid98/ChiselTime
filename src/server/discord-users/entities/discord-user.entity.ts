import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { PatreonUser } from '../../patreon-users/entities/patreon-user.entity';
import { MessageTemplate } from '../../message-templates/entities/message-template.entity';

@Entity('discord_users')
export class DiscordUser {
  /**
   * Represented as string in JS code to avoid losing precision
   */
  @PrimaryColumn('bigint')
  id: string;

  @ManyToOne('User', (user: User) => user.discordUsers)
  user: Promise<User>;

  @OneToOne(
    'PatreonUser',
    (patreonUser: PatreonUser) => patreonUser.discordUser,
    { eager: true },
  )
  patreonUser?: PatreonUser;

  @Column('character varying', { length: 32 })
  name: string;

  @Column('char', { length: 4 })
  discriminator: string;

  @Column('character varying', { length: 64, nullable: true })
  avatar: string | null;

  @Column('character varying', { nullable: true, default: null, length: 128 })
  accessToken: string | null;

  @Column('character varying', { nullable: true, default: null, length: 128 })
  refreshToken: string | null;

  @Column('character varying', { nullable: true, default: null, length: 128 })
  scopes: string | null;

  @Column('timestamptz', { nullable: true, default: null })
  tokenExpires: Date | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  @OneToMany(
    'MessageTemplate',
    (messageTemplate: MessageTemplate) => messageTemplate.author,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  messageTemplates: MessageTemplate[];
}
