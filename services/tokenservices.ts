import * as jwt from 'jsonwebtoken'
import tokenInfo from "../src/model/Token_Customer";
import tokenInfo_customer from "../src/model/Token_Customer";
import tokenInfo_employee from "../src/model/Token_Employee";
let tokenService = {
    getAccessToken:() => {
        return jwt.sign({}, 'vcvccbrgrdggwr', { expiresIn: '20h' });},
    getExpireAccessToken: () => {
        return new Date(new Date().setDate(new Date().getDate() + 7))
    },
    checkExprire: async (token) => {
        let exprire = await tokenInfo.checkExprire(token)
        let date = new Date().valueOf()
        var expriredate = new Date(exprire).valueOf();
        if ( !exprire || expriredate < date){
            return false
        }
        return true
    },
    checkExprire_Employee: async (token) => {
        let exprire = await tokenInfo_employee.checkExprire(token)
        let date = new Date().valueOf()
        var expriredate = new Date(exprire).valueOf();
        if ( !exprire || expriredate < date){
            return false
        }
        return true
    },
    deleteToken: async (token) => {
        let result = await tokenInfo.deleteCustomersToken(token)
        return result
    },
    deleteToken_Employee: async (token) => {
        let result = await tokenInfo_employee.deleteEmployeeToken(token)
        return result
    }
}

export default tokenService