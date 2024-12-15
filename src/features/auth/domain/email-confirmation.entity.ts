import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/users.entity';

export interface IEmailConfirmation {
  exp: number;
  isConfirmed: boolean;
  userId: string;
}

@Entity('email_confirmation')
export class EmailConfirmation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('numeric')
  public exp: number;

  @Column()
  isConfirmed: boolean;

  @OneToOne(() => User, (user) => user.email_confirmation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;
}
