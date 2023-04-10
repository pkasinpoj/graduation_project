import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne, OneToMany
} from "typeorm";
import {Fact_Fish_Pond} from "./Fact_Fish_Pond";

@Entity()
export class Time_Dim {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date_data : Date;

    @OneToMany(type => Fact_Fish_Pond, fact_fish_pond => fact_fish_pond.time_dim, { onDelete: 'CASCADE' })
    fact_fish_pond:Fact_Fish_Pond[]
}