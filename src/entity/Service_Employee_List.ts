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
import {Employee} from "./Employee";
import {Booking} from "./Booking";

@Entity()
export class Service_Employee_List {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Booking,booking => booking.service_employee_list, { onDelete: 'CASCADE' })
    booking:Booking

    @ManyToOne(type => Employee,employee => employee.service_employee_list, { onDelete: 'CASCADE' })
    employee:Employee

}