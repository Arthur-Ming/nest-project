import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './posts.entity';
import { User } from '../../../users/domain/users.entity';
import { LikesStatusEnum } from '../../../../common/enum/likes-status.enum';

export interface IPostsLikes {
  status: LikesStatusEnum;
  authorId: string;
  postId: string;
}

@Entity('post_likes')
export class PostsLikes {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public status: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @ManyToOne(() => Post, (p) => p.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ nullable: false })
  postId: string;

  @ManyToOne(() => User, (u) => u.posts_likes, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  authorId: string;
}
