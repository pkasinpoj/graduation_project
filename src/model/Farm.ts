import {getConnection} from "typeorm";
import {Customer} from "../entity/Customer";
import {Farm} from "../entity/Farm";

let farmInfo = {
    create : async (name,address,description,customer_id,employee_id,date) => {
        try {
            let farm = new Farm()
            farm.name = name
            farm.address = address
            farm.description = description
            farm.status = true
            farm.created_date = date
            farm.updated_date = date
            farm.created_by = employee_id
            farm.updated_by = employee_id
            farm.customer = await getConnection().getRepository(Customer).findOne({id:customer_id})
            await getConnection().getRepository(Farm).save(farm)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,address,description,farm_id,date,employee_id) => {
        try {
            let farm = await getConnection().getRepository(Farm).findOne({id: farm_id})
            // console.log(farm)
            farm.name = name
            farm.address = address
            farm.description = description
            farm.updated_date = date
            farm.updated_by = employee_id
            await getConnection().getRepository(Farm).save(farm)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    // home : async (customer_id) => {
    //     try {
    //         const farminfo = await getConnection()
    //             .createQueryBuilder()
    //             .select(["farm.id"])
    //             .from(Customer, "customer")
    //             .innerJoin("customer.farm", "farm")
    //             .where("customer.id = :customer_id and farm.status = true ", {customer_id:customer_id})
    //             .execute();
    //         let farm = JSON.parse(JSON.stringify(farminfo))
    //         let result = Array()
    //         for (let i =0;i<farm.length;i++){
    //             const pondinfo = await getConnection()
    //                 .createQueryBuilder()
    //                 .select(["fish_pond.name","COUNT(fish.id) as fish_count"])
    //                 .from(Farm, "farm")
    //                 .innerJoin("farm.fish_pond", "fish_pond")
    //                 .leftJoin("fish_pond.fish", "fish")
    //                 .groupBy("fish_pond.id")
    //                 .where("farm.id = :farm_id and fish_pond.status = true ", {farm_id:farm[i].farm_id})
    //                 .execute();
    //             let pond = JSON.parse(JSON.stringify(pondinfo))
    //             result.push(pond)
    //         }
    //         console.log(result[0][0].push(1))
    //         console.log(result)
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    pond_list_home : async (customer_id) => {
        try {
            const farminfo = await getConnection()
                .createQueryBuilder()
                .select(["farm.id"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .where("customer.id = :customer_id and farm.status = true ", {customer_id:customer_id})
                .getRawOne();
            let farm = JSON.parse(JSON.stringify(farminfo))
                const pondinfo = await getConnection()
                    .createQueryBuilder()
                    .select(["fish_pond.id","fish_pond.name","COUNT(fish.id) as fish_count"])
                    .from(Farm, "farm")
                    .innerJoin("farm.fish_pond", "fish_pond")
                    .leftJoin("fish_pond.fish", "fish")
                    .groupBy("fish_pond.id")
                    .where("farm.id = :farm_id and fish_pond.status = true ", {farm_id:farm.farm_id})
                    .execute();
                let pond = JSON.parse(JSON.stringify(pondinfo))
                return pond
        } catch (err) {
            console.log(err)
            return false
        }
    },
    select_pond_list : async (customer_id,farm_id) => {
        try {
            const farminfo = await getConnection()
                .createQueryBuilder()
                .select(["farm.id"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .where("customer.id = :customer_id and farm.status = true and farm.id = :farm_id", {customer_id:customer_id,farm_id:farm_id})
                .getRawOne();
            let farm = JSON.parse(JSON.stringify(farminfo))
            const pondinfo = await getConnection()
                .createQueryBuilder()
                .select(["fish_pond.id","fish_pond.name","COUNT(fish.id) as fish_count"])
                .from(Farm, "farm")
                .innerJoin("farm.fish_pond", "fish_pond")
                .leftJoin("fish_pond.fish", "fish")
                .groupBy("fish_pond.id")
                .where("farm.id = :farm_id and fish_pond.status = true ", {farm_id:farm.farm_id})
                .execute();
            let pond = JSON.parse(JSON.stringify(pondinfo))
            return pond
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (customer_id,farm_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["farm.id","farm.name","farm.address","farm.description"])
                .from(Farm, "farm")
                .innerJoin("farm.customer", "customer")
                .where("customer.id = :customer_id and farm.id = :farm_id" , {customer_id:customer_id,farm_id:farm_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_by_admin : async (farm_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["farm.id","farm.name","farm.address","farm.description"])
                .from(Farm, "farm")
                .innerJoin("farm.customer", "customer")
                .where("farm.id = :farm_id" , {farm_id:farm_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async (customer_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["farm.id","farm.name","COUNT(fish_pond.id) as pond_count"])
                .from(Farm, "farm")
                .innerJoin("farm.customer", "customer")
                .leftJoin("farm.fish_pond", "fish_pond")
                .groupBy("farm.id")
                .where("customer.id = :customer_id", {customer_id:customer_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall_by_admin : async (keyword) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["farm.id","farm.name","COUNT(fish_pond.id) as pond_count"])
                .from(Farm, "farm")
                .innerJoin("farm.customer", "customer")
                .leftJoin("farm.fish_pond", "fish_pond")
                .groupBy("farm.id")
                .where("(customer.name = :keyword or customer.tel = :keyword or customer.username = :keyword) and farm.status = true", {keyword:keyword})
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

export default farmInfo