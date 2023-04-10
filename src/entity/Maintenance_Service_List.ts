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
// import {Equipments} from "./Equipments";
// import {Maintenance_Service_Agreement} from "./Maintenance_Service_Agreement";
//
// @Entity()
// export class Maintenance_Service_List {
//
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @ManyToOne(type => Equipments,equipments => equipments.maintenance_service_list, { onDelete: 'CASCADE' })
//     equipments:Equipments
//
//     @ManyToOne(type => Maintenance_Service_Agreement,maintenance_service_agreement => maintenance_service_agreement.maintenance_service_list, { onDelete: 'CASCADE' })
//     maintenance_service_agreement:Maintenance_Service_Agreement
//
// }