// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Fish_Pond} from "./Fish_Pond";
// @Entity()
// export class Pond_Image {
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
//     @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.pond_image, { onDelete: 'CASCADE' })
//     fish_pond:Fish_Pond
// }