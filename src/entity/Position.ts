import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import {Employee} from "./Employee";
@Entity()
export class Position {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    name :string

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

    @OneToMany(type => Employee,employee => employee.position, { onDelete: 'CASCADE' })
    employee:Employee[]
}