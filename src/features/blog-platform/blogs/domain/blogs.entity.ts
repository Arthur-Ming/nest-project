import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/domain/posts.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public websiteUrl: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: string;

  @Column()
  public isMembership: boolean;

  @OneToMany(() => Post, (p) => p.blog)
  posts: Post[];
}
