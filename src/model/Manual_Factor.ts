import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Customer} from "../entity/Customer";
import {Fish} from "../entity/Fish";
import {Fish_Specie} from "../entity/Fish_Specie";
import {Manual_Factor} from "../entity/Manual_Factor";
import {Factor} from "../entity/Factor";

let manualInfo = {
    create : async (value,fishpond_id,factor_id,customer_id) => {
        try {
            let manual_factor = new Manual_Factor()
            manual_factor.value = value
            manual_factor.fish_pond = await getConnection().getRepository(Fish_Pond).findOne({id:fishpond_id})
            manual_factor.factor = await getConnection().getRepository(Factor).findOne({id:factor_id})
            manual_factor.created_by = customer_id
            manual_factor.updated_by = customer_id
            let date = new Date()
            manual_factor.created_date = date
            manual_factor.updated_date = date
            await getConnection().getRepository(Manual_Factor).save(manual_factor)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    lists_manual : async (customer_id,fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["manual_factor.id","manual_factor.value","manual_factor.created_date","factor.facterType","factor.unit"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.manual_factor", "manual_factor")
                .innerJoin("manual_factor.factor", "factor")
                .orderBy('manual_factor.created_date' ,'DESC')
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id ", {customer_id:customer_id,fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    lists_manual_by_factor : async (customer_id,fishpond_id,factor_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["manual_factor.id","manual_factor.value","manual_factor.created_date","factor.unit"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.manual_factor", "manual_factor")
                .innerJoin("manual_factor.factor", "factor")
                .orderBy('manual_factor.created_date' ,'DESC')
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id and factor.id = :factor_id", {customer_id:customer_id,fishpond_id:fishpond_id,factor_id:factor_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,description,status,specie_id,fish_id) => {
        try {
            let fish = await getConnection().getRepository(Fish).findOne({id: fish_id})
            fish.name = name
            fish.description = description
            fish.status = status
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
                .select(["fishpond.id","fish.id","fish.name","fish.description","fish.status"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .where("customer.id = :customer_id and fish.id = :fish_id" , {customer_id:customer_id,fish_id:fish_id})
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
                .select(["fish.id","fish.name"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.fish", "fish")
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id ", {customer_id:customer_id,fishpond_id:fishpond_id})
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

export default manualInfo