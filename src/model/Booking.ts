import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Equipments} from "../entity/Equipments";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Booking} from "../entity/Booking";
import {Account} from "../entity/Account";
import {Service_List} from "../entity/Service_List";
import {Service} from "../entity/Service";
import {Status_Booking} from "../entity/Status_Booking";
import {Service_Employee_List} from "../entity/Service_Employee_List";
import {Employee} from "../entity/Employee";
import {Booking_Type} from "../entity/Booking_Type";

let bookingInfo = {
    create_by_customer : async (service,description,account_id,pond_id,date) => {
        try {
                let booking = new Booking()
                booking.name = "จองใช้บริการ"
                booking.description = description
                booking.status_booking = await getConnection().getRepository(Status_Booking).findOne({status:"ทำการจอง"})
                booking.booking_type = await getConnection().getRepository(Booking_Type).findOne({type_name:"Booking"})
                booking.created_date = date
                booking.updated_date = date
                booking.account = await getConnection().getRepository(Account).findOne({id:account_id})
                booking.fish_pond = await getConnection().getRepository(Fish_Pond).findOne({id:pond_id})
                await getConnection().getRepository(Booking).save(booking)
                for (let i = 0;i<service.length;i++){
                let service_list = new Service_List()
                    service_list.booking = await getConnection().getRepository(Booking).findOne({id:booking.id})
                    service_list.service = await getConnection().getRepository(Service).findOne({id:service[i]})
                    await getConnection().getRepository(Service_List).save(service_list)
                }
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    create_by_admin : async (service,description,fishpond_id,date,employee_id,work_date,list_employee_for_work) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["account.id"])
                .from(Fish_Pond, "fish_pond")
                .innerJoin("fish_pond.farm", "farm")
                .innerJoin("farm.customer", "customer")
                .innerJoin("customer.account", "account")
                .where("account.status = true ")
                .getRawOne();
            let data = JSON.parse(JSON.stringify(result))
            let booking = new Booking()
            booking.name = "รอใช้บริการ"
            booking.description = description
            booking.status_booking = await getConnection().getRepository(Status_Booking).findOne({status:"รอทำการลงพื้นที่"})
            booking.created_date = date
            booking.updated_date = date
            booking.created_by = employee_id
            booking.updated_by = employee_id
            booking.work_date = work_date
            booking.account = await getConnection().getRepository(Account).findOne({id:data.account_id})
            booking.fish_pond = await getConnection().getRepository(Fish_Pond).findOne({id:fishpond_id})
            await getConnection().getRepository(Booking).save(booking)
            for (let i = 0;i<service.length;i++){
                let service_list = new Service_List()
                service_list.booking = await getConnection().getRepository(Booking).findOne({id:booking.id})
                service_list.service = await getConnection().getRepository(Service).findOne({id:service[i]})
                await getConnection().getRepository(Service_List).save(service_list)
            }
            for (let j = 0;j<list_employee_for_work.length;j++){
                let service_employee_list = new Service_Employee_List()
                service_employee_list.booking = await getConnection().getRepository(Booking).findOne({id:booking.id})
                service_employee_list.employee = await getConnection().getRepository(Employee).findOne({id:list_employee_for_work[j]})
                await getConnection().getRepository(Service_Employee_List).save(service_employee_list)
            }
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_booking : async (account_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","status_booking.status","booking.description","booking.work_date","fish_pond.name"])
                .from(Account, "account")
                .innerJoin("account.booking", "booking")
                .innerJoin("booking.status_booking", "status_booking")
                .innerJoin("booking.fish_pond", "fish_pond")
                .where("account.id = :account_id ", {account_id:account_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_booking : async (account_id,booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","status_booking.status","booking.work_date"])
                .from(Account, "account")
                .innerJoin("account.booking", "booking")
                .innerJoin("booking.status_booking", "status_booking")
                .where("account.id = :account_id and booking.id = :booking_id" , {account_id:account_id,booking_id:booking_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list__booking_on_today : async () => {
        try {
            let date = Date.now()
            // let time = new Date(min_date.setDate(min_date.getDate() - 1))
            // var date_min = +new Date(time)
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","booking.created_date","booking.work_date","status_booking.status","farm.name"])
                .from(Booking, "booking")
                .innerJoin("booking.booking_type", "booking_type")
                .innerJoin("booking.status_booking", "status_booking")
                .innerJoin("booking.fish_pond", "fish_pond")
                .innerJoin("fish_pond.farm", "farm")
                .where("booking_type.type_name = 'Booking' and booking.created_by < :date and booking.work_date < :date  " ,{date:date} )
                .execute();
            let list_booking = JSON.parse(JSON.stringify(result))
            let new_date = new Date()
            let new_day = new_date.getDate()
            let new_month = new_date.getMonth()
            let new_year = new_date.getFullYear()
            let data = []
            for (let i =0;i<list_booking.length;i++){
                let create_date = new Date(list_booking[i].booking_created_date)
                let day_create  = create_date.getDate()
                let month_create = create_date.getMonth()
                let year_create = create_date.getFullYear()
                let work_date = new Date(list_booking[i].booking_work_date)
                let day_work = work_date.getDate()
                let month_work = work_date.getMonth()
                let year_work = work_date.getFullYear()
                if (day_create == new_day && month_create == new_month && year_create == new_year){
                     data.push(list_booking[i])
                }else if  (day_work == new_day && month_work == new_month && year_work == new_year){
                    data.push(list_booking[i])
                }
            }
            return data
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list__booking_on_tomorrow : async () => {
        try {
            let date = new Date()
            let tomorrow = new Date(date.setDate(date.getDate() + 1))
            // var date_min = +new Date(time)
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","booking.created_date","booking.work_date","status_booking.status","farm.name"])
                .from(Booking, "booking")
                .innerJoin("booking.booking_type", "booking_type")
                .innerJoin("booking.status_booking", "status_booking")
                .innerJoin("booking.fish_pond", "fish_pond")
                .innerJoin("fish_pond.farm", "farm")
                .where("booking_type.type_name = 'Booking' and booking.created_by < :date and booking.work_date < :date  " ,{date:tomorrow} )
                .execute();
            let list_booking = JSON.parse(JSON.stringify(result))
            let new_date_1 = new Date()
            let new_date = new Date(new_date_1.setDate(new_date_1.getDate() + 1))
            let new_day = new_date.getDate()
            let new_month = new_date.getMonth()
            let new_year = new_date.getFullYear()
            let data = []
            for (let i =0;i<list_booking.length;i++){
                let create_date = new Date(list_booking[i].booking_created_date)
                let day_create  = create_date.getDate()
                let month_create = create_date.getMonth()
                let year_create = create_date.getFullYear()
                let work_date = new Date(list_booking[i].booking_work_date)
                let day_work = work_date.getDate()
                let month_work = work_date.getMonth()
                let year_work = work_date.getFullYear()
                if (day_create == new_day && month_create == new_month && year_create == new_year){
                    data.push(list_booking[i])
                }else if  (day_work == new_day && month_work == new_month && year_work == new_year){
                    data.push(list_booking[i])
                }
            }
            return data
        } catch (err) {
            console.log(err)
            return false
        }
    },
    // list_booking_in_progress_by_admin : async (list_booking_today) => {
    //     try {
    //         for (let i=0;i<list_booking_today.length;i++){
    //
    //         }
    //         const result = await getConnection()
    //             .createQueryBuilder()
    //             .select(["booking.id","booking.name","booking.description","status_booking.status","booking.work_date","customer.name","customer.surname","customer.tel"])
    //             .from(Booking, "booking")
    //             .innerJoin("booking.fish_pond", "fish_pond")
    //             .innerJoin("fish_pond.farm", "farm")
    //             .innerJoin("farm.customer", "customer")
    //             .innerJoin("booking.status_booking", "status_booking")
    //             .where("booking.id = :booking_id" , {booking_id:booking_id})
    //             .getRawOne();
    //         return JSON.parse(JSON.stringify(result))
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    showinfo_booking_by_admin : async (booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","status_booking.status","booking.work_date","customer.name","customer.surname","customer.tel"])
                .from(Booking, "booking")
                .innerJoin("booking.fish_pond", "fish_pond")
                .innerJoin("fish_pond.farm", "farm")
                .innerJoin("farm.customer", "customer")
                .innerJoin("booking.status_booking", "status_booking")
                .where("booking.id = :booking_id" , {booking_id:booking_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_service_in_booking : async (account_id,booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.id","service.name","service.description"])
                .from(Account, "account")
                .innerJoin("account.booking", "booking")
                .innerJoin("booking.service_list", "service_list")
                .innerJoin("service_list.service", "service")
                .where("account.id = :account_id and booking.id = :booking_id" , {account_id:account_id,booking_id:booking_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo_service_in_booking_by_admin : async (booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.id","service.name","service.description"])
                .from(Booking, "booking")
                .innerJoin("booking.service_list", "service_list")
                .innerJoin("service_list.service", "service")
                .where("booking.id = :booking_id" , {booking_id:booking_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_status_booking_by_admin : async (status_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","status_booking.status","booking.description","booking.work_date"])
                .from(Booking, "booking")
                .innerJoin("booking.status_booking", "status_booking")
                .where("status_booking.id = :status_id ", {status_id:status_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    schedule_booking_by_admin : async (booking_id,work_date,list_employee_for_work,date,employee_id) => {
        try {
            let booking = await getConnection().getRepository(Booking).findOne({id: booking_id})
            booking.work_date = work_date
            booking.created_by = employee_id
            booking.updated_by = employee_id
            booking.updated_date = date
            booking.status_booking = await getConnection().getRepository(Status_Booking).findOne({status:"รอทำการลงพื้นที่"})
            await getConnection().getRepository(Booking).save(booking)
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service_employee_list.id"])
                .from(Booking, "booking")
                .innerJoin("booking.service_employee_list", "service_employee_list")
                .where("booking.id = :booking_id " , {booking_id:booking_id})
                .execute();
            let list_employee = JSON.parse(JSON.stringify(result))
            for (let j =0;j<list_employee.length;j++){
                await getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(Service_Employee_List)
                    .where("id = :id", {id: list_employee[j].service_employee_list_id})
                    .execute();
            }
            for (let i = 0;i<list_employee_for_work.length;i++){
                let service_employee_list = new Service_Employee_List()
                service_employee_list.booking = await getConnection().getRepository(Booking).findOne({id:booking_id})
                service_employee_list.employee = await getConnection().getRepository(Employee).findOne({id:list_employee_for_work[i]})
                await getConnection().getRepository(Service_Employee_List).save(service_employee_list)
            }
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_employee_for_work : async (booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["employee.id","employee.name","employee.surname","employee.tel","position.name"])
                .from(Booking, "booking")
                .innerJoin("booking.service_employee_list", "service_employee_list")
                .innerJoin("service_employee_list.employee", "employee")
                .leftJoin("employee.position", "position")
                .where("booking.id = :booking_id" , {booking_id:booking_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (code,device_number,description,employee_id) => {
        try {
            let equipments = await getConnection().getRepository(Equipments).findOne({id: device_number})
            equipments.code = code
            equipments.description = description
            // equipments.status = status
            equipments.updated_by = employee_id
            await getConnection().getRepository(Equipments).save(equipments)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_booking_by_status_of_employee : async (status_id,employee_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","booking.work_date"])
                .from(Status_Booking, "status_booking")
                .innerJoin("status_booking.booking", "booking")
                .innerJoin("booking.service_employee_list", "service_employee_list")
                .innerJoin("service_employee_list.employee", "employee")
                .where("status_booking.id = :status_id and employee.id = :employee_id" , {status_id:status_id,employee_id:employee_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    home_schedule_booking : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","status_booking.status","booking.description","booking.work_date"])
                .from(Booking, "booking")
                .innerJoin("booking.status_booking", "status_booking")

                .where("status_booking.status = 'ทำการจอง' ")
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    home_schedule_booking_of_employee: async (employee_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["booking.id","booking.name","booking.description","booking.work_date","status_booking.status"])
                .from(Status_Booking, "status_booking")
                .innerJoin("status_booking.booking", "booking")
                .innerJoin("booking.service_employee_list", "service_employee_list")
                .innerJoin("service_employee_list.employee", "employee")
                .where("status_booking.status = 'รอทำการลงพื้นที่' and employee.id = :employee_id" , {employee_id:employee_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    confirm_booking_by_customer : async (booking_id) => {
        try {
            let booking = await getConnection().getRepository(Booking).findOne({id: booking_id})
            booking.status_booking = await getConnection().getRepository(Status_Booking).findOne({status: "ยืนยันการใช้บริการ"})
            await getConnection().getRepository(Booking).save(booking)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    confirm_booking_by_employee : async (booking_id) => {
        try {
            let booking = await getConnection().getRepository(Booking).findOne({id: booking_id})
            booking.status_booking = await getConnection().getRepository(Status_Booking).findOne({status: "ทำการให้บริการเสร็จสิ้น"})
            await getConnection().getRepository(Booking).save(booking)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    // showinfo : async (device_number) => {
    //     try {
    //         const result = await getConnection()
    //             .createQueryBuilder()
    //             .select(["equipments.id","equipments.code","equipments.description","equipments.status"])
    //             .from(Equipments, "equipments")
    //             .where("equipments.id = :device_number " , {device_number:device_number})
    //             .getRawOne();
    //         return JSON.parse(JSON.stringify(result))
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    list_pond_admin : async (fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.description","equipments.status"])
                .from(Fish_Pond, "fish_pond")
                .innerJoin("fish_pond.equipments", "equipments")
                .where("fish_pond.id = :fishpond_id ", {fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.code","equipments.description","equipments.status"])
                .from(Equipments, "equipments")
                .getMany();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_equipments : async (status) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.code","equipments.description","equipments.status"])
                .from(Equipments, "equipments")
                .where("equipments.status = :status ", {status:status})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    delete : async (farm_id) => {
        try {
            let farm = await getConnection().getRepository(Farm).findOne({id: farm_id})
            farm.status = false
            await getConnection().getRepository(Farm).save(farm)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default bookingInfo