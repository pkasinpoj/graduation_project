import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Customer} from "../entity/Customer";
import {Fish} from "../entity/Fish";
import {Fish_Specie} from "../entity/Fish_Specie";
import {Port} from "../entity/Port";
import {Equipments} from "../entity/Equipments";
import {Factor} from "../entity/Factor";

let portInfo = {
    create : async (port_id,equipment_id,factor_id,employee_id,date) => {
        try {
            let port = new Port()
            port.id = port_id
            port.equipments = await getConnection().getRepository(Equipments).findOne({id:equipment_id})
            port.factor = await getConnection().getRepository(Factor).findOne({id:factor_id})
            port.status = true
            port.created_by = employee_id
            port.created_date = date
            await getConnection().getRepository(Port).save(port)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,description,specie_id,fish_id,employee_id,date) => {
        try {
            let fish = await getConnection().getRepository(Fish).findOne({id: fish_id})
            fish.name = name
            fish.description = description
            fish.updated_by = employee_id
            fish.updated_date = date
            fish.fish_specie = await getConnection().getRepository(Fish_Specie).findOne({id:specie_id})
            await getConnection().getRepository(Fish).save(fish)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (customer_id,fish_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fish.id","fish.name","fish.description","fish.status","fish_specie.fishspecie"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .leftJoin("fish.fish_specie", "fish_specie")
                .where("customer.id = :customer_id and fish.id = :fish_id" , {customer_id:customer_id,fish_id:fish_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_by_admin : async (fish_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fish.id","fish.name","fish.description","fish.status","fish_specie.fishspecie"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .leftJoin("fish.fish_specie", "fish_specie")
                .where("fish.id = :fish_id" , {fish_id:fish_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async (customer_id,fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fish.id","fish_specie.fishspecie"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .innerJoin("fish.fish_specie", "fish_specie")
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id ", {customer_id:customer_id,fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall_by_admin : async (fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fish.id","fish_specie.fishspecie"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .innerJoin("fish.fish_specie", "fish_specie")
                .where("fishpond.id = :fishpond_id ", {fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    delete : async (farm_id) => {
        try {
            let farm = await getConnection().getRepository(Farm).findOne({id: farm_id})
            farm.status = false
            await getConnection().getRepository(Farm).save(farm)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default portInfo