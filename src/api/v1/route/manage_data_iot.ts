import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import farmInfo from "../../../model/Farm";
import tokenInfo from "../../../model/Token_Customer";
import tokenInfo_employee from "../../../model/Token_Employee";
import specieInfo from "../../../model/Species";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import Privilege from "../../../../services/Privilege";
import tokenInfo_customer from "../../../model/Token_Customer";
import iotInfo from "../../../model/IOT";
import equipmentInfo from "../../../model/Equipment";
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

app.post('/select-real-time',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let pond_id = req.body.pond_id
    let list_factor = await equipmentInfo.list_factor_of_pond_customer(customer_id,pond_id)
    let port_id = req.body.port_id
    let result_unit = await equipmentInfo.check_unit_of_port(port_id)
    let factor_type = result_unit.factor_facterType
    let y_axis = result_unit.factor_y_axis
    let test = y_axis.split(",")
    let data_y = []
    for (let i =0;i<test.length;i++){
        data_y.push(parseFloat(test[i]))
    }
    let unit = result_unit.factor_unit
    let date = new Date()
    let result = await iotInfo.graph_realtime(port_id,date)
    res.status(200).json({
        statusName: '์success',
        list_factor:list_factor,
        y_axis:data_y,
        factor_type:factor_type,
        unit:unit,
        value_iot: result
    })

})

app.post('/home-graph',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let pond_id = req.body.pond_id
    let list_factor = await equipmentInfo.list_factor_of_pond_customer(customer_id,pond_id)
    let first_port = await equipmentInfo.getfirst_port(customer_id,pond_id)
    let date = new Date()
    let factor_type = first_port.factor_facterType
    let y_axis = first_port.factor_y_axis
    let test = y_axis.split(",")
    let data_y = []
    for (let i =0;i<test.length;i++){
        data_y.push(parseFloat(test[i]))
    }
    let unit = first_port.factor_unit
    let result = await iotInfo.graph_realtime(first_port.port_id,date)
    res.status(200).json({
        statusName: '์success',
        list_factor:list_factor,
        y_axis:data_y,
        factor_type:factor_type,
        unit: unit,
        value_iot: result,
    })
})

app.post('/home-etl',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let pond_id = req.body.pond_id
    let list_factor = await equipmentInfo.list_factor_of_pond_customer(customer_id,pond_id)
    let list_date = ["วัน","สัปดาห์","เดือน"]
    let first_port = await equipmentInfo.getfirst_port(customer_id,pond_id)
    // let date = new Date()
    let unit = first_port.factor_unit
    let factor_id = first_port.factor_id
    let factor_type = first_port.factor_facterType
    let y_axis = first_port.factor_y_axis
    let test = y_axis.split(",")
    let data_y = []
    for (let i =0;i<test.length;i++){
        data_y.push(parseFloat(test[i]))
    }
    var date_dataset = new Date("03-08-2020")
    let result = await equipmentInfo.list_value_etl(pond_id,factor_id,date_dataset)
    let data_all = []
    for (let j =0;j<result.length;j++){
        let time = result[j].time_dim_date_data
        let time_date = new Date(time)
        data_all.push({
            time: time_date.toLocaleTimeString(),
            dayone: result[j].fact_fish_pond_value_avg,
        })
    }
    res.status(200).json({
        statusName: '์success',
        list_factor:list_factor,
        y_axis:data_y,
        factor_type:factor_type,
        unit: unit,
        list_date: list_date,
        data_graph:data_all
    })
})

app.post('/select-etl',checkToken,async (req, res) => {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let pond_id = req.body.pond_id
    let list_factor = await equipmentInfo.list_factor_of_pond_customer(customer_id,pond_id)
    let port_id = req.body.port_id
    let type_date = req.body.type_date
    let list_date = ["วัน","ช่วงวัน","เดือน"]
    let factor = await equipmentInfo.check_unit_of_port(port_id)
    let factor_type = factor.factor_facterType
    let y_axis = factor.factor_y_axis
    let test = y_axis.split(",")
    let data_y = []
    for (let i =0;i<test.length;i++){
        data_y.push(parseFloat(test[i]))
    }
    let unit = factor.factor_unit
    let factor_id = factor.factor_id
    if (type_date == "วัน"){
        let date_one_value = req.body.date_one
        let date_one = new Date(date_one_value)
        let date_two_value = req.body.date_two
        let date_two = new Date(date_two_value)
        // let date = new Date()
        // var date_dataset_1 = new Date("03-07-2020")
        var date_dataset_1 = date_one
        var date_dataset_2 = date_two
        let value_iot_1 = await equipmentInfo.list_value_etl(pond_id,factor_id,date_dataset_1)
        let value_iot_2 = await equipmentInfo.list_value_etl(pond_id,factor_id,date_dataset_2)
        let data_all = []
        for (let j =0;j<value_iot_1.length;j++){
            let time = value_iot_1[j].time_dim_date_data
            let time_date = new Date(time)
            data_all.push({
                time: time_date.toLocaleTimeString(),
                dayone: value_iot_1[j].fact_fish_pond_value_avg,
                daytwo: value_iot_2[j].fact_fish_pond_value_avg,
            })
        }
        res.status(200).json({
            statusName: '์success',
            list_factor:list_factor,
            y_axis: data_y,
            factor_type: factor_type,
            unit: unit,
            list_date: list_date,
            data_graph: data_all
            // value_iot_1: value_iot_1,
            // value_iot_2: value_iot_2,
        })
    } else if (type_date == "ช่วงวัน"){
        let date_one_value = req.body.date_one
        let date_one = new Date(date_one_value)
        // console.log(date_one.getDate())
        // console.log(date_one.getMonth())
        let date_two_value = req.body.date_two
        let date_two = new Date(date_two_value)
        // console.log(date_two.getMonth())
        let date_three_value = req.body.date_three
        let date_three = new Date(date_three_value)
        let date_four_value = req.body.date_four
        let date_four = new Date(date_four_value)
        let value_iot_1 = await equipmentInfo.list_value_etl_week(pond_id,factor_id,date_one,date_two)
        let value_iot_2 = await equipmentInfo.list_value_etl_week(pond_id,factor_id,date_three,date_four)
        let data_all = []
        // console.log(value_iot_1[0].test)
        for (let j =0;j<value_iot_1.length;j++){
            let time = value_iot_1[j].time_dim_date_data
            let time_date_one = new Date(time)
            let time_two = value_iot_1[j].time_dim_date_data
            let time_date_two = new Date(time_two)
            data_all.push({
                time: j+1,
                time_one: time_date_one.toLocaleDateString(),
                dayone: value_iot_1[j].avg.toFixed(1),
                time_two: time_date_two.toLocaleDateString(),
                daytwo: value_iot_2[j].avg.toFixed(1),
            })
        }
        res.status(200).json({
            statusName: '์success',
            list_factor:list_factor,
            y_axis: data_y,
            factor_type: factor_type,
            unit: unit,
            list_date: list_date,
            data_graph: data_all
        })
    } else if (type_date == "เดือน"){
        let year = req.body.year
        let month_one = req.body.month_one
        let month_two = req.body.month_two
        let value_iot_1 = await equipmentInfo.list_value_etl_month(pond_id,factor_id,year,month_one)
        let value_iot_2 = await equipmentInfo.list_value_etl_month(pond_id,factor_id,year,month_two)
        let data_all = []
        // console.log(value_iot_1[0].test)
        for (let j =0;j<value_iot_1.length;j++){
            let time = value_iot_1[j].time_dim_date_data
            let time_date_one = new Date(time)
            let time_two = value_iot_2[j].time_dim_date_data
            let time_date_two = new Date(time_two)
            data_all.push({
                time: j+1,
                time_one: time_date_one.toLocaleDateString(),
                dayone: value_iot_1[j].avg.toFixed(1),
                time_two: time_date_two.toLocaleDateString(),
                daytwo: value_iot_2[j].avg.toFixed(1),
            })
        }
        res.status(200).json({
            statusName: '์success',
            list_factor:list_factor,
            y_axis: data_y,
            factor_type: factor_type,
            unit: unit,
            list_date: list_date,
            data_graph: data_all
        })
    }
})

app.post('/edit',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "edit-specie"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let specie_id = req.body.specie_id
        let speciename = req.body.name
        let description = req.body.description
        let date = new Date()
        if ( !condition.one_value(specie_id) || !condition.one_value(speciename) ){
            res.status(400).json({
                statusName: 'edit failed'
            })
        }else {
            let speciedata = await specieInfo.showinfo(specie_id)
            if (!speciedata){
                res.status(400).json({
                    statusName: 'You do not have permission to edit.'
                })
            }else {
                if (await specieInfo.edit(speciename,description,employee_id,specie_id,date) === false) {
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

app.get('/lists',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "lists-specie"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to lists.'
            })
        }else {
            let specieList = await specieInfo.showall()
            res.status(200).json({
                statusName: 'success',
                specielist: specieList
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
    let api_name = "info-specie"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let specie_id = req.body.specie_id
        if (!condition.one_value(specie_id)){
            res.status(400).json({
                statusName: 'No specie_id'
            })
        }
        if (!employee_id) {
            res.status(400).json({
                statusName: 'You do not have permission to check info.'
            })
        }else {
            let speciedata = await specieInfo.showinfo(specie_id)
            res.status(200).json({
                statusName: 'success',
                farmdata: speciedata
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