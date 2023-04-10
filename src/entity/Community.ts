import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
@Entity()
export class Community {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    communityName :string

    @Column("text")
    description:string

    @Column()
    status: string;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

}