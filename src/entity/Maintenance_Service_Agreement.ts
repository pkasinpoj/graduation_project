// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//     Index, ManyToOne
// } from "typeorm";
// import {Maintenance_Service_List} from "./Maintenance_Service_List";
// import {Account} from "./Account";
// @Entity()
// export class Maintenance_Service_Agreement {
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
//     fix_date: Date;
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
//     // @Column()
//     // work_date: Date;
//     @OneToMany(type => Maintenance_Service_List,maintenance_service_list => maintenance_service_list.maintenance_service_agreement, { onDelete: 'CASCADE' })
//     maintenance_service_list:Maintenance_Service_List[]
//
//     @ManyToOne(type => Account,account => account.maintenance_service_agreement, { onDelete: 'CASCADE' })
//     account:Account
//
// }