// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Standard_Factor} from "./Standard_Factor";
// import {Factor} from "./Factor";
// @Entity()
// export class Standard_List {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column()
//     min: number
//
//     @Column()
//     max: number
//
//     @Column()
//     average: number
//
//     @ManyToOne(type => Standard_Factor,standard_factor => standard_factor.standard_list, { onDelete: 'CASCADE' })
//     standard_factor:Standard_Factor
//
//     @ManyToOne(type => Factor,factor => factor.standard_list, { onDelete: 'CASCADE' })
//     factor:Factor
//
// }