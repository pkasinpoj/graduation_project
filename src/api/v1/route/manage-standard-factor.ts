// import "reflect-metadata";
// import checkToken from "../../../../middleware/checktoken";
// import condition from "../../../../services/condition";
// import farmInfo from "../../../model/Farm";
// import tokenInfo from "../../../model/Token_Customer";
// import tokenInfo_employee from "../../../model/Token_Employee";
// import checkToken_Employee from "../../../../middleware/checktoken_employee";
// import equipmentInfo from "../../../model/Equipment";
// var exceltojson = require("xls-to-json-lc");
// const fileUpload = require('express-fileupload');
// var uniqid = require('uniqid');
// var fs = require('fs');
// let express = require("express")
// let bodyParser = require("body-parser")
// import Privilege from "../../../../services/Privilege";
// import standard_factorinfo from "../../../model/Standard_Factor";
// let app = express.Router()
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
// app.use(fileUpload());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))
//
// app.post('/create',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "create-standard-factor"
//     let checkprivilege = await Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let standard_name = req.body.standard_name
//         let max_danger_value = req.body.max_danger_value
//         let min_danger_value = req.body.min_danger_value
//         if (max_danger_value == "" ){
//             max_danger_value = 10000
//         } else if(min_danger_value == ""){
//             min_danger_value = -1
//         }
//         let min = req.body.min
//         let max = req.body.max
//         console.log(min)
//         let description = req.body.description
//         if (!condition.two_values(standard_name,min) || !condition.one_value(max)){
//             res.status(400).json({
//                 statusName: '์No standard_name or factor_id'
//             })
//         }
//             let date = new Date
//             if (await standard_factorinfo.create(standard_name,description,max_danger_value,min_danger_value,min,max,employee_id,date) === false) {
//                 res.status(400).json({
//                     statusName: '์Recording failed'
//                 })
//             }
//             res.status(200).json({
//                 statusName: '์Recording successfull'
//             })
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.post('/edit',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "edit-equipment"
//     let checkprivilege = await Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let code = req.body.code
//         let device_number = req.body.device_number
//         let description = req.body.description
//         let status_id = req.body.status_id
//         var list_factor = JSON.parse(req.body.list_factor)
//         let date = new Date()
//         if ( !condition.three_values(device_number,code,description) ){
//             res.status(400).json({
//                 statusName: 'edit failed'
//             })
//         }else {
//             let equipmentdata = await equipmentInfo.showinfo(device_number)
//             if (!equipmentdata){
//                 res.status(400).json({
//                     statusName: 'You do not have permission to edit.'
//                 })
//             }else {
//                 if (await equipmentInfo.edit(code,device_number,description,employee_id,list_factor,date,status_id) === false) {
//                     res.status(400).json({
//                         statusName: '์Recording failed'
//                     })
//                 }
//                 res.status(200).json({
//                     statusName: 'edit successfull'
//                 })
//             }
//         }
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.get('/lists',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "lists-standard-factor"
//     let checkprivilege = await Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         if (!employee_id) {
//             res.status(400).json({
//                 statusName: 'You do not have permission to lists.'
//             })
//         }else {
//             let standard_factorList = await standard_factorinfo.showall()
//             res.status(200).json({
//                 statusName: 'success',
//                 standard_factorList: standard_factorList
//             })
//         }
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.post('/info',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "info-standard-factor"
//     let checkprivilege = await Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let standard_id = req.body.standard_id
//         if (!condition.one_value(standard_id)){
//             res.status(400).json({
//                 statusName: 'No standard_id'
//             })
//         }
//         if (!employee_id) {
//             res.status(400).json({
//                 statusName: 'You do not have permission to check info.'
//             })
//         }else {
//             let standard_info = await standard_factorinfo.showinfo(standard_id)
//             res.status(200).json({
//                 statusName: 'success',
//                 standard_info: standard_info,
//             })
//         }
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.post('/delete',checkToken,async (req, res) => {
//     let customer_id = await tokenInfo.checkInfoCustomers(req.headers['authorization'])
//     let farm_id = req.body.farm_id
//     if (!condition.one_value(farm_id)){
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
// export default app