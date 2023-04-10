import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Customer} from "../entity/Customer";
import {Pond_Dim} from "../entity/Pond_Dim";

let pondInfo = {
    create : async (name,description,farm_id,employee_id,date) => {
        try {
            let fishpond = new Fish_Pond()
            fishpond.name = name
            fishpond.description = description
            fishpond.status = true
            fishpond.created_by = employee_id
            fishpond.updated_by = employee_id
            fishpond.created_date = date
            fishpond.updated_date = date
            fishpond.farm = await getConnection().getRepository(Farm).findOne({id:farm_id})
            await getConnection().getRepository(Fish_Pond).save(fishpond)
            let pond_dim = new Pond_Dim()
            pond_dim.id = fishpond.id
            pond_dim.name = name
            await getConnection().getRepository(Pond_Dim).save(pond_dim)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,description,fishpond_id,employee_id,date) => {
        try {
            let fishpond = await getConnection().getRepository(Fish_Pond).findOne({id: fishpond_id})
            fishpond.name = name
            fishpond.description = description
            fishpond.updated_by = employee_id
            fishpond.updated_date = date
            await getConnection().getRepository(Fish_Pond).save(fishpond)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (customer_id,fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fishpond.name","fishpond.description"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id" , {customer_id:customer_id,fishpond_id:fishpond_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_by_admin : async (fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fishpond.name","fishpond.description"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .where("fishpond.id = :fishpond_id" , {fishpond_id:fishpond_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async (customer_id,farm_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fishpond.name","COUNT(fish.id) as fish_count"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .leftJoin("fishpond.fish", "fish")
                .groupBy("fishpond.id")
                .where("customer.id = :customer_id and farm.id = :farm_id and fishpond.status = true", {customer_id:customer_id,farm_id:farm_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall_by_admin : async (farm_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fishpond.id","fishpond.name","COUNT(fish.id) as fish_count"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .leftJoin("fishpond.fish", "fish")
                .groupBy("fishpond.id")
                .where("farm.id = :farm_id ", {farm_id:farm_id})
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

export default pondInfo