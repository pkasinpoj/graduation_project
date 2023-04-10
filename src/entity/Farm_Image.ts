// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Farm} from "./Farm";
// @Entity()
// export class Farm_Image {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column("text")
//     imageUrl: string;
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
//     @ManyToOne(type => Farm,farm => farm.farm_image, { onDelete: 'CASCADE' })
//     farm:Farm
//
// }