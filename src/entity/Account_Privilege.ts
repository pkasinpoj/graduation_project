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
@Entity()
export class Account_Privilege {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    menuPath :string

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

    @OneToMany(type => Account_Menu,account_menu => account_menu.account_privilege, { onDelete: 'CASCADE' })
    account_menu:Account_Menu[]

}