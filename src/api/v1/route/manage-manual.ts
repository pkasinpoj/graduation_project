import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import tokenInfo from "../../../model/Token_Customer";
import pondInfo from "../../../model/FishPond";
import fishInfo from "../../../model/Fish";
import manualInfo from "../../../model/Manual_Factor";
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

app.post('/create',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let value = req.body.value
    let fishpond_id = req.body.fishpond_id
    let factor_id = req.body.factor_id
    if (!condition.three_values(value,fishpond_id,factor_id)){
        res.status(400).json({
            statusName: '์No value or fishpond_id or factor_id'
        })
    }else {
    let ponddata = await pondInfo.showinfo(customer_id,fishpond_id)
    if (!ponddata){
        res.status(400).json({
            statusName: 'You do not have permission to create.'
        })
    }else {
        if (await manualInfo.create(value,fishpond_id,factor_id,customer_id) === false) {
            res.status(400).json({
                statusName: '์Recording failed'
            })
        }
        res.status(200).json({
            statusName: '์Recording successfull'
        })
    }
    }
})

app.post('/edit',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let fish_id = req.body.fish_id
    let name = req.body.name
    let description = req.body.description
    let status = req.body.status
    let specie_id = req.body.specie_id
    let date = req.body.date
    if ( !condition.one_value(fish_id)){
        res.status(400).json({
            statusName: 'edit failed'
        })
    }else {
        let fish_data = await fishInfo.showinfo(customer_id,fish_id)
        if (!fish_data){
            res.status(400).json({
                statusName: 'You do not have permission to edit.'
            })
        }else {
            if (await fishInfo.edit(name,description,status,specie_id,fish_id,date) === false) {
                res.status(400).json({
                    statusName: '์Recording failed'
                })
            }
            res.status(200).json({
                statusName: 'edit successfull'
            })
        }
    }

})

app.post('/lists-manual',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let fishpond_id = req.body.fishpond_id
    if (!condition.one_value(fishpond_id)){
        res.status(400).json({
            statusName: '์No fishpond_id '
        })
    }
    let ponddata = await pondInfo.showinfo(customer_id,fishpond_id)
    if (!ponddata){
        res.status(400).json({
            statusName: 'You do not have permission to create.'
        })
    }else {
        let result = await manualInfo.lists_manual(customer_id,fishpond_id)
        if (result === false) {
            res.status(400).json({
                statusName: '์Recording failed'
            })
        }
        res.status(200).json({
            statusName: '์Recording successfull',
            lists_manual: result
        })
    }
})

app.post('/lists-manual-by-factor',checkToken,async (req, res) => {
    let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
    let fishpond_id = req.body.fishpond_id
    let factor_id = req.body.factor_id
    if (!condition.two_values(fishpond_id,factor_id)){
        res.status(400).json({
            statusName: '์No fishpond_id '
        })
    }
    let ponddata = await pondInfo.showinfo(customer_id,fishpond_id)
    if (!ponddata){
        res.status(400).json({
            statusName: 'You do not have permission to create.'
        })
    }else {
        let result = await manualInfo.lists_manual_by_factor(customer_id,fishpond_id,factor_id)
        if (result === false) {
            res.status(400).json({
                statusName: '์Recording failed'
            })
        }
        res.status(200).json({
            statusName: '์Recording successfull',
            lists_manual: result
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
    }
    let fishdata = await fishInfo.showinfo(customer_id,fish_id)
    res.status(200).json({
        statusName: 'success',
        fishponddata: fishdata
    })
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