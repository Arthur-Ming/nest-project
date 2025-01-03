import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmation } from '../../auth/domain/email-confirmation.entity';
import { Session } from '../../auth/domain/session.entity';
import { CodeRecovery } from '../../auth/domain/code-recovery.entity';

export interface IUser {
  email: string;
  login: string;
  password: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public login: string;

  @Column()
  public password: string;

  @Column()
  public email: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @OneToOne(() => EmailConfirmation, (ec) => ec.user)
  email_confirmation: EmailConfirmation;

  @OneToOne(() => CodeRecovery, (cr) => cr.user)
  code_recovery: CodeRecovery;

  @OneToMany(() => Session, (s) => s.user)
  sessions: Session[];
}
