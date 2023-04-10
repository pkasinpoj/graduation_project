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
import {Customer} from "./Customer";
import {Account_Type} from "./Account_Type";
// import {Maintenance_Service_Agreement} from "./Maintenance_Service_Agreement";
// import {Treatment} from "./Treatment";
// import {Requisition} from "./Requisition";
import {Employee} from "./Employee";
import {Booking} from "./Booking";
import {Token_Customer} from "./Token_Customer";
import {Token_Employee} from "./Token_Employee";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status : boolean;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    // @OneToMany(type => Maintenance_Service_Agreement,maintenance_service_agreement => maintenance_service_agreement.account, { onDelete: 'CASCADE' })
    // maintenance_service_agreement:Maintenance_Service_Agreement[]
    //
    // @OneToMany(type => Treatment,treatment => treatment.account, { onDelete: 'CASCADE' })
    // treatment:Treatment[]

    @OneToMany(type => Booking,booking => booking.account, { onDelete: 'CASCADE' })
    booking:Booking[]

    @ManyToOne(type => Account_Type,account_type => account_type.account, { onDelete: 'CASCADE' })
    account_type:Account_Type

    @ManyToOne(type => Customer,customer => customer.account, { onDelete: 'CASCADE' })
    customer:Customer

    @ManyToOne(type => Employee,employee => employee.account, { onDelete: 'CASCADE' })
    employee:Employee

    @OneToMany(type => Token_Customer, tokencustomer => tokencustomer.account, { onDelete: 'CASCADE' })
    tokencustomer:Token_Customer[]

    @OneToMany(type => Token_Employee, token_employee => token_employee.account, { onDelete: 'CASCADE' })
    token_employee:Token_Employee[]

}