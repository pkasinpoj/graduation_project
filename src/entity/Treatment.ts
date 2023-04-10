// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Treatment_List} from "./Treatment_List";
// import {Account} from "./Account";
// @Entity()
// export class Treatment {
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
//     status: string;
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
//     // @Column()
//     // work_date: Date;
//
//     @OneToMany(type => Treatment_List,treatment_list => treatment_list.treatment, { onDelete: 'CASCADE' })
//     treatment_list:Treatment_List[]
//
//     @ManyToOne(type => Account,account => account.treatment, { onDelete: 'CASCADE' })
//     account:Account
//
//
//
// }