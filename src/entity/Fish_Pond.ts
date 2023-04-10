import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne, OneToMany
} from "typeorm";
import {Farm} from "./Farm";
import {Accessory_Pond_List} from "./Accessory_Pond_List";
import {Fish} from "./Fish";
import {Equipments} from "./Equipments";
import {Booking} from "./Booking";
// import {Pond_Image} from "./Pond_Image";
import {Manual_Factor} from "./Manual_Factor";

@Entity()
export class Fish_Pond {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name : string;

    @Column("text")
    description : string;

    @Column()
    status : boolean;

    @Column()
    created_date: Date;

    @Column()
    updated_date: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;


    @OneToMany(type => Accessory_Pond_List,accessory_pond_list => accessory_pond_list.fish_pond, { onDelete: 'CASCADE' })
    accessory_pond_list:Accessory_Pond_List[]

    @OneToMany(type => Fish,fish => fish.fish_pond, { onDelete: 'CASCADE' })
    fish:Fish[]

    @OneToMany(type => Booking,booking => booking.fish_pond, { onDelete: 'CASCADE' })
    booking:Booking[]

    @OneToMany(type => Equipments,equipments => equipments.fish_pond, { onDelete: 'CASCADE' })
    equipments:Equipments[]

    // @OneToMany(type => Pond_Image, pond_image => pond_image.fish_pond, { onDelete: 'CASCADE' })
    // pond_image:Pond_Image[]

    @OneToMany(type => Manual_Factor, manual_factor => manual_factor.fish_pond, { onDelete: 'CASCADE' })
    manual_factor:Manual_Factor[]

    @ManyToOne(type => Farm,farm => farm.fish_pond, { onDelete: 'CASCADE' })
    farm:Farm

    // @ManyToOne(type => Standard_Factor,standard_factor => standard_factor.fish_pond, { onDelete: 'CASCADE' })
    // standard_factor:Standard_Factor
}