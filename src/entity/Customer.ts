import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Account} from "./Account";
import {Farm} from "./Farm";
@Entity()
export class Customer {

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
    created_by: number;

    @Column()
    updated_by: number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    // @OneToMany(type => Token_Customer, tokencustomer => tokencustomer.customer, { onDelete: 'CASCADE' })
    // tokencustomer:Token_Customer[]

    @OneToMany(type => Account,account => account.customer, { onDelete: 'CASCADE' })
    account:Account[]

    @OneToMany(type => Farm,farm => farm.customer, { onDelete: 'CASCADE' })
    farm:Farm[]


}