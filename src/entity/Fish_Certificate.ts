// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Fish} from "./Fish";
// @Entity()
// export class Fish_Certificate {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Index({ unique: true })
//     @Column()
//     certificate:string
//
//     @Index({ unique: true })
//     @Column()
//     number_certificate:number
//
//     @Column("text")
//     description:string
//
//     @Column()
//     status: string;
//
//     @Column()
//     created_date: Date;
//
//     @Column()
//     updated_date: Date;
//
//     @Column()
//     created_by: number;
//
//     @Column()
//     updated_by: number;
//
//     @OneToMany(type => Fish,fish => fish.fish_certificate, { onDelete: 'CASCADE' })
//     fish:Fish[]
//
// }