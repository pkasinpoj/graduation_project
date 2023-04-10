import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    PrimaryColumn,
    Index, ManyToOne
} from "typeorm";
import {Fish_Pond} from "./Fish_Pond";
// import {Maintenance_Service_List} from "./Maintenance_Service_List";
import {Port} from "./Port";
import {Status_Equipment} from "./Status_Equipment";
@Entity()
export class Equipments {

    @Index({ unique: true })
    @PrimaryColumn()
    id: string;

    @Index({ unique: true })
    @Column()
    code: number

    @Column("text")
    description:string

    @Column()
    minute_feed :number

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @OneToMany(type => Port, port => port.equipments, { onDelete: 'CASCADE' })
    port:Port[]

    // @OneToMany(type => Maintenance_Service_List,maintenance_service_list => maintenance_service_list.equipments, { onDelete: 'CASCADE' })
    // maintenance_service_list:Maintenance_Service_List[]

    @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.equipments, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond

    @ManyToOne(type => Status_Equipment,status_equipment => status_equipment.equipments, { onDelete: 'CASCADE' })
    status_equipment:Status_Equipment
}