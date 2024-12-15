import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/users.entity';

export interface ISession {
  iat: number;
  exp: number;
  ip: string;
  deviceName: string;
  userId: string;
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('numeric')
  public iat: number;

  @Column('numeric')
  public exp: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  deviceName: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;
}
