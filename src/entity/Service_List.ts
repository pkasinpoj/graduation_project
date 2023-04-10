import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,ManyToOne
} from "typeorm";
import {Service} from "./Service";
import {Booking} from "./Booking";

@Entity()
export class Service_List {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Service,service => service.service_list, { onDelete: 'CASCADE' })
    service:Service

    @ManyToOne(type => Booking,booking => booking.service_list, { onDelete: 'CASCADE' })
    booking:Booking

}