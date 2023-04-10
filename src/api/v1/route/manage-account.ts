import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
var exceltojson = require("xls-to-json-lc");
const fileUpload = require('express-fileupload');
var uniqid = require('uniqid');
var fs = require('fs');
let express = require("express")
let bodyParser = require("body-parser")
import {getConnection} from "typeorm";
import Privilege from "../../../../services/Privilege";
import accountTypeInfo from "../../../model/Account_Type";
import {Account_Privilege} from "../../../entity/Account_Privilege";
import privilegeInfo from "../../../model/Account_Privilege";
import accountInfo from "../../../model/Account";
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

app.post('/select-account-type',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "create-account-type"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let employeeId = req.body.employee_id
        let account_type_id = req.body.account_type_id
        if (!condition.two_values(employeeId,account_type_id) ){
            res.status(400).json({
                statusName: '์No employeeId or account_type_id'
            })
        }
        let date = new Date()
        if (await accountInfo.select_account_type(employeeId,account_type_id,employee_id,date) === false) {
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