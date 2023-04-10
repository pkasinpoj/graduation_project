import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Booking} from "./Booking";
@Entity()
export class Status_Booking {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    status:string

    @Column("text")
    description:string

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @OneToMany(type => Booking,booking => booking.status_booking, { onDelete: 'CASCADE' })
    booking:Booking[]

}