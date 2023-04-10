import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Account_Menu} from "./Account_Menu";
import {Account} from "./Account";
@Entity()
export class Account_Type {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    typeName :string

    @Column("text")
    description:string

    @Column()
    status: boolean;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date : Date;

    @Column()
    updated_date : Date;

    @OneToMany(type => Account_Menu,account_menu => account_menu.account_type, { onDelete: 'CASCADE' })
    account_menu:Account_Menu[]

    @OneToMany(type => Account,account => account.account_type, { onDelete: 'CASCADE' })
    account:Account[]


}