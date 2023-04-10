import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Customer} from "../entity/Customer";
import {Fish} from "../entity/Fish";
import {Fish_Specie} from "../entity/Fish_Specie";
import {Fact_Fish_Pond} from "../entity/Fact_Fish_Pond";

let fishInfo = {
    create : async (name,description,fishpond_id,birth_day,employee_id,date,specie_id) => {
        try {
            let fish = new Fish()
            fish.name = name
            fish.description = description
            fish.status = true
            fish.birth_day = birth_day
            fish.created_by = employee_id
            fish.updated_by = employee_id
            fish.created_date = date
            fish.updated_date = date
            fish.fish_pond = await getConnection().getRepository(Fish_Pond).findOne({id:fishpond_id})
            fish.fish_specie = await getConnection().getRepository(Fish_Specie).findOne({id:specie_id})
            await getConnection().getRepository(Fish).save(fish)
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
    check_life_cycle_value : async (pond_id,date) => {
        try {
            const fish = await getConnection()
                .createQueryBuilder()
                .select(["fish.id","fish.name","fish_specie.fishspecie"])
                .from(Fish_Pond, "fish_pond")
                .innerJoin("fish_pond.fish", "fish")
                .innerJoin("fish.fish_specie", "fish_specie")
                .where("fish_pond.id = :pond_id ", {pond_id:pond_id})
                .execute();
            let list_fish =  JSON.parse(JSON.stringify(fish))
            let data = []
            for (let i =0;i<list_fish.length;i++){
                let date = new Date()
                let value_min = new Date(date)
                let value_max = new Date(date)
                // let min_date = new Date(value_min.setHours(value_min.getHours() - 24))
                let min_date = value_min
                let max_date = new Date(value_max.setHours(value_max.getHours() - 24))
                const result = await getConnection()
                    .createQueryBuilder()
                    .select(["event_factor.value_alert","event_factor.massage","event_factor.timestamp","factor.facterType"])
                    .from(Fish, "fish")
                    .innerJoin("fish.event_factor", "event_factor")
                    .innerJoin("event_factor.factor", "factor")
                    // .where("fish.id = :fish_id and (:min_date > event_factor.timestamp and :max_date < event_factor.timestamp)", {fish_id:list_fiah[i].fish_id,min_date:min_date,max_date:max_date})
                    .where("fish.id = :fish_id ", {fish_id:list_fish[i].fish_id,min_date:min_date,max_date:max_date})
                    .execute();
                let test =  JSON.parse(JSON.stringify(result))
                let text = []
                for (let j=0;j<test.length;j++){
                    let factor = test[j].factor_facterType
                    let value = test[j].event_factor_value_alert
                    let message = test[j].event_factor_massage
                    let test_time = new Date(test[j].event_factor_timestamp)
                    let time = test_time.toLocaleTimeString()
                    text.push(factor + " " +"เท่ากับ" + " " + value + " " + message + " " + "ในเวลา" + " " + time)
                }
                data.push(text)
            }
            let data_all = []
            let j =0
            list_fish.forEach((value, index) => {
                if (data[j].length == 0){
                    data_all.push({
                        ...value,
                        status: "ปกติ",
                        event: Object.assign(data[j++])
                    })
                } else {
                    data_all.push({
                        ...value,
                        status: "ไม่ปกติ",
                        event: Object.assign(data[j++])
                    })
                }
            })
            return data_all
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

export default fishInfo