import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,ManyToOne,
    OneToMany,
    Index
} from "typeorm";
// import {Standard_List} from "./Standard_List";
import {Port} from "./Port";
import {Manual_Factor} from "./Manual_Factor";
import {Factor_Of_Life_Cycle} from "./Factor_Of_Life_Cycle";
import {Event_Factor} from "./Event_Factor";
@Entity()
export class Factor {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    facterType:string

    @Column("text")
    description:string

    @Column()
    unit:string

    @Column()
    y_axis: string;

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

    @OneToMany(type => Port, port => port.factor, { onDelete: 'CASCADE' })
    port:Port[]

    @OneToMany(type => Manual_Factor,manual_factor => manual_factor.factor, { onDelete: 'CASCADE' })
    manual_factor:Manual_Factor[]

    @OneToMany(type => Factor_Of_Life_Cycle,factor_of_life_cycle => factor_of_life_cycle.factor, { onDelete: 'CASCADE' })
    factor_of_life_cycle:Factor_Of_Life_Cycle[]

    @OneToMany(type => Event_Factor,event_factor => event_factor.factor, { onDelete: 'CASCADE' })
    event_factor:Event_Factor[]
}