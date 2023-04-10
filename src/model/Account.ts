import {getConnection} from "typeorm";
import {Customer} from "../entity/Customer";
import {Account} from "../entity/Account";
import {Employee} from "../entity/Employee";
import {Account_Type} from "../entity/Account_Type";
import {Booking} from "../entity/Booking";
import {Status_Booking} from "../entity/Status_Booking";

let accountInfo = {
    createinfo_customer : async (user_id,date,employee_id) => {
        try {
            let account = new Account()
            account.customer = await getConnection().getRepository(Customer).findOne({id:user_id})
            account.created_date = date
            account.created_by = employee_id
            account.status = true
            await getConnection().getRepository(Account).save(account)
            return account.id
        } catch (err) {
            console.log(err)
            return false
        }
    },
    createinfo_employee : async (user_id,account_type_id,date,employee_id) => {
        try {
            let account = new Account()
            account.employee = await getConnection().getRepository(Employee).findOne({id:user_id})
            account.account_type = await getConnection().getRepository(Account_Type).findOne({id:account_type_id})
            account.created_date = date
            account.created_by = employee_id
            account.status = true
            await getConnection().getRepository(Account).save(account)
            return account.id
        } catch (err) {
            console.log(err)
            return false
        }
    },
    info_employee : async (employee_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["account.id"])
                .from(Employee, "employee")
                .innerJoin("employee.account", "account")
                .where("employee.id = :employee_id and account.status = true", {employee_id:employee_id})
                .execute();
            return JSON.parse(JSON.stringify(result[0].account_id))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    info_customer : async (customer_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["account.id"])
                .from(Customer, "customer")
                .innerJoin("customer.account", "account")
                .where("customer.id = :customer_id and account.status = true", {customer_id:customer_id})
                .execute();
            return JSON.parse(JSON.stringify(result[0].account_id))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    select_account_type : async (employeeId,account_type_id,employee_id,date) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["account.id"])
                .from(Employee, "employee")
                .innerJoin("employee.account", "account")
                .where("employee.id = :employeeId and account.status = true", {employeeId:employeeId})
                .execute();
            let list_account = JSON.parse(JSON.stringify(result))
            for (let i=0;i<list_account.length;i++){
                let account = await getConnection().getRepository(Account).findOne({id: list_account[i].account_id})
                account.status = false
                account.updated_date = date
                account.updated_by = employee_id
                await getConnection().getRepository(Account).save(account)
            }
            let account = new Account()
            account.employee = await getConnection().getRepository(Employee).findOne({id:employeeId})
            account.account_type = await getConnection().getRepository(Account_Type).findOne({id:account_type_id})
            account.created_date = date
            account.created_by = employee_id
            account.status = true
            await getConnection().getRepository(Account).save(account)
            return account.id
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default accountInfo