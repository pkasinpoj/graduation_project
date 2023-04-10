import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import tokenInfo_employee from "../../../model/Token_Employee";
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
    let api_name = "create-farm"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let customer_id = req.body.customer_id
    let date = new Date()
    if(checkprivilege){
        if (!condition.two_values(req.body.name,customer_id)){
            res.status(400).json({
                statusName: '์No farm name of customer_id'
            })
        }else {
            if (await farmInfo.create(req.body.name,req.body.address,req.body.description,customer_id,employee_id,date) === false) {
                res.status(400).json({
                    statusName: '์Recording failed'
                })
            }
            res.status(200).json({
                statusName: '์Recording successfull'
            })
        }
    }else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/edit',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "edit-farm"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let farm_id = req.body.farm_id
    let name = req.body.name
    let address = req.body.address
    let description = req.body.description
    let date = new Date()
    if (checkprivilege){
        if ( !condition.one_value(farm_id) || !condition.one_value(name) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            if (await farmInfo.edit(name,address,description,farm_id,date,employee_id) === false) {
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

app.get('/lists',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    console.log(customer_id)
    let farmlist = await farmInfo.showall(customer_id)
    res.status(200).json({
        statusName: 'success',
        farmlist: farmlist
    })
})

app.post('/lists-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-by-admin-farm"
    let keyword = req.body.keyword
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let farmlist = await farmInfo.showall_by_admin(keyword)
        if (!farmlist[0]) {
            res.status(400).json({
                statusName: 'Data not found',
            })
        }
        res.status(200).json({
            statusName: 'success',
            farmlist: farmlist
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/info',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let farm_id = req.body.farm_id
    if (!condition.one_value(farm_id)){
        res.status(400).json({
            statusName: 'No farm_id'
        })
    }
    let farmdata = await farmInfo.showinfo(customer_id,farm_id)
    res.status(200).json({
        statusName: 'success',
        farmdata: farmdata
    })
})

app.post('/info-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-by-admin-farm"
    let customer_id = req.body.customer_id
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let farm_id = req.body.farm_id
    if (checkprivilege){
        if (!condition.two_values(farm_id,customer_id)){
            res.status(400).json({
                statusName: 'No farm_id'
            })
        }
        let farmdata = await farmInfo.showinfo_by_admin(farm_id)
        res.status(200).json({
            statusName: 'success',
            farmdata: farmdata
        })
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