import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Fish_Specie} from "./Fish_Specie";
import {Fish_Pond} from "./Fish_Pond";
import {Manual_Factor} from "./Manual_Factor";
import {Event_Factor} from "./Event_Factor";
// import {Fish_Certificate} from "./Fish_Certificate";
// import {Treatment_List} from "./Treatment_List";
@Entity()
export class Fish {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string

    @Column("text")
    description:string

    @Column()
    status: boolean;

    @Column()
    birth_day: Date;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;


    // @ManyToOne(type => Fish_Certificate,fish_certificate => fish_certificate.fish, { onDelete: 'CASCADE' })
    // fish_certificate:Fish_Certificate
    //
    // @OneToMany(type => Treatment_List,treatment_list => treatment_list.fish, { onDelete: 'CASCADE' })
    // treatment_list:Treatment_List[]

    @OneToMany(type => Event_Factor,event_factor => event_factor.fish, { onDelete: 'CASCADE' })
    event_factor:Event_Factor[]

    @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.fish, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond

    @ManyToOne(type => Fish_Specie,fish_specie => fish_specie.fish, { onDelete: 'CASCADE' })
    fish_specie:Fish_Specie

}