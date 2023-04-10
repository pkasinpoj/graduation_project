import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import serviceInfo from "../../../model/Service";
import tokenInfo_customer from "../../../model/Token_Customer";
import Privilege from "../../../../services/Privilege";
import status_equipment_Info from "../../../model/Status_Equipment";
import equipmentInfo from "../../../model/Equipment";
import serviceTypeInfo from "../../../model/Service_Type";
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
    let api_name = "create-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let date = new Date()
        if (!condition.two_values(req.body.name,req.body.type_id)){
            res.status(400).json({
                statusName: '์No name or type_id'
            })
        }
        if (await serviceInfo.create(req.body.name,req.body.description,req.body.type_id,employee_id,date) === false) {
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
    let api_name = "edit-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let date = new Date()
        let service_id = req.body.service_id
        let name = req.body.name
        let description = req.body.description
        if ( !condition.two_values(service_id,name) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            let servicedata = await serviceInfo.showinfo(service_id)
            if (!servicedata){
                res.status(400).json({
                    statusName: 'You do not have permission to edit.'
                })
            }else {
                if (await serviceInfo.edit(service_id,name,description,employee_id,date) === false) {
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

app.post('/service-list-customer',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    if ( !condition.one_value(req.body.type_id) ){
        res.status(400).json({
            statusName: 'No type_id'
        })
    }
    if (!customer_id) {
        res.status(400).json({
            statusName: 'You do not have permission to service-list.'
        })
    }else {
        let serviceList = await serviceInfo.showlist_type(req.body.type_id)
        res.status(200).json({
            statusName: 'success',
            serviceList: serviceList
        })
    }
})

app.post('/service-list-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "service-list-admin-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if ( !condition.one_value(req.body.type_id) ){
            res.status(400).json({
                statusName: 'No type_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to service-list.'
            })
        }else {
            let serviceList = await serviceInfo.showlist_type(req.body.type_id)
            res.status(200).json({
                statusName: 'success',
                serviceList: serviceList
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
    let api_name = "lists-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let serviceList = await serviceInfo.showall()
            res.status(200).json({
                statusName: 'success',
                serviceList: serviceList
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
            let service_type_list = await  serviceTypeInfo.showall()
            let service_list = await serviceInfo.home_list_service()
            res.status(200).json({
                statusName: 'success',
                service_type_list: service_type_list,
                service_list: service_list
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/info-by-customer',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let service_id = req.body.service_id
    if (!condition.one_value(service_id)){
        res.status(400).json({
            statusName: 'No service_id'
        })
    }
    if (!customer_id) {
        res.status(400).json({
            statusName: 'You do not have permission to check info.'
        })
    }else {
        let servicedata = await serviceInfo.showinfo(service_id)
        res.status(200).json({
            statusName: 'success',
            servicedata: servicedata
        })
    }
})

app.post('/info-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-by-admin-service"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let service_id = req.body.service_id
        if (!condition.one_value(service_id)){
            res.status(400).json({
                statusName: 'No service_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let servicedata = await serviceInfo.showinfo(service_id)
            res.status(200).json({
                statusName: 'success',
                servicedata: servicedata
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