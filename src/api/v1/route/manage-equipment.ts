import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import equipmentInfo from "../../../model/Equipment";
// import {Dataset} from "../../../entity/Dataset";
var exceltojson = require("xls-to-json-lc");
const fileUpload = require('express-fileupload');
var uniqid = require('uniqid');
var fs = require('fs');
let express = require("express")
let bodyParser = require("body-parser")
import {getConnection} from "typeorm";
import tokenInfo_customer from "../../../model/Token_Customer";
import Privilege from "../../../../services/Privilege";
import status_booking_Info from "../../../model/Status_Booking";
import status_equipment_Info from "../../../model/Status_Equipment";
let app = express.Router()
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(fileUpload());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/create',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "create-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let minute_feed = req.body.minute_feed
        if (!condition.two_values(req.body.device_number,minute_feed) ){
            res.status(400).json({
                statusName: '์No device_number or code'
            })
        }else {
            let equipmentdata = await equipmentInfo.showinfo(req.body.device_number)
            if (equipmentdata) {
                res.status(400).json({
                    statusName: '์There is already information.'
                })
            }else{
                let code = Math.floor(100000 + Math.random() * 900000);
                // var list_factor = JSON.parse(req.body.list_factor)
                let date = new Date()
                if (await equipmentInfo.create(req.body.device_number,code,minute_feed,req.body.description,employee_id,date) === false) {
                    res.status(400).json({
                        statusName: '์Recording failed'
                    })
                }
                res.status(200).json({
                    statusName: '์Recording successfull'
                })
            }
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

// app.post('/upload-test',async (req, res) => {
//     if (!req.files){
//         return res.status(400).send('No files were uploaded.');
//     }
//     const file = req.files.file;
//     const filename = req.files.file.name;
//     const fileName = uniqid();
//     file.mv('./uploads/' + fileName + '.xls', (err) => {
//         let data
//         if (err)
//             return res.status(500).send(err);
//         exceltojson(
//             {
//                 input: './uploads/' + fileName + '.xls', // input xls
//                 output: "Question_Key_xEng.json", // output json
//                 lowerCaseHeaders: true
//             },
//             async function (err, result) {
//                 if (err) {
//                     res.status(400).json({
//                         error: err,
//                     })
//                 } else {
//                     try {
//                         console.log("hi")
//                         data = result
//                         for (let i = 0; i < data.length; i++) {
//                             // var dateStr = JSON.parse(data[i]["timestamp"]);
//                             // var date = new Date(data[i]["timestamp"]);
//                             // console.log(date)
//                             // console.log(new Date(date.setHours(date.getHours() - 2)))
//                             let dataset = new Dataset()
//                             dataset.equip_id = data[i]["equip_id"]
//                             dataset.factor_1 = data[i]["value1"]
//                             dataset.factor_2 = data[i]["value2"]
//                             dataset.factor_3 = data[i]["value3"]
//                             dataset.factor_4 = data[i]["value4"]
//                             dataset.factor_5 = data[i]["value5"]
//                             dataset.factor_6 = data[i]["value6"]
//                             // var date = new Date(data[i]["timestamp"]);
//                             // dataset.timestamp = new Date(date.setHours(date.getHours() - 2))
//                             dataset.timestamp = new Date(data[i]["timestamp"]);
//                             await getConnection().getRepository(Dataset).save(dataset)
//                         }
//                         fs.unlink('./uploads/' + fileName + '.xls', function (err) {
//                             if (err) throw err;
//                             res.status(200).json({
//                                 statusName: 'success',
//                             })
//                             console.log('successfully deleted ' + './uploads/' + fileName + '.xls');
//                         });
//                     }
//                     catch(e){
//                         res.status(400).json({
//                             statusName: 'error datacolumn'
//                         })
//                     }
//                 }
//             }
//         )
//     });
// })

app.get('/etl_IOT',async (req, res) => {
    let date = req.body.date
    await equipmentInfo.test_auto(date)
    res.status(200).json({
        statusName: '์Recording successfull'
    })
})

app.get('/check_life_cycle',async (req, res) => {
    await equipmentInfo.check_life_cycle_5()
    res.status(200).json({
        statusName: '์Recording successfull'
    })
})

// app.get('/test1',async (req, res) => {
//     var json = "\"2020-06-20T11:14:21.493Z\"";
//     var dateStr = JSON.parse(json);
//     var date = new Date(dateStr);
//     let datetouse = new Date(date.setHours(date.getHours() - 2))
//
// })

app.post('/install-equipment',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "install-equipment-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let date = new Date()
        if (!condition.one_value(req.body.code) || !condition.one_value(req.body.fishpond_id)){
            res.status(400).json({
                statusName: '์No fishpond_id or code'
            })
        }
        if (await equipmentInfo.install_pond(req.body.code,req.body.fishpond_id,employee_id,date) === false) {
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
    let api_name = "edit-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let code = req.body.code
        let device_number = req.body.device_number
        let description = req.body.description
        let status_id = req.body.status_id
        var list_factor = JSON.parse(req.body.list_factor)
        let date = new Date()
        if ( !condition.three_values(device_number,code,description) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            let equipmentdata = await equipmentInfo.showinfo(device_number)
            if (!equipmentdata){
                res.status(400).json({
                    statusName: 'You do not have permission to edit.'
                })
            }else {
                if (await equipmentInfo.edit(code,device_number,description,employee_id,list_factor,date,status_id) === false) {
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

app.post('/history-iot',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let list_factor_id = req.body.list_factor_id
    if (!condition.one_value(list_factor_id)){
        res.status(400).json({
            statusName: 'No list_factor_id'
        })
    }
    if (!customer_id) {
        res.status(400).json({
            statusName: 'You do not have permission to check info.'
        })
    }else {
        let history_iot = await equipmentInfo.history_iot(customer_id,list_factor_id)
        res.status(200).json({
            statusName: 'success',
            history_iot: history_iot
        })
    }
})

app.post('/select-history-iot',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let list_factor_id = req.body.list_factor_id
    let number_date = parseInt(req.body.date)
    let resultdate = number_date+1
    let date = new Date()
    let datetouse = new Date(date.setDate(date.getDate() - resultdate))
    if (!condition.two_values(list_factor_id,number_date)){
        res.status(400).json({
            statusName: 'No list_factor_id'
        })
    }
    if (!customer_id) {
        res.status(400).json({
            statusName: 'You do not have permission to check info.'
        })
    }else {
        let history_iot = await equipmentInfo.select_history_iot(customer_id,list_factor_id,datetouse)
        res.status(200).json({
            statusName: 'success',
            history_iot: history_iot
        })
    }
})

app.post('/list-pond-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-pond-admin-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let fishpond_id = req.body.fishpond_id
        if (!condition.one_value(fishpond_id)){
            res.status(400).json({
                statusName: 'No fishpond_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let equipmentdata = await equipmentInfo.list_pond_admin(fishpond_id)
            res.status(200).json({
                statusName: 'success',
                equipmentdata: equipmentdata
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
    let api_name = "lists-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let equipmentList = await equipmentInfo.showall()
            res.status(200).json({
                statusName: 'success',
                equipmentList: equipmentList
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
    let api_name = "home-by-admin-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let status_list = await  status_equipment_Info.showall()
            let equipmentList = await equipmentInfo.home_list_equipments()
            res.status(200).json({
                statusName: 'success',
                status_list: status_list,
                equipmentList: equipmentList
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/lists-equipments',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-equipments-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!condition.one_value(req.body.status_id)){
            res.status(400).json({
                statusName: 'No status'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let status_list = await  status_equipment_Info.showall()
            let equipmentList = await equipmentInfo.list_equipments(req.body.status_id)
            res.status(200).json({
                statusName: 'success',
                status_list: status_list,
                equipmentList: equipmentList
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
    let api_name = "info-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let device_number = req.body.device_number
        if (!condition.one_value(device_number)){
            res.status(400).json({
                statusName: 'No device_number'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let equipmentdata = await equipmentInfo.showinfo(device_number)
            let list_factor = await equipmentInfo.list_factor_by_equipments(device_number)
            res.status(200).json({
                statusName: 'success',
                equipmentdata: equipmentdata,
                list_factor: list_factor
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/check-iot-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-equipment"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let device_number = req.body.device_number
        if (!condition.one_value(device_number)){
            res.status(400).json({
                statusName: 'No device_number'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let dataiot = await equipmentInfo.check_iot_by_admin(device_number)
            res.status(200).json({
                statusName: 'success',
                dataiot: dataiot
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