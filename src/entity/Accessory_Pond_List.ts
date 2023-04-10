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
import {Fish_Pond} from "./Fish_Pond";
import {Accessory} from "./Accessory";

@Entity()
export class Accessory_Pond_List {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.accessory_pond_list, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond

    @ManyToOne(type => Accessory,accessory => accessory.accessory_pond_list, { onDelete: 'CASCADE' })
    accessory:Accessory

}