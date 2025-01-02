import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @ManyToOne(() => Blog, (b) => b.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column({ nullable: false })
  blogId: string;
}
