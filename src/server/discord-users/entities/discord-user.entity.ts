import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import { MessageTemplate } from '../../message-templates/entities/message-template.entity';
import { UserSetting } from '../../user-settings/entities/user-setting.entity';

@Entity('discord_users')
export class DiscordUser {
  /**
   * Represented as string in JS code to avoid losing precision
   */
  @PrimaryColumn('bigint')
  id: string;

  @ManyToOne('User', (user: User) => user.discordUsers)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User | undefined>;

  @Column('character varying', { length: 32 })
  name: string;

  @Column('character varying', {
    name: 'display_name',
    length: 32,
    nullable: true,
  })
  displayName: string | null;

  /**
   * Soon this field will be retired in favor of display names
   * @deprecated
   */
  @Column('smallint')
  discriminator: number;

  @Column('character varying', { length: 64, nullable: true })
  avatar: string | null;

  @Column('character varying', {
    name: 'access_token',
    nullable: true,
    default: null,
    length: 128,
  })
  accessToken: string | null;

  @Column('character varying', {
    name: 'refresh_token',
    nullable: true,
    default: null,
    length: 128,
  })
  refreshToken: string | null;

  @Column('character varying', { nullable: true, default: null, length: 128 })
  scopes: string | null;

  @Column('timestamptz', {
    name: 'token_expires',
    nullable: true,
    default: null,
  })
  tokenExpires: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  @OneToMany(
    'MessageTemplate',
    (messageTemplate: MessageTemplate) => messageTemplate.author,
  )
  messageTemplates: Promise<MessageTemplate[]>;

  @OneToMany('UserSetting', (userSetting: UserSetting) => userSetting.user, {
    eager: true,
  })
  settings: UserSetting[];
}
