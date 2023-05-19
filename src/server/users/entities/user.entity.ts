import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER_NAME_MAX_LENGTH } from '../dto/create-user.dto';

@Entity()
export class User {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('character varying', { length: USER_NAME_MAX_LENGTH })
  name: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;
}
