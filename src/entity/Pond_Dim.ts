import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne, OneToMany, PrimaryColumn, Index
} from "typeorm";
import {Fact_Fish_Pond} from "./Fact_Fish_Pond";

@Entity()
export class Pond_Dim {

    @Index({ unique: true })
    @PrimaryColumn()
    id: number;

    @Column({ nullable: true })
    name : string;

    @OneToMany(type => Fact_Fish_Pond, fact_fish_pond => fact_fish_pond.pond_dim, { onDelete: 'CASCADE' })
    fact_fish_pond:Fact_Fish_Pond[]
}