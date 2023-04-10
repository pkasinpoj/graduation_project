import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Accessory_Type} from "../entity/Accessory_Type";
import {Accessory} from "../entity/Accessory";

let accessoryInfo = {
    create : async (name,description,type_id,employee_id,date,balance) => {
        try {
            let accessory = new Accessory()
            accessory.name = name
            accessory.description = description
            accessory.status = true
            accessory.balance = balance
            accessory.created_by = employee_id
            accessory.updated_by =employee_id
            accessory.created_date = date
            accessory.updated_date = date
            accessory.accessory_type = await getConnection().getRepository(Accessory_Type).findOne({id:type_id})
            await getConnection().getRepository(Accessory).save(accessory)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (accessory_id,name,description,employee_id,date) => {
        try {
            let accessory = await getConnection().getRepository(Accessory).findOne({id: accessory_id})
            accessory.name = name
            accessory.description = description
            accessory.updated_by = employee_id
            accessory.updated_date = date
            await getConnection().getRepository(Accessory).save(accessory)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (accessory_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.name","accessory.description","accessory.status"])
                .from(Accessory, "accessory")
                .where("accessory.id = :accessory_id " , {accessory_id:accessory_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.id","accessory.name","accessory.description"])
                .from(Accessory, "accessory")
                .where("accessory.status = true")
                .getMany();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showlist_type : async (type_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.id","accessory.name","accessory.description"])
                .from(Accessory, "accessory")
                .innerJoin("accessory.accessory_type", "accessory_type")
                .where("accessory_type.id = :type_id " , {type_id:type_id})
                .getMany();
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

export default accessoryInfo