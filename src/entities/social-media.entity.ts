import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class SocialMedia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })   
    name: string;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => User, user => user.socialMedia, { nullable: false })
    user: User;
}