import {getConnection} from "typeorm";
import {Employee} from "../entity/Employee";
import {Position} from "../entity/Position";
import {Customer} from "../entity/Customer";

let employeeInfo = {
    getInfoUser : async (username,password) => {
        try {
            const data = await getConnection()
                .createQueryBuilder(Employee,"employee")
                .where("(employee.username = :username or employee.email = :username) and employee.password = :password", {username: username, password: password})
                .getOne()
            return data
        } catch (err) {
            console.log(err)
        }
    },
    register : async (name,surname,tel,email,username,password,position_id) => {
        try {
            let employee = new Employee()
            employee.name = name
            employee.surname = surname
            employee.tel = tel
            employee.email = email
            employee.username = username
            employee.password = password
            employee.status = true
            employee.position = await getConnection().getRepository(Position).findOne({id:position_id})
            await getConnection().getRepository(Employee).save(employee)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,surname,tel,email,username,password,employee_id) => {
        try {
            let employee = await getConnection().getRepository(Employee).findOne({id: employee_id})
            employee.name = name
            employee.surname = surname
            employee.tel = tel
            employee.email = email
            employee.username = username
            employee.password = password
            await getConnection().getRepository(Employee).save(employee)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showInfoUser : async (employee_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Employee,"employee")
                .select(["employee.name","employee.surname","employee.tel","employee.email","employee.username","position.name"])
                .leftJoin("employee.position", "position")
                .where("employee.id = :employee_id ", {employee_id: employee_id})
                .execute()
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_employee_by_admin : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Employee,"employee")
                .select(["employee.name","employee.surname","employee.tel","employee.email","employee.username","position.name"])
                .leftJoin("employee.position", "position")
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showInfoUser_by_admin : async (keyword) => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Employee,"employee")
                .select(["employee.id","employee.name","employee.surname","employee.tel","employee.email","employee.username","position.name","account_type.typeName"])
                // .select(["employee.id","employee.name","employee.surname","employee.tel","employee.email","employee.username","position.name"])
                .leftJoin("employee.position", "position")
                .innerJoin("employee.account", "account")
                .leftJoin("account.account_type", "account_type")
                .where("(employee.name = :keyword or employee.tel = :keyword or employee.username = :keyword) and account.status = true ", {keyword: keyword})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default employeeInfo