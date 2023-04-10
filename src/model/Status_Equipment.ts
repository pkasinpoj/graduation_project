import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Specie} from "../entity/Fish_Specie";
import {Status_Equipment} from "../entity/Status_Equipment";

let status_equipment_Info = {
    create : async (status,description,date,employee_id) => {
        try {
            let status_equipment = new Status_Equipment()
            status_equipment.status = status
            status_equipment.description = description
            status_equipment.created_by = employee_id
            status_equipment.updated_by = employee_id
            status_equipment.created_date = date
            status_equipment.updated_date = date
            await getConnection().getRepository(Status_Equipment).save(status_equipment)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (status_id,status,description,date,employee_id) => {
        try {
            let status_equipment = await getConnection().getRepository(Status_Equipment).findOne({id: status_id})
            status_equipment.status = status
            status_equipment.description = description
            status_equipment.updated_by = employee_id
            status_equipment.updated_date = date
            await getConnection().getRepository(Status_Equipment).save(status_equipment)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (status_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["status_equipment.status","status_equipment.description"])
                .from(Status_Equipment, "status_equipment")
                .where("status_equipment.id = :status_id " , {status_id:status_id})
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
                .select(["status_equipment.id","status_equipment.status"])
                .from(Status_Equipment, "status_equipment")
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

export default status_equipment_Info