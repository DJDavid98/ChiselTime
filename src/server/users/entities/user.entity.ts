import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER_NAME_MAX_LENGTH } from '../dto/create-user.dto';
import type { DiscordUser } from '../../discord-users/entities/discord-user.entity';

@Entity('users')
export class User {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('character varying', { length: USER_NAME_MAX_LENGTH })
  name: string;

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

  @OneToMany('DiscordUser', (discordUser: DiscordUser) => discordUser.user, {
    eager: true,
  })
  discordUsers: DiscordUser[];

  getMaxTemplateCount(): number {
    // TODO Provide this based on support level
    return 1;
  }
}
