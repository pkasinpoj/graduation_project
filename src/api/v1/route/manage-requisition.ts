// import "reflect-metadata";
// import checkToken from "../../../../middleware/checktoken";
// import condition from "../../../../services/condition";
// import farmInfo from "../../../model/Farm";
// import tokenInfo from "../../../model/Token_Customer";
// import tokenInfo_employee from "../../../model/Token_Employee";
// import checkToken_Employee from "../../../../middleware/checktoken_employee";
// import accessoryInfo from "../../../model/Accessory";
// import Privilege from "../../../../services/Privilege";
// import requisitionInfo from "../../../model/Requisition";
// let express = require("express")
// let bodyParser = require("body-parser")
// let app = express.Router()
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))
//
// app.post('/create',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let account_id = await tokenInfo_employee.checkInfoEmployeeAccount(req.headers['authorization'])
//     let api_name = "create-requisition"
//     let checkprivilege = Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let date = new Date()
//         let list_accessorry = req.body.list_accessorry
//         if (!condition.two_values(req.body.name,list_accessorry)){
//             res.status(400).json({
//                 statusName: '์No name or balance'
//             })
//         }
//         if (await requisitionInfo.create(req.body.name,req.body.description,account_id,employee_id,date,list_accessorry) === false) {
//             res.status(400).json({
//                 statusName: '์Recording failed'
//             })
//         }
//         res.status(200).json({
//             statusName: '์Recording successfull'
//         })
//
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.post('/return-requisition',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "return-requisition"
//     let checkprivilege = Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let requisition_id = req.body.requisition
//         let date = new Date()
//               let result =  await requisitionInfo.return_requisition(date,requisition_id,employee_id) === false
//                 res.status(200).json({
//                     statusName: 'return successfull'
//                 })
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })
//
// app.get('/requisition-list',checkToken_Employee,async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "requisition-list-requisition"
//     let checkprivilege = Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         if (!employee_id) {
//             res.status(400).json({
//                 statusName: 'You do not have permission to Accessory-List.'
//             })
//         }else {
//             let requisitionList = await requisitionInfo.showall()
//             res.status(200).json({
//                 statusName: 'success',
//                 requisitionList: requisitionList
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
//     let api_name = "info-requisition"
//     let checkprivilege = Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let requisition_id = req.body.requisition_id
//         if (!condition.one_value(requisition_id)){
//             res.status(400).json({
//                 statusName: 'No requisition_id'
//             })
//         }
//         if (!employee_id) {
//             res.status(400).json({
//                 statusName: 'You do not have permission to check info.'
//             })
//         }else {
//             let accessorydata = await requisitionInfo.showinfo(requisition_id)
//             res.status(200).json({
//                 statusName: 'success',
//                 accessorydata: accessorydata
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