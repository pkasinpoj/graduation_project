// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToOne,
//     JoinColumn,
//     OneToMany,ManyToOne
// } from "typeorm";
// import {Treatment} from "./Treatment";
// import {Fish} from "./Fish";
//
// @Entity()
// export class Treatment_List {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @ManyToOne(type => Treatment,treatment => treatment.treatment_list, { onDelete: 'CASCADE' })
//     treatment:Treatment
//
//     @ManyToOne(type => Fish,fish => fish.treatment_list, { onDelete: 'CASCADE' })
//     fish:Fish
//
// }