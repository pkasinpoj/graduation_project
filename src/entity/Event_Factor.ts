import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,PrimaryColumn,
    Index, ManyToOne
} from "typeorm";
import {Factor} from "./Factor";
import {Fish} from "./Fish";
@Entity()
export class Event_Factor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value_alert: number;

    @Column()
    massage: string;

    @Column()
    timestamp: Date;

    @ManyToOne(type => Factor,factor => factor.event_factor, { onDelete: 'CASCADE' })
    factor:Factor

    @ManyToOne(type => Fish,fish => fish.event_factor, { onDelete: 'CASCADE' })
    fish:Fish

}