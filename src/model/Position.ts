import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Position} from "../entity/Position";
import {Customer} from "../entity/Customer";
import {Port} from "../entity/Port";

let positionInfo = {
    create : async (name,description,employee_id,date) => {
        try {
            let position = new Position()
            position.name = name
            position.description = description
            position.status = true
            position.created_by = employee_id
            position.updated_by = employee_id
            position.created_date = date
            position.updated_date = date
            await getConnection().getRepository(Position).save(position)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (position_id,name,description,employee_id) => {
        try {
            let position = await getConnection().getRepository(Position).findOne({id: position_id})
            position.name = name
            position.description = description
            position.updated_by = employee_id
            await getConnection().getRepository(Position).save(position)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (position_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["position.name","position.description","position.status"])
                .from(Position, "position")
                .where("position.id = :position_id " , {position_id:position_id})
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
                .select(["position.id","position.name","position.description"])
                .from(Position, "position")
                .where("position.status = true")
                .getMany();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_employee_by_position : async (position_id) => {
        try {
            let data_employee = Array()
            for (let i=0;i<position_id.length;i++){
                    const value = await getConnection()
                        .createQueryBuilder()
                        .select(["employee.id","employee.name","employee.surname","employee.tel"])
                        .from(Position, "position")
                        .innerJoin("position.employee", "employee")
                        .where("position.id = :position_id ", {position_id:position_id[i]})
                        .execute();
                    let list_employee = JSON.parse(JSON.stringify(value))
                    data_employee.push(list_employee)
            }
            return data_employee
        } catch (err) {
            console.log(err)
            return false
        }
    },
    show_by_position : async (position_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["employee.id","employee.name","employee.surname","employee.tel"])
                .from(Position, "position")
                .innerJoin("position.employee", "employee")
                .where("position.id = :position_id ",{position_id:position_id})
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

export default positionInfo