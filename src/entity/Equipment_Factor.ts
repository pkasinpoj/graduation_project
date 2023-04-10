// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Port} from "./Port";
// // import {Status_Equipment_Factor} from "./Status_Equipment_Factor";
// @Entity()
// export class Equipment_Factor {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column({ type: 'float' })
//     min: number
//
//     @Column({ type: 'float' })
//     max: number
//
//     @Column({ type: 'float' })
//     average: number
//
//     @Column()
//     status: string
//
//     @Column()
//     save_date: Date;
//
//     @ManyToOne(type => Port, list_factor => list_factor.equipment_factor, { onDelete: 'CASCADE' })
//     list_factor:Port
//
//     // @ManyToOne(type => Status_Equipment_Factor,status_equipment_factor => status_equipment_factor.equipment_factor, { onDelete: 'CASCADE' })
//     // status_equipment_factor:Status_Equipment_Factor
// }