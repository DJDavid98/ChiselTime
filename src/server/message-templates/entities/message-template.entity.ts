import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { DiscordUser } from '../../discord-users/entities/discord-user.entity';

@Entity('message_templates')
export class MessageTemplate {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  /**
   * ID of the Discord server where the message was posted
   *
   * Represented as string in JS code to avoid losing precision
   */
  @Column('bigint', { nullable: false })
  serverId: string;

  /**
   * ID of the Discord channel where the message was posted
   *
   * Represented as string in JS code to avoid losing precision
   */
  @Column('bigint', { nullable: false })
  channelId: string;

  /**
   * ID of the corresponding message on Discord
   *
   * Represented as string in JS code to avoid losing precision
   */
  @Column('bigint', { nullable: false })
  messageId: string;

  @Column('text', { nullable: false })
  body: string;

  @ManyToOne(
    'DiscordUser',
    (discordUser: DiscordUser) => discordUser.messageTemplates,
    { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  author: DiscordUser;

  /**
   * ISO 8601 Duration indicating how often the message should be updated
   *
   * If the `lastEditedAt` date + this duration is in the past, the message
   * needs to be updated
   */
  @Column('character varying', { length: 16 })
  updateFrequency: string;

  @Column('timestamptz', { default: null, nullable: true })
  lastEditedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  /**
   * Retrieves the URL for the message, which displays as a clickable link in the client
   */
  getMessageUrl(): string {
    return `https://discord.com/channels/${[
      this.serverId,
      this.channelId,
      this.messageId,
    ].join('/')}`;
  }
}
