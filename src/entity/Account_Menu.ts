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
import {Account_Type} from "./Account_Type";
import {Account_Privilege} from "./Account_Privilege";


@Entity()
export class Account_Menu {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Account_Type,account_type => account_type.account_menu, { onDelete: 'CASCADE' })
    account_type:Account_Type

    @ManyToOne(type => Account_Privilege,account_privilege => account_privilege.account_menu, { onDelete: 'CASCADE' })
    account_privilege:Account_Privilege

}