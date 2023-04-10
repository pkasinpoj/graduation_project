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
import {Accessory} from "./Accessory";
import {Booking} from "./Booking";

@Entity()
export class Accessory_Requisition_List {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: boolean;

    @Column("text")
    description:string

    @Column()
    lend_date: Date;

    @Column()
    return_date: Date;

    @Column()
    borrowed_amount: number;

    @Column()
    remaining_amount: number

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @Column()
    created_date: Date;

    @Column()
    update_date: Date;

    // @ManyToOne(type => Requisition,requisition => requisition.accessory_requisition_list, { onDelete: 'CASCADE' })
    // requisition:Requisition
    @ManyToOne(type => Booking,booking => booking.accessory_requisition_list, { onDelete: 'CASCADE' })
    booking:Booking

    @ManyToOne(type => Accessory,accessory => accessory.accessory_requisition_list, { onDelete: 'CASCADE' })
    accessory:Accessory

}