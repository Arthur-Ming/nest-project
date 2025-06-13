import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../users/domain/users.entity';
import { Comment } from './comments.entity';

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @Column()
  public status: string;

  @ManyToOne(() => Comment, (c) => c.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ nullable: false })
  commentId: string;

  @ManyToOne(() => User, (u) => u.comment_likes, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  authorId: string;
}
