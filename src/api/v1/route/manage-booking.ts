import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import tokenService from "../../../../services/tokenservices";
import accountService from "../../../../services/accountservice";
import employeeInfo from "../../../model/Employee";
import tokenInfo_employee from "../../../model/Token_Employee";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import accountInfo from "../../../model/Account";
import tokenInfo_customer from "../../../model/Token_Customer";
import customerInfo from "../../../model/Customer";
import bookingInfo from "../../../model/Booking";
import pondInfo from "../../../model/FishPond";
import Privilege from "../../../../services/Privilege";
import status_booking_Info from "../../../model/Status_Booking";
import accessorryrequisitionInfo from "../../../model/Accessory_Requisition_List";
import farmInfo from "../../../model/Farm";
import equipmentInfo from "../../../model/Equipment";
import positionInfo from "../../../model/Position";
import serviceTypeInfo from "../../../model/Service_Type";
import serviceInfo from "../../../model/Service";
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

app.post('/create-by-customer',checkToken,async (req, res) => {
    let account_id = await tokenInfo_customer.checkInfoCustomersAccount(req.headers['authorization'])
    let customer_id = await tokenInfo_customer.checkInfoCustomers(req.headers['authorization'])
    let fishpond_id = req.body.fishpond_id
    let fishpond_data = await pondInfo.showinfo(customer_id,fishpond_id)
    if (!fishpond_data){
        res.status(400).json({
            statusName: 'You do not have permission to edit.'
        })
    }else {
        let date = new Date()
        let description = req.body.description
        var service = JSON.parse(req.body.service);
        await bookingInfo.create_by_customer(service,description,account_id,fishpond_id,date)
        res.status(200).json({
            statusName: 'Success',
        })
    }
})

app.get('/list-booking',checkToken, async (req, res) => {
    let account_id = await tokenInfo_customer.checkInfoCustomersAccount(req.headers['authorization'])
    let result = await bookingInfo.list_booking(account_id)
    if (!result){
        res.status(400).json({
            statusName: 'You do not have permission to list.'
        })
    }
    res.status(200).json({
        statusName: 'Success',
        list_booking: result
    })

})

app.post('/show-booking',checkToken, async (req, res) => {
    let account_id = await tokenInfo_customer.checkInfoCustomersAccount(req.headers['authorization'])
    let booking_id = req.body.booking_id
    let booking_info = await bookingInfo.showinfo_booking(account_id,booking_id)
    if (!booking_info){
        res.status(400).json({
            statusName: 'You do not have permission to check.'
        })
    }
    let service_of_booking = await bookingInfo.showinfo_service_in_booking(account_id,booking_id)
    if (!service_of_booking){
        res.status(400).json({
            statusName: 'Found some problems.'
        })
    }
    res.status(200).json({
        statusName: 'Success',
        booking_info: booking_info,
        service_of_booking: service_of_booking
    })
})

app.post('/confirm-booking-by-customer',checkToken, async (req, res) => {
    let account_id = await tokenInfo_customer.checkInfoCustomersAccount(req.headers['authorization'])
    let booking_id = req.body.booking_id
    let booking_info = await bookingInfo.showinfo_booking(account_id,booking_id)
    if (!booking_info){
        res.status(400).json({
            statusName: 'You do not have permission to check.'
        })
    }
    let service_of_booking = await bookingInfo.confirm_booking_by_customer(booking_id)
    if (!service_of_booking){
        res.status(400).json({
            statusName: 'Found some problems.'
        })
    }
    res.status(200).json({
        statusName: 'Success',
    })
})

app.post('/create-by-admin',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "create-by-admin-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        // let customer_id = req.body.customer_id
        // let account_id = await accountInfo.info_customer(customer_id)
        // let account_id = await accountInfo.info_employee(employee_id)
        let fishpond_id = req.body.fishpond_id
        // let fishpond_data = await pondInfo.showinfo(customer_id,fishpond_id)
        // if (!fishpond_data){
        //     res.status(400).json({
        //         statusName: 'You do not have permission to edit.'
        //     })
        // }
        let date = new Date()
        let description = req.body.description
        var service = JSON.parse(req.body.service);
        // let work_date = new Date()
        let list_employee_for_work = JSON.parse(req.body.list_employee_id)
        let input = req.body.work_date
        let work_date = new Date(input);
        // let work_date = req.body.work_date
        await bookingInfo.create_by_admin(service,description,fishpond_id,date,employee_id,work_date,list_employee_for_work)
        res.status(200).json({
            statusName: 'Success',
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/list-status-booking-by-admin',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-status-booking-by-admin-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let status_id = req.body.status_id
   if (checkprivilege){
       let list_booking = await bookingInfo.list_status_booking_by_admin(status_id)
       if (!list_booking){
           res.status(400).json({
               statusName: 'Found some problems.'
           })
       }
       let list_status = await status_booking_Info.showall()
       res.status(200).json({
           statusName: 'Success',
           list_status: list_status,
           list_booking: list_booking,
       })
   } else {
       res.status(400).json({
           statusName: 'You dont have permission'
       })
   }
})

app.post('/info-booking-by-admin',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "info-booking-by-admin-by-admin-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let booking_id = req.body.booking_id
        let booking_info = await bookingInfo.showinfo_booking_by_admin(booking_id)
        if (!booking_info){
            res.status(400).json({
                statusName: 'You do not have permission to check.'
            })
        }
        let service_of_booking = await bookingInfo.showinfo_service_in_booking_by_admin(booking_id)
        if (!service_of_booking){
            res.status(400).json({
                statusName: 'Found some problems.'
            })
        }
        let list_employee_for_work = await bookingInfo.list_employee_for_work(booking_id)
        let list_accessorry = await accessorryrequisitionInfo.list_accessorry_by_booking(booking_id)
        res.status(200).json({
            statusName: 'Success',
            booking_info: booking_info,
            service_of_booking: service_of_booking,
            list_employee_for_work: list_employee_for_work,
            list_accessorry:list_accessorry

        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

// app.get('/home-dashboard-by-admin',checkToken_Employee, async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "shome-dashboard-by-admin"
//     let checkprivilege = await Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let list_booking_today =  await bookingInfo.list__booking_on_today()
//         let list_booking_tomorrow =  await bookingInfo.list__booking_on_tomorrow()
//         let booking_in_progress = await bookingInfo.list_booking_in_progress_by_admin(list_booking_today)
//         //     // let work_date = new Date()
//         //     let list_employee_for_work = JSON.parse(req.body.list_employee_id)
//         //
//         //     // let work_date = req.body.work_date
//         //     let schedule_booking = await bookingInfo.schedule_booking_by_admin(booking_id,work_date,list_employee_for_work,date,employee_id)
//         //     if (!schedule_booking){
//         //         res.status(400).json({
//         //             statusName: 'Found some problems.'
//         //         })
//         //     }
//         //     res.status(200).json({
//         //         statusName: 'Success',
//         //     })
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })

app.post('/schedule-booking-by-admin',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "schedule-booking-by-admin"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let booking_id = req.body.booking_id
        let booking_info = await bookingInfo.showinfo_booking_by_admin(booking_id)
        if (!booking_info){
            res.status(400).json({
                statusName: 'You do not have permission to check.'
            })
        }else{
            let input = req.body.work_date
            let work_date = new Date(input);
            // let work_date = new Date()
            let list_employee_for_work = JSON.parse(req.body.list_employee_id)
            let date = new Date()
            // let work_date = req.body.work_date
            let schedule_booking = await bookingInfo.schedule_booking_by_admin(booking_id,work_date,list_employee_for_work,date,employee_id)
            if (!schedule_booking){
                res.status(400).json({
                    statusName: 'Found some problems.'
                })
            }
            res.status(200).json({
                statusName: 'Success',
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/list-booking-by-status-of-employee',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "list-booking-by-status-of-employee-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    let status_id = req.body.status_id
    if (checkprivilege){
        let list_booking_of_employee = await bookingInfo.list_booking_by_status_of_employee(status_id,employee_id)
        if (!list_booking_of_employee){
            res.status(400).json({
                statusName: 'Found some problems.'
            })
        }
        let list_status = await status_booking_Info.showall_by_employee()
        res.status(200).json({
            statusName: 'Success',
            list_status: list_status,
            list_booking: list_booking_of_employee,
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/get-dropdown-for-create',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "get-dropdown-for-create-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let fishpond_id = req.body.fishpond_id
        let service_type_list = await serviceTypeInfo.showall()
        let service_type_id = Array()
        for (let i =0;i<service_type_list.length;i++){
            service_type_id.push(service_type_list[i].id)
        }
        let data_service = await serviceInfo.list_service_by_type(service_type_id)
        let k = 0;
        let dataservice = []
        service_type_list.forEach((value, index) => {
            dataservice.push({
                ...value,
                list_service: Object.assign(data_service[k++])
            })
        })
        let position_list = await positionInfo.showall()
        let position_id = Array()
        for (let i =0;i<position_list.length;i++){
            position_id.push(position_list[i].id)
        }
        let data_employee = await positionInfo.list_employee_by_position(position_id)
        let j = 0;
        let data = []
        position_list.forEach((value, index) => {
            data.push({
                ...value,
                list_employee: Object.assign(data_employee[j++])
            })
        })
        res.status(200).json({
            statusName: 'success',
            service_list:dataservice,
            position_list:data,
            fishpond_id: fishpond_id
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})


app.get('/get-dropdown-list-employee',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "get-dropdown-list-employee-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let position_list = await positionInfo.showall()
        let position_id = Array()
        for (let i =0;i<position_list.length;i++){
            position_id.push(position_list[i].id)
        }
        let data_employee = await positionInfo.list_employee_by_position(position_id)
        let j = 0;
        let data = []
        position_list.forEach((value, index) => {
            data.push({
                ...value,
                list_employee: Object.assign(data_employee[j++])
            })
        })
        res.status(200).json({
            statusName: 'success',
            position_list:data
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/home-schedule-booking-by-admin',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "home-schedule-booking-by-admin-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let list_booking = await bookingInfo.home_schedule_booking()
        if (!list_booking){
            res.status(400).json({
                statusName: 'Found some problems.'
            })
        }
        let list_status = await status_booking_Info.showall()
        res.status(200).json({
            statusName: 'Success',
            list_status: list_status,
            list_booking: list_booking,
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.get('/home-schedule-booking-of-employee',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "home-schedule-booking-of-employee-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let list_booking = await bookingInfo.home_schedule_booking_of_employee(employee_id)
        if (!list_booking){
            res.status(400).json({
                statusName: 'Found some problems.'
            })
        }
        let list_status = await status_booking_Info.showall_by_employee()
        res.status(200).json({
            statusName: 'Success',
            list_status: list_status,
            list_booking: list_booking,
        })
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

app.post('/confirm-booking-by-employee',checkToken_Employee, async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
    let api_name = "confirm-booking-by-employee-booking"
    let checkprivilege = await Privilege.check(employee_id,api_name)
    if (checkprivilege){
        let booking_id = req.body.booking_id
        let booking_info = await bookingInfo.showinfo_booking_by_admin(booking_id)
        if (booking_info.status_booking_status != "ยืนยันการใช้บริการ"){
            res.status(400).json({
                statusName: 'ลูกค้ายังไม่ได้ยืนยันการใช้บริการ'
            })
        }else {
            let service_of_booking = await bookingInfo.confirm_booking_by_employee(booking_id)
            if (!service_of_booking){
                res.status(400).json({
                    statusName: 'Found some problems.'
                })
            }
            res.status(200).json({
                statusName: 'Success',
            })
        }
    } else {
        res.status(400).json({
            statusName: 'You dont have permission'
        })
    }
})

// app.post('/check-job-queue-of-employee',checkToken_Employee, async (req, res) => {
//     let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
//     let api_name = "check-job-queue-of-employee-booking"
//     let checkprivilege = Privilege.check(employee_id,api_name)
//     if (checkprivilege){
//         let date = new Date()
//         // let date = req.body.date
//         console.log(date)
//         // let booking_id = req.body.booking_id
//         // let booking_info = await bookingInfo.showinfo_booking_by_admin(booking_id)
//         // if (booking_info.status_booking_status != "ยืนยันการใช้บริการ"){
//         //     res.status(400).json({
//         //         statusName: 'ลูกค้ายังไม่ได้ยืนยันการใช้บริการ'
//         //     })
//         // }else {
//         //     let service_of_booking = await bookingInfo.confirm_booking_by_employee(booking_id)
//         //     if (!service_of_booking){
//         //         res.status(400).json({
//         //             statusName: 'Found some problems.'
//         //         })
//         //     }
//         //     res.status(200).json({
//         //         statusName: 'Success',
//         //     })
//         // }
//     } else {
//         res.status(400).json({
//             statusName: 'You dont have permission'
//         })
//     }
// })

app.post('/test', async (req, res) => {
   let input = req.body.date
    let date = new Date(input);
   console.log(date)
})

export default app