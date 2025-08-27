import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index, ManyToMany } from 'typeorm';
import { SocialMedia } from './social-media.entity';
import { Role } from './role.entity';

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
  @Index({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => SocialMedia, (socialMedia) => socialMedia.user)
  socialMedia: SocialMedia[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
