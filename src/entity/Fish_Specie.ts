import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index, ManyToOne
} from "typeorm";
import {Fish} from "./Fish";
import {Life_Cycle} from "./Life_Cycle";
@Entity()
export class Fish_Specie {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    fishspecie:string

    @Column("text")
    description:string

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

    @OneToMany(type => Fish,fish => fish.fish_specie, { onDelete: 'CASCADE' })
    fish:Fish[]

    @OneToMany(type => Life_Cycle,life_cycle => life_cycle.fish_specie, { onDelete: 'CASCADE' })
    life_cycle:Life_Cycle[]


}