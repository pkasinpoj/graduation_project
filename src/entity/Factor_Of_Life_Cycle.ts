import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Life_Cycle} from "./Life_Cycle";
import {Factor} from "./Factor";
@Entity()
export class Factor_Of_Life_Cycle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    value_min : number;

    @Column({ type: 'float' })
    value_max : number;

    @ManyToOne(type => Life_Cycle,life_cycle => life_cycle.factor_of_life_cycle, { onDelete: 'CASCADE' })
    life_cycle:Life_Cycle

    @ManyToOne(type => Factor,factor => factor.factor_of_life_cycle, { onDelete: 'CASCADE' })
    factor:Factor


}