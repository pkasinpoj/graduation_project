import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne,PrimaryColumn
} from "typeorm";
import {Factor} from "./Factor";
import {Equipments} from "./Equipments";
@Entity()
export class Port {

    @Index({ unique: true })
    @PrimaryColumn()
    id: string;
    @Column()
    status : boolean;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @ManyToOne(type => Factor,factor => factor.port, { onDelete: 'CASCADE' })
    factor:Factor

    @ManyToOne(type => Equipments,equipments => equipments.port, { onDelete: 'CASCADE' })
    equipments:Equipments

}