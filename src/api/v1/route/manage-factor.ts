import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import factorInfo from "../../../model/Factor";
import tokenInfo_customer from "../../../model/Token_Customer";
import Privilege from "../../../../services/Privilege";
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

app.post('/create',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "create-factor"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!condition.one_value(req.body.name)){
            res.status(400).json({
                statusName: '์No factor name'
            })
        }
        let date = new Date()
        if (await factorInfo.create(req.body.name,req.body.description,req.body.unit,date,employee_id) === false) {
            res.status(400).json({
                statusName: '์Recording failed'
            })
        }
        res.status(200).json({
            statusName: '์Recording successfull'
        })

    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/edit',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "edit-factor"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let factor_id = req.body.factor_id
        let factorname = req.body.name
        let description = req.body.description
        let unit = req.body.unit
        let date = new Date()
        if ( !condition.one_value(factor_id) || !condition.one_value(factorname) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            let factordata = await factorInfo.showinfo(factor_id)
            if (!factordata){
                res.status(400).json({
                    statusName: 'You do not have permission to edit.'
                })
            }else {
                if (await factorInfo.edit(factorname,description,employee_id,unit,factor_id,date) === false) {
                    res.status(400).json({
                        statusName: '์Recording failed'
                    })
                }
                res.status(200).json({
                    statusName: 'edit successfull'
                })
            }
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/lists-by-customer',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    if (!customer_id) {
        res.status(400).json({
            statusName: 'You do not have permission to lists.'
        })
    }else {
        let factorList = await factorInfo.list_factor()
        res.status(200).json({
            statusName: 'success',
            specielist: factorList
        })
    }
})


app.get('/lists-all',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-all-factor"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let factorList = await factorInfo.showall()
            res.status(200).json({
                statusName: 'success',
                specielist: factorList
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/lists-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-by-admin-factor"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let factorList = await factorInfo.list_factor()
            res.status(200).json({
                statusName: 'success',
                factorList: factorList
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/info',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-factor"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let factor_id = req.body.factor_id
        if (!condition.one_value(factor_id)){
            res.status(400).json({
                statusName: 'No factor_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let factordata = await factorInfo.showinfo(factor_id)
            res.status(200).json({
                statusName: 'success',
                farmdata: factordata
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/delete',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let farm_id = req.body.farm_id
    if (!condition.one_value(farm_id)){
        res.status(400).json({
            statusName: 'No farm_id'
        })
    }
    let farmdata = await farmInfo.showinfo(customer_id,farm_id)
    if (!farmdata){
        res.status(400).json({
            statusName: 'You do not have permission to delete.'
        })
    }else {
        let result = await farmInfo.delete(farm_id)
        if (!result){
            res.status(400).json({
                statusName: 'Failed to delete'
            })
        }
        res.status(200).json({
            statusName: 'Successfully deleted',
        })
    }
})
export default app