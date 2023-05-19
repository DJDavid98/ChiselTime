import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { DiscordUser } from '../../discord-users/entities/discord-user.entity';

@Entity('patreon_users')
export class PatreonUser {
  /**
   * Represented as string in JS code to avoid losing precision
   */
  @PrimaryColumn('character varying')
  id: string;

  @OneToOne('DiscordUser', (user: DiscordUser) => user.patreonUser)
  @JoinColumn()
  discordUser: Promise<DiscordUser>;

  @Column('character varying', { length: 64 })
  name: string;

  @Column('character varying', { length: 256, nullable: true })
  avatar: string | null;

  @Column('character varying', { nullable: true, default: null, length: 256 })
  accessToken: string | null;

  @Column('character varying', { nullable: true, default: null, length: 256 })
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
}
