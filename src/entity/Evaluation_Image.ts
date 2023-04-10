// import {
// //     Entity,
// //     PrimaryGeneratedColumn,
// //     Column,
// //     CreateDateColumn,
// //     UpdateDateColumn,
// //     OneToMany,
// //     Index, ManyToOne
// // } from "typeorm";
// // import {Booking} from "./Booking";
// // @Entity()
// // export class Evaluation_Image {
// //
// //     @PrimaryGeneratedColumn()
// //     id: number;
// //
// //     @Column("text")
// //     imageUrl: string;
// //
// //     @Column()
// //     created_date: Date;
// //
// //     @Column()
// //     updated_date: Date;
// //
// //     @Column()
// //     created_by: number;
// //
// //     @Column()
// //     updated_by: number;
// //
// //     @ManyToOne(type => Booking,booking => booking.evaluation_image, { onDelete: 'CASCADE' })
// //     booking:Booking
// // }