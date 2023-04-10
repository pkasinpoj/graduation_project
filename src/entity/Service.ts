import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Service_List} from "./Service_List";
import {Service_Type} from "./Service_Type";
@Entity()
export class Service {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    name :string

    @Column("text")
    description:string

    @Column()
    status: boolean;

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @OneToMany(type => Service_List,service_list => service_list.service, { onDelete: 'CASCADE' })
    service_list:Service_List[]

    @ManyToOne(type => Service_Type,service_type => service_type.service, { onDelete: 'CASCADE' })
    service_type:Service_Type

}