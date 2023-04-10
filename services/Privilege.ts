import privilegeInfo from "../src/model/Account_Privilege";

let Privilege = {
    check:async (employee_id,api_name) => {
        let result = await privilegeInfo.check_privilege(employee_id,api_name)
        // if (!result){
        //     return false
        // } else {
        //     return true
        // }
        return true
    }
}

export default Privilege