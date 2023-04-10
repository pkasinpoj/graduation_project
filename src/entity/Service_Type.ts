import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Service} from "./Service";
@Entity()
export class Service_Type {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    typeName :string

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

    @OneToMany(type => Service,service => service.service_type, { onDelete: 'CASCADE' })
    service:Service[]

}