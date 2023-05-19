import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('states')
export class State {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  state: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;
}
