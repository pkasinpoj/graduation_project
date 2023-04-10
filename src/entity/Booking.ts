import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Service_List} from "./Service_List";
import {Service_Employee_List} from "./Service_Employee_List";
// import {Evaluation_Image} from "./Evaluation_Image";
import {Fish_Pond} from "./Fish_Pond";
import {Account} from "./Account";
import {Status_Booking} from "./Status_Booking";
// import {Requisition} from "./Requisition";
import {Accessory_Requisition_List} from "./Accessory_Requisition_List";
import {Booking_Type} from "./Booking_Type";
@Entity()
export class Booking {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description:string

    @Column()
    work_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @OneToMany(type => Service_List,service_list => service_list.booking, { onDelete: 'CASCADE' })
    service_list:Service_List[]

    @OneToMany(type => Service_Employee_List,service_employee_list => service_employee_list.booking, { onDelete: 'CASCADE' })
    service_employee_list:Service_Employee_List[]

    // @OneToMany(type => Evaluation_Image,evaluation_image => evaluation_image.booking, { onDelete: 'CASCADE' })
    // evaluation_image:Evaluation_Image[]

    @OneToMany(type => Accessory_Requisition_List,accessory_requisition_list => accessory_requisition_list.booking, { onDelete: 'CASCADE' })
    accessory_requisition_list:Accessory_Requisition_List[]

    @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.booking, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond

    @ManyToOne(type => Account,account => account.booking, { onDelete: 'CASCADE' })
    account:Account

    @ManyToOne(type => Status_Booking,status_booking => status_booking.booking, { onDelete: 'CASCADE' })
    status_booking:Status_Booking

    @ManyToOne(type => Booking_Type,booking_type => booking_type.booking, { onDelete: 'CASCADE' })
    booking_type:Booking_Type

}