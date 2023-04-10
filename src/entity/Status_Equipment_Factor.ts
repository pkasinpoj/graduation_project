// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Equipment_Factor} from "./Equipment_Factor";
// @Entity()
// export class Status_Equipment_Factor {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column()
//     status: string
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
//
//     @OneToMany(type => Equipment_Factor,equipment_factor => equipment_factor.status_equipment_factor, { onDelete: 'CASCADE' })
//     equipment_factor:Equipment_Factor[]
//
// }