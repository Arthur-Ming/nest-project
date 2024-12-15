import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/users.entity';

export interface ICodeRecovery {
  userId: string;
}

@Entity()
export class CodeRecovery {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @OneToOne(() => User, (user) => user.email_confirmation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  public userId: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;
}
