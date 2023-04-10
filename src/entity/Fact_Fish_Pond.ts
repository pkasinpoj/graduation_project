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
import {Factor_Dim} from "./Factor_Dim";
import {Time_Dim} from "./Time_Dim";
import {Pond_Dim} from "./Pond_Dim";
@Entity()
export class Fact_Fish_Pond {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'float' })
    value_avg: number

    @ManyToOne(type => Factor_Dim,factor_dim => factor_dim.fact_fish_pond, { onDelete: 'CASCADE' })
    factor_dim:Factor_Dim

    @ManyToOne(type => Time_Dim,time_dim => time_dim.fact_fish_pond, { onDelete: 'CASCADE' })
    time_dim:Time_Dim

    @ManyToOne(type => Pond_Dim,pond_dim => pond_dim.fact_fish_pond, { onDelete: 'CASCADE' })
    pond_dim:Pond_Dim
}