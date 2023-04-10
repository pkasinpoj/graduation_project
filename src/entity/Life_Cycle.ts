import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,PrimaryColumn,
    Index, ManyToOne
} from "typeorm";
import {Fish_Specie} from "./Fish_Specie";
import {Factor_Of_Life_Cycle} from "./Factor_Of_Life_Cycle";
@Entity()
export class Life_Cycle {

    @Index({ unique: true })
    @PrimaryColumn()
    id: number;

    @Column()
    st_age: number;

    @Column()
    end_age: number;

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

    @OneToMany(type => Factor_Of_Life_Cycle,factor_of_life_cycle => factor_of_life_cycle.life_cycle, { onDelete: 'CASCADE' })
    factor_of_life_cycle:Factor_Of_Life_Cycle[]

    @ManyToOne(type => Fish_Specie,fish_specie => fish_specie.life_cycle, { onDelete: 'CASCADE' })
    fish_specie:Fish_Specie


}