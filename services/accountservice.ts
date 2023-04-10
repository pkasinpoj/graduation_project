import accountInfo from "../src/model/Account";
import customerInfo from "../src/model/Customer";
import employeeInfo from "../src/model/Employee";

let accountService = {
    createAccount_Customer:async (username,password,date,employee_id) => {
        let datauser = await customerInfo.getInfoUser(username,password)
        let result = await accountInfo.createinfo_customer(datauser.id,date,employee_id)
        return result
    },
    createAccount_Employee:async (username,password,account_type_id,date,employee_id) => {
        let datauser = await employeeInfo.getInfoUser(username,password)
        let result = await accountInfo.createinfo_employee(datauser.id,account_type_id,date,employee_id)
        return result
    }
}

export default accountService