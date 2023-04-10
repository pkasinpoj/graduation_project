import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Accessory} from "./Accessory";
@Entity()
export class Accessory_Type {

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
    created_date : Date;

    @Column()
    updated_date : Date;

    @OneToMany(type => Accessory, accessory => accessory.accessory_type, { onDelete: 'CASCADE' })
    accessory:Accessory[]
}