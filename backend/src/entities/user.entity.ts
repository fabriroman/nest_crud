import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocialMedia } from './social-media.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  email: string;

  @OneToMany(() => SocialMedia, (socialMedia) => socialMedia.user)
  socialMedia: SocialMedia[];
}
