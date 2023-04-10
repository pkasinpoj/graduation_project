import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
// import {Manual_List} from "./Manual_List";
import {Fish_Pond} from "./Fish_Pond";
import {Factor} from "./Factor";
@Entity()
export class Manual_Factor {

    // @PrimaryGeneratedColumn()
    // id: number;
    //
    // @Column()
    // name: string
    //
    // @Column("text")
    // description: string
    //
    // @Column()
    // status : string
    //
    // @OneToMany(type => Manual_List,manual_list => manual_list.manual_factor, { onDelete: 'CASCADE' })
    // manual_list:Manual_List[]
    //
    // @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.manual_factor, { onDelete: 'CASCADE' })
    // fish_pond:Fish_Pond

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: number

    @ManyToOne(type => Factor,factor => factor.manual_factor, { onDelete: 'CASCADE' })
    factor:Factor

    @ManyToOne(type => Fish_Pond,fish_pond => fish_pond.manual_factor, { onDelete: 'CASCADE' })
    fish_pond:Fish_Pond

    @Column()
    created_by : number;

    @Column()
    updated_by : number;

    @Column()
    created_date : Date;

    @Column()
    updated_date : Date;



    // @CreateDateColumn()
    // create_date: Date;


}