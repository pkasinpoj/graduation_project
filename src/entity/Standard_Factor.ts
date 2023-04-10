// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,ManyToOne,
//     Index
// } from "typeorm";
// import {Factor} from "./Factor";
// @Entity()
// export class Standard_Factor {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Index({ unique: true })
//     @Column()
//     standard_name :string
//
//     @Column("text")
//     description:string
//
//     @Column()
//     status: boolean;
//
//     @Column({ type: 'float' })
//     max_danger_value: number;
//
//     @Column({ type: 'float' })
//     min_danger_value: number;
//
//     @Column({ type: 'float' })
//     min: number;
//
//     @Column({ type: 'float' })
//     max: number;
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
//     @OneToMany(type => Factor,factor => factor.standard_factor, { onDelete: 'CASCADE' })
//     factor:Factor[]
//
//
// }