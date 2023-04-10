import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import tokenService from "../../../../services/tokenservices";
import accountService from "../../../../services/accountservice";
import employeeInfo from "../../../model/Employee";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import accountInfo from "../../../model/Account";
import Privilege from "../../../../services/Privilege";
import sendEmail from "../../../../services/sendEmail";
import positionInfo from "../../../model/Position";
import accountTypeInfo from "../../../model/Account_Type";
let express = require("express")
let bodyParser = require("body-parser")
let app = express.Router()
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.post('/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (condition.two_values(username, password)) {
        let result = await employeeInfo.getInfoUser(username, password)
        if (result === undefined){
            res.status(400).json({
                statusName: 'Login failed'
            })
        }else {
            let account = await accountInfo.info_employee(result.id)
            let token = await tokenInfo_employee.genTokenEmployee(account)
            if (!token) {
                res.status(400).json({
                    statusName: 'Login failed'
                })
            }
            res.status(200).json({
                Authorization : token,
                statusName: 'Login Success'
            })
        }
    } else {
        res.status(400).json({
            statusName: 'No username or password',
        })
    }
})

app.post('/register', async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "register-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let name = req.body.name
        let surname = req.body.surname
        let tel = req.body.tel
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        let position_id = req.body.position_id
        let account_type_id = req.body.account_type_id
        let date = new Date()
        if (condition.three_values(email, username, password)) {
            let result = await employeeInfo.register(name, surname, tel, email, username, password,position_id)
            if (!result) {
                res.status(400).json({
                    statusName: 'Recording failed'
                })
            }else {
                let accountresult = await accountService.createAccount_Employee(username,password,account_type_id,date,employee_id)
                let token = await tokenInfo_employee.genTokenEmployee(accountresult)
                await sendEmail.register(email,username,password)
                if (!token || !accountresult) {
                    res.status(400).json({
                        statusName: 'Recording failed'
                    })
                }
                res.status(200).json({
                    Authorization : token,
                    statusName: 'Save successfully'
                })
            }
        } else {
            res.status(400).json({
                statusName: 'No email or username or password'
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/show',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "show-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let employeeinfo = await employeeInfo.showInfoUser(employee_id)
        if (!employeeinfo){
            res.status(400).json({
                statusName: 'failed'
            })
        }
        res.status(200).json({
            statusName: 'Success',
            customerInfo : employeeinfo
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/show_info_by_admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "show-info-by-admin-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let keyword  = req.body.keyword
        if (!condition.one_value(keyword)){
            res.status(400).json({
                statusName: 'No keyword'
            })
        }
        let employee_info = await employeeInfo.showInfoUser_by_admin(keyword)
        let list_account_type = await accountTypeInfo.showall()
        res.status(200).json({
            statusName: 'Success',
            list_account_type:list_account_type,
            employee_info : employee_info
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/list_employee_by_admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-employee-by-admin-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let list_employee = await employeeInfo.list_employee_by_admin()
        res.status(200).json({
            statusName: 'Success',
            list_employee : list_employee
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/get-dropdown-for-register',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "get-dropdown-for-register-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let list_position = await positionInfo.showall()
        let list_account_type = await accountTypeInfo.showall()
        res.status(200).json({
            statusName: 'success',
            list_position:list_position,
            list_account_type:list_account_type
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/edit',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "edit-employee"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let name = req.body.name
        let surname = req.body.surname
        let tel = req.body.tel
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        if ( !condition.three_values(email,username,password) ){
            res.status(400).json({
                statusName: 'No email or username or password.'
            })
        }else {
            if (await employeeInfo.edit(name, surname, tel, email, username, password, employee_id) === false) {
                res.status(400).json({
                    statusName: '์Recording failed'
                })
            }
            res.status(200).json({
                statusName: 'edit successfull'
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/logout',checkToken,async (req, res) => {
    if (await tokenService.deleteToken_Employee(req.headers['authorization']) === false){
        res.status(400).json({
            statusName: 'logout unsuccessful'
        })
    }
    res.status(200).json({
        statusName: 'logout successfull'
    })
})

export default app