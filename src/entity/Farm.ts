import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany, ManyToOne, Index
} from "typeorm";
import {Customer} from "./Customer";
import {Fish_Pond} from "./Fish_Pond";
// import {Farm_Image} from "./Farm_Image";

@Entity()
export class Farm {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name : string;

    @Column("text")
    address : string;

    @Column("text")
    description : string;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @ManyToOne(type => Customer,customer => customer.farm, { onDelete: 'CASCADE' })
    customer:Customer

    @OneToMany(type => Fish_Pond, fish_pond => fish_pond.farm, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond[]

    // @OneToMany(type => Farm_Image, farm_image => farm_image.farm, { onDelete: 'CASCADE' })
    // farm_image:Farm_Image[]

    @Column()
    status : boolean;

}