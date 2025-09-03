import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('refresh_tokens')
export class RefreshToken { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  token: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  expiresAt: Date;
}

