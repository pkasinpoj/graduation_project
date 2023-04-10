import {getConnection} from "typeorm";
import {Token_Customer} from "../entity/Token_Customer";
import tokenService from "../../services/tokenservices";
import {Customer} from "../entity/Customer";
import {Account} from "../entity/Account";
import {Employee} from "../entity/Employee";

let tokenInfo_customer = {
    genTokenCustomers : async (account_id) => {
        let token = tokenService.getAccessToken()
        try {
            let tokencustomer = new Token_Customer()
            tokencustomer.Authorization = token
            tokencustomer.exprire = tokenService.getExpireAccessToken()
            tokencustomer.account = await getConnection().getRepository(Account).findOne({id:account_id})
            await getConnection().getRepository(Token_Customer).save(tokencustomer)
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
                .select("tokencustomer.exprire")
                .from(Token_Customer, "tokencustomer")
                .where("tokencustomer.Authorization = :token", {token:token})
                .getRawOne();
            return JSON.parse(JSON.stringify(result)).tokencustomer_exprire
        }catch (e) {
            console.log(e)
            return false
        }
    },
    checkInfoCustomers : async (token) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select("customer.id")
                .from(Customer, "customer")
                .innerJoin("customer.account", "account")
                .innerJoin("account.tokencustomer", "tokencustomer")
                .where("tokencustomer.Authorization = :token", {token:token})
                .getRawOne();
            return JSON.parse(JSON.stringify(result)).customer_id
        }catch (e) {
            console.log(e)
            return false
        }
    },
    checkInfoCustomersAccount : async (token) => {
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
    deleteCustomersToken : async (token) =>{
        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Token_Customer)
                .where("Authorization = :token", { token: token })
                .execute();
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

}

export default tokenInfo_customer