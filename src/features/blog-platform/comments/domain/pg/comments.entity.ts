import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../../posts/domain/posts.entity';
import { User } from '../../../../users/domain/users.entity';
import { CommentLike } from './comment-likes.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public content: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @ManyToOne(() => Post, (p) => p.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ nullable: false })
  postId: string;

  @ManyToOne(() => User, (u) => u.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  authorId: string;

  @OneToMany(() => CommentLike, (cl) => cl.comment)
  likes: CommentLike[];
}
