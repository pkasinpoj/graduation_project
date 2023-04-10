import {getConnection} from "typeorm";
import {Customer} from "../entity/Customer";

let customerInfo = {
    getInfoUser : async (username,password) => {
        try {
            // const data = await getConnection()
            //     .createQueryBuilder()
            //     .select("surname")
            //     .from(Customer, "customer")
            //     .where("customer.username = :username and customer.password = :password", {username: username, password: password})
            //     .execute();
            const data = await getConnection()
                .createQueryBuilder(Customer,"customer")
                .where("(customer.username = :username or customer.email = :username) and customer.password = :password", {username: username, password: password})
                .getOne();
            //  let userinfo = await getConnection().getRepository(Customer).findOne({username:username,password:password})
            return data
        } catch (err) {
            console.log(err)
        }
    },
    register : async (name,surname,tel,email,username,password,date,employee_id) => {
        try {
                 await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Customer)
                .values([
                    { name: name, surname: surname, tel: tel, email: email, username: username, password: password,created_date:date,created_by:employee_id },
                ])
                .execute();
                 return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (name,surname,tel,email,username,password,customer_id) => {
        try {
            let customer = await getConnection().getRepository(Customer).findOne({id: customer_id})
            customer.name = name
            customer.surname = surname
            customer.tel = tel
            customer.email = email
            customer.username = username
            customer.password = password
            await getConnection().getRepository(Customer).save(customer)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showInfoUser : async (customer_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Customer,"customer")
                .select(["customer.name","customer.surname","customer.tel","customer.email","customer.username"])
                .where("customer.id = :customer_id ", {customer_id: customer_id})
                .getOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showInfoUser_by_admin : async (keyword) => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Customer,"customer")
                .select(["customer.id","customer.name","customer.surname","customer.tel","customer.email","customer.username"])
                .where("customer.name = :keyword or customer.tel = :keyword or customer.username = :keyword ", {keyword: keyword})
                .getOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_by_admin : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder(Customer,"customer")
                .select(["customer.id","customer.name","customer.surname","customer.tel","customer.email","customer.username"])
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default customerInfo