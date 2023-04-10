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
    let api_name = "create-account-type"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let typename = req.body.typename
        let description = req.body.description
        if (!condition.two_values(typename,req.body.list_privilege) ){
            res.status(400).json({
                statusName: '์No typename or list_privilege'
            })
        }
        var list_privilege = JSON.parse(req.body.list_privilege)
        let date = new Date()
        if (await accountTypeInfo.create(typename,description,list_privilege,employee_id,date) === false) {
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
    let api_name = "edit-account-type"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let typename = req.body.typename
        let description = req.body.description
        let account_type_id = req.body.account_type_id
        if (!condition.three_values(typename,req.body.list_privilege,account_type_id) ){
            res.status(400).json({
                statusName: '์No typename or list_privilege'
            })
        }
        var list_privilege = JSON.parse(req.body.list_privilege)
        let date = new Date()
        if (await accountTypeInfo.edit(account_type_id,typename,description,list_privilege,employee_id,date) === false) {
            res.status(400).json({
                statusName: 'edit failed'
            })
        }
        res.status(200).json({
            statusName: 'edit successfull'
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/list-account-type',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-account-type"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let result = await accountTypeInfo.showall()
        if (!result) {
            res.status(400).json({
                statusName: 'Data not Found'
            })
        }
        res.status(200).json({
            statusName: 'success',
            list_account_type: result

        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/info',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-account-type"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let account_type_id = req.body.account_type_id
        if (!condition.one_value(account_type_id)) {
            res.status(400).json({
                statusName: 'no account_type_id'
            })
        }else {
            let info_account_type = await accountTypeInfo.showinfo(account_type_id)
            let list_privilege = await accountTypeInfo.list_privilege_of_account_type(account_type_id)
            if (!info_account_type || !list_privilege) {
                res.status(400).json({
                    statusName: 'Data not Found'
                })
            }
            res.status(200).json({
                statusName: 'success',
                info_account_type: info_account_type,
                list_privilege:list_privilege

            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})


app.post('/upload-privilege',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    if (!employee_id){
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    } else {
        if (!req.files){
            return res.status(400).send('No files were uploaded.');
        }
        const file = req.files.file;
        const filename = req.files.file.name;
        const fileName = uniqid();
        file.mv('./uploads/' + fileName + '.xls', (err) => {
            let data
            if (err)
                return res.status(500).send(err);
            exceltojson(
                {
                    input: './uploads/' + fileName + '.xls', // input xls
                    output: "Question_Key_xEng.json", // output json
                    lowerCaseHeaders: true
                },
                async function (err, result) {
                    if (err) {
                        res.status(400).json({
                            error: err,
                        })
                    } else {
                        try {
                            data = result
                            let date = new Date()
                            for (let i = 0; i < data.length; i++) {
                                // var dateStr = JSON.parse(data[i]["timestamp"]);
                                // var date = new Date(data[i]["timestamp"]);
                                // console.log(date)
                                // console.log(new Date(date.setHours(date.getHours() - 2)))
                                let account_privilege = new Account_Privilege()
                                account_privilege.menuPath = data[i]["menu_path"]
                                account_privilege.description = data[i]["description"]
                                account_privilege.status = true
                                account_privilege.created_date = date
                                account_privilege.created_by = employee_id
                                await getConnection().getRepository(Account_Privilege).save(account_privilege)
                            }
                            fs.unlink('./uploads/' + fileName + '.xls', function (err) {
                                if (err) throw err;
                                res.status(200).json({
                                    statusName: 'success',
                                })
                                console.log('successfully deleted ' + './uploads/' + fileName + '.xls');
                            });
                        }
                        catch(e){
                            res.status(400).json({
                                statusName: 'error datacolumn'
                            })
                        }
                    }
                }
            )
        });
    }
})

app.get('/list-privilege',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-privilege"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let result = await privilegeInfo.showall()
        if (!result) {
            res.status(400).json({
                statusName: 'Data not Found'
            })
        }
        res.status(200).json({
            statusName: 'success',
            list_privilege: result

        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/test_create_account_type',async (req, res) => {
   await accountTypeInfo.test_create_account_type()
    console.log("success")
})

// app.get('/test1',async (req, res) => {
//     var json = "\"2020-06-20T11:14:21.493Z\"";
//     var dateStr = JSON.parse(json);
//     var date = new Date(dateStr);
//     let datetouse = new Date(date.setHours(date.getHours() - 2))
//
// }

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