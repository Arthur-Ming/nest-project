import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';
import { PostsLikes } from './posts-likes.entity';
import { Comment } from '../../comments/domain/pg/comments.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public shortDescription: string;

  @Column()
  public content: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @ManyToOne(() => Blog, (b) => b.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column({ nullable: false })
  blogId: string;

  @OneToMany(() => PostsLikes, (pl) => pl.post)
  likes: PostsLikes[];

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];
}
