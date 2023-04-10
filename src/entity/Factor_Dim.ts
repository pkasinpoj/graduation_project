import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,ManyToOne,
    OneToMany,
    Index,PrimaryColumn
} from "typeorm";
import {Fact_Fish_Pond} from "./Fact_Fish_Pond";
@Entity()
export class Factor_Dim {

    @Index({ unique: true })
    @PrimaryColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    facterType:string

    @Column()
    unit:string

    @OneToMany(type => Fact_Fish_Pond,fact_fish_pond => fact_fish_pond.factor_dim, { onDelete: 'CASCADE' })
    fact_fish_pond:Fact_Fish_Pond[]
}