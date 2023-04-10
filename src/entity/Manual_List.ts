// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Factor} from "./Factor";
// import {Manual_Factor} from "./Manual_Factor";
// @Entity()
// export class Manual_List {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column()
//     value: number
//
//     @Column()
//     status : string
//
//     @ManyToOne(type => Factor,factor => factor.manual_list, { onDelete: 'CASCADE' })
//     factor:Factor
//
//     @ManyToOne(type => Manual_Factor,manual_factor => manual_factor.manual_list, { onDelete: 'CASCADE' })
//     manual_factor:Manual_Factor
//
// }