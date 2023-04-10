import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Accessory_Type} from "./Accessory_Type";
import {Accessory_Pond_List} from "./Accessory_Pond_List";
import {Accessory_Requisition_List} from "./Accessory_Requisition_List";
@Entity()
export class Accessory {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    name:string

    @Column("text")
    description:string

    @Column()
    status: boolean;

    @Column()
    balance: number;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date : Date;

    @Column()
    updated_date : Date;

    @ManyToOne(type => Accessory_Type,accessory_type => accessory_type.accessory, { onDelete: 'CASCADE' })
    accessory_type:Accessory_Type

    @OneToMany(type => Accessory_Pond_List,accessory_pond_list => accessory_pond_list.accessory, { onDelete: 'CASCADE' })
    accessory_pond_list:Accessory_Pond_List[]

    @OneToMany(type => Accessory_Requisition_List,accessory_requisition_list => accessory_requisition_list.accessory, { onDelete: 'CASCADE' })
    accessory_requisition_list:Accessory_Requisition_List[]

}