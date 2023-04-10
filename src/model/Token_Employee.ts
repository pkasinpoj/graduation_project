import {getConnection} from "typeorm";
import tokenService from "../../services/tokenservices";
import {Token_Employee} from "../entity/Token_Employee";
import {Employee} from "../entity/Employee";
import {Account} from "../entity/Account";
import {Customer} from "../entity/Customer";

let tokenInfo_employee = {
    genTokenEmployee : async (account_id) => {
        let token = tokenService.getAccessToken()
        try {
            let token_employee = new Token_Employee()
            token_employee.Authorization = token
            token_employee.exprire = tokenService.getExpireAccessToken()
            token_employee.account = await getConnection().getRepository(Account).findOne({id:account_id})
            await getConnection().getRepository(Token_Employee).save(token_employee)
            return token
        } catch (err) {
            console.log(err)
            return false
        }
    },
    checkExprire : async (token) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select("token_employee.exprire")
                .from(Token_Employee, "token_employee")
                .where("token_employee.Authorization = :token", {token:token})
                .getRawOne();
            return JSON.parse(JSON.stringify(result)).token_employee_exprire
        }catch (e) {
            console.log(e)
            return false
        }
    },
    checkInfoEmployee : async (token) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select("employee.id")
                .from(Employee, "employee")
                .innerJoin("employee.account", "account")
                .innerJoin("account.token_employee", "token_employee")
                .where("token_employee.Authorization = :token", {token:token})
                .getRawOne();
            return JSON.parse(JSON.stringify(result)).employee_id
        }catch (e) {
            console.log(e)
            return false
        }
    },
    checkInfoEmployeeAccount : async (token) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select("account.id")
                .from(Customer, "customer")
                .innerJoin("customer.account", "account")
                .innerJoin("account.tokencustomer", "tokencustomer")
                .where("tokencustomer.Authorization = :token", {token:token})
                .getRawOne();
            return JSON.parse(JSON.stringify(result)).account_id
        }catch (e) {
            console.log(e)
            return false
        }
    },
    deleteEmployeeToken : async (token) =>{
        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Token_Employee)
                .where("Authorization = :token", { token: token })
                .execute();
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

}

export default tokenInfo_employee