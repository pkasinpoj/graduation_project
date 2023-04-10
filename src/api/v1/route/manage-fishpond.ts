import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import pondInfo from "../../../model/FishPond";
import equipmentInfo from "../../../model/Equipment";
import fishInfo from "../../../model/Fish";
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
    let api_name = "create-pond"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let name = req.body.name
    let farm_id = req.body.farm_id
    let description = req.body.description
    let date = new Date()
    if (checkprivilege){
        if (!condition.one_value(name)){
            res.status(400).json({
                statusName: '์No pund name'
            })
        }
            if (await pondInfo.create(name,description,farm_id,employee_id,date) === false) {
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
    let api_name = "edit-pond"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let fishpond_id = req.body.fishpond_id
    let name = req.body.name
    let description = req.body.description
    let date = new Date()
    if (checkprivilege){
        if ( !condition.one_value(fishpond_id) || !condition.one_value(name) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
                if (await pondInfo.edit(name,description,fishpond_id,employee_id,date) === false) {
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

app.post('/lists',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    if (!customer_id){
        res.status(400).json({
            statusName: 'Cannot find information'
        })
    }
    let farm_id = req.body.farm_id
    let fishpondlist = await pondInfo.showall(customer_id,farm_id)
    res.status(200).json({
        statusName: 'success',
        farmlist: fishpondlist
    })
})

app.post('/lists-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-by-admin-pond"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let farm_id = req.body.farm_id
    if (checkprivilege){
        if (!condition.one_value(farm_id)) {
            res.status(400).json({
                statusName: 'No farm_id'
            })
        }else {
            let fishpondlist = await pondInfo.showall_by_admin(farm_id)
            res.status(200).json({
                statusName: 'success',
                farmlist: fishpondlist
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})


app.post('/pond-info',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let fishpond_id = req.body.fishpond_id
    if (!condition.one_value(fishpond_id)){
        res.status(400).json({
            statusName: 'No fishpond_id'
        })
    }
    let fishponddata = await pondInfo.showinfo(customer_id,fishpond_id)
    let fishlist = await fishInfo.showall(customer_id,fishpond_id)
    let factorlist = await equipmentInfo.list_factor_of_pond_customer(customer_id,fishpond_id)
    res.status(200).json({
        statusName: 'success',
        fishponddata: fishponddata,
        fishlist: fishlist,
        factorlist: factorlist
    })
})

app.post('/pond-info-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "pond-info-by-admin-pond"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let fishpond_id = req.body.fishpond_id
    if (checkprivilege){
        if (!condition.one_value(fishpond_id)){
            res.status(400).json({
                statusName: 'No fishpond_id'
            })
        }
        let fishponddata = await pondInfo.showinfo_by_admin(fishpond_id)
        let fishlist = await fishInfo.showall_by_admin(fishpond_id)
        res.status(200).json({
            statusName: 'success',
            fishponddata: fishponddata,
            fishlist: fishlist,
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

// app.post('/delete',checkToken,async (req, res) => {
//     let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
//     if (!customer_id){
//         res.status(400).json({
//             statusName: 'Cannot find information'
//         })
//     }
//     let farm_id = req.body.farm_id
//     if (!condition.farmnid(farm_id)){
//         res.status(400).json({
//             statusName: 'No farm_id'
//         })
//     }
//     let farmdata = await farmInfo.showinfo(customer_id,farm_id)
//     if (!farmdata){
//         res.status(400).json({
//             statusName: 'You do not have permission to delete.'
//         })
//     }else {
//         let result = await farmInfo.delete(farm_id)
//         if (!result){
//             res.status(400).json({
//                 statusName: 'Failed to delete'
//             })
//         }
//         res.status(200).json({
//             statusName: 'Successfully deleted',
//         })
//     }
// })

export default app