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
import {Account} from "./Account";

@Entity()
export class Token_Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Account,account => account.tokencustomer, { onDelete: 'CASCADE' })
    account:Account

    @Column("text")
    Authorization:String;

    @Column()
    exprire:Date
}