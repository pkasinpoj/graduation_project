import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import tokenInfo from "../../../model/Token_Customer";
import pondInfo from "../../../model/FishPond";
import fishInfo from "../../../model/Fish";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import tokenInfo_employee from "../../../model/Token_Employee";
import Privilege from "../../../../services/Privilege";
import equipmentInfo from "../../../model/Equipment";
import tokenInfo_customer from "../../../model/Token_Customer";
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
    let api_name = "create-fish"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let name = req.body.name
    let fishpond_id = req.body.fishpond_id
    let specie_id = req.body.specie_id
    let description = req.body.description
    let birth = req.body.birth_day
    let birth_day = new Date(birth)
    let date = new Date()
    if (checkprivilege){
        if (!condition.one_value(name)){
            res.status(400).json({
                statusName: '์No fish name'
            })
        }else {
            if (await fishInfo.create(name,description,fishpond_id,birth_day,employee_id,date,specie_id) === false) {
            res.status(400).json({
                statusName: '์Recording failed'
            })
        }
            res.status(200).json({
                statusName: '์Recording successfull'
            })}
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/edit',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "edit-fish"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let fish_id = req.body.fish_id
    let name = req.body.name
    let description = req.body.description
    let specie_id = req.body.specie_id
    let date = new Date()
    if (checkprivilege){
        if ( !condition.two_values(fish_id,name)){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
                if (await fishInfo.edit(name,description,specie_id,fish_id,employee_id,date) === false) {
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
    let fishpond_id = req.body.fishpond_id
    let fishlist = await fishInfo.showall(customer_id,fishpond_id)
    res.status(200).json({
        statusName: 'success',
        farmlist: fishlist
    })
})

app.post('/lists-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-by-admin-fish"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let fishpond_id = req.body.fishpond_id
    if (checkprivilege){
        if (!condition.one_value(fishpond_id)){
            res.status(400).json({
                statusName: 'No fishpond_id'
            })
        }
        let fishlist = await fishInfo.showall_by_admin(fishpond_id)
        res.status(200).json({
            statusName: 'success',
            farmlist: fishlist
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/info',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let fish_id = req.body.fish_id
    if (!condition.one_value(fish_id)){
        res.status(400).json({
            statusName: 'No fish_id'
        })
    }else {
        let fishdata = await fishInfo.showinfo(customer_id,fish_id)
        res.status(200).json({
            statusName: 'success',
            fishponddata: fishdata
        })
    }
})


app.post('/home-check-life-cycle',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let date = new Date(req.body.date)
    let pond_id = req.body.pond_id
    var date_to_use = new Date("03-08-2020")
    let result = await fishInfo.check_life_cycle_value(pond_id,date_to_use)
    res.status(200).json({
        statusName: 'successfull',
        result:result
    })
})


app.post('/info-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-by-admin-fish"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let fish_id = req.body.fish_id
    if (checkprivilege){
        if (!condition.one_value(fish_id)){
            res.status(400).json({
                statusName: 'No fish_id'
            })
        }else {
            let fishdata = await fishInfo.showinfo_by_admin(fish_id)
            res.status(200).json({
                statusName: 'success',
                fishponddata: fishdata
            })
        }
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