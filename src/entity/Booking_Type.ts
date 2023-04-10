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
import {Booking} from "./Booking";
@Entity()
export class Booking_Type {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type_name : string;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @OneToMany(type => Booking,booking => booking.booking_type, { onDelete: 'CASCADE' })
    booking:Booking[]


}