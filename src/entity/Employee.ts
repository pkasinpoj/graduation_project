import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,ManyToOne
} from "typeorm";
import {Service_Employee_List} from "./Service_Employee_List";
import {Account} from "./Account";
import {Position} from "./Position";
import {Token_Customer} from "./Token_Customer";
import {Token_Employee} from "./Token_Employee";
@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string

    @Column()
    surname:string

    @Column()
    tel: string;

    @Index({ unique: true })
    @Column()
    email:string

    @Index({ unique: true })
    @Column()
    username:string

    @Column()
    password:string

    @Column()
    status: boolean;

    @OneToMany(type => Service_Employee_List,service_employee_list => service_employee_list.employee, { onDelete: 'CASCADE' })
    service_employee_list:Service_Employee_List[]

    @OneToMany(type => Account,account => account.employee, { onDelete: 'CASCADE' })
    account:Account[]

    // @OneToMany(type => Token_Employee, token_employee => token_employee.employee, { onDelete: 'CASCADE' })
    // token_employee:Token_Employee[]


    @ManyToOne(type => Position,position => position.employee, { onDelete: 'CASCADE' })
    position:Position

}