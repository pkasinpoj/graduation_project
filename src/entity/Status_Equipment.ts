import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Equipments} from "./Equipments";
@Entity()
export class Status_Equipment {

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

    @OneToMany(type => Equipments,equipments => equipments.status_equipment, { onDelete: 'CASCADE' })
    equipments:Equipments[]

}