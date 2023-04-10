import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import accessoryInfo from "../../../model/Accessory";
import Privilege from "../../../../services/Privilege";
import serviceTypeInfo from "../../../model/Service_Type";
import serviceInfo from "../../../model/Service";
import accessoryTypeInfo from "../../../model/Accessory_Type";
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
    let api_name = "create-accessory"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let date = new Date()
        if (!condition.three_values(req.body.name,req.body.balance,req.body.type_id)){
            res.status(400).json({
                statusName: '์No name or balance'
            })
        }
        if (await accessoryInfo.create(req.body.name,req.body.description,req.body.type_id,employee_id,date,req.body.balance) === false) {
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
    let api_name = "edit-accessory"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let accessory_id = req.body.accessory_id
        let name = req.body.name
        let description = req.body.description
        let balance = req.body.balance
        let date = new Date()
        if ( !condition.three_values(accessory_id,name,balance) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            let accessorydata = await accessoryInfo.showinfo(accessory_id)
            if (!accessorydata){
                res.status(400).json({
                    statusName: 'You do not have permission to edit.'
                })
            }else {
                if (await accessoryInfo.edit(accessory_id,name,description,employee_id,date) === false) {
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

app.post('/accessory-list',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "accessory-list-accessory"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if ( !condition.one_value(req.body.type_id) ){
            res.status(400).json({
                statusName: 'No type_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to Accessory-List.'
            })
        }else {
            let accessoryList = await accessoryInfo.showlist_type(req.body.type_id)
            res.status(200).json({
                statusName: 'success',
                accessoryList: accessoryList
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/lists',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-accessory"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let accessoryList = await accessoryInfo.showall()
            res.status(200).json({
                statusName: 'success',
                accessoryList: accessoryList
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
    let api_name = "info-accessory"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let accessory_id = req.body.accessory_id
        if (!condition.one_value(accessory_id)){
            res.status(400).json({
                statusName: 'No accessory_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let accessorydata = await accessoryInfo.showinfo(accessory_id)
            res.status(200).json({
                statusName: 'success',
                accessorydata: accessorydata
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/home-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "home-by-admin-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let accessory_type_list = await  accessoryTypeInfo.showall()
            let accessory_list = await accessoryTypeInfo.home_list_accessory()
            res.status(200).json({
                statusName: 'success',
                accessory_type_list: accessory_type_list,
                accessory_list: accessory_list
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