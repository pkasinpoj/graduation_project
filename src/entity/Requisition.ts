// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Accessory_Requisition_List} from "./Accessory_Requisition_List";
// import {Account} from "./Account";
// import {Booking} from "./Booking";
// @Entity()
// export class Requisition {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Index({ unique: true })
//     @Column()
//     name:string
//
//     @Column("text")
//     description:string
//
//     @Column()
//     status: boolean;
//
//     @Column()
//     lend_date: Date;
//
//     @Column()
//     return_date: Date;
//
//     @Column()
//     created_by: number;
//
//     @Column()
//     updated_by: number;
//
//     @Column()
//     created_date: Date;
//
//     @Column()
//     update_date: Date;
//
//     @OneToMany(type => Accessory_Requisition_List,accessory_requisition_list => accessory_requisition_list.requisition, { onDelete: 'CASCADE' })
//     accessory_requisition_list:Accessory_Requisition_List[]
//
//     @ManyToOne(type => Booking,booking => booking.requisition, { onDelete: 'CASCADE' })
//     booking:Booking
// }