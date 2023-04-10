import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Status_Booking} from "../entity/Status_Booking";

let status_booking_Info = {
    create : async (status,description,date,employee_id) => {
        try {
            let status_booking = new Status_Booking()
            status_booking.status = status
            status_booking.description = description
            status_booking.created_by = employee_id
            status_booking.updated_by = employee_id
            status_booking.created_date = date
            status_booking.updated_date = date
            await getConnection().getRepository(Status_Booking).save(status_booking)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (status_id,status,description,date,employee_id) => {
        try {
            let status_booking = await getConnection().getRepository(Status_Booking).findOne({id: status_id})
            status_booking.status = status
            status_booking.description = description
            status_booking.updated_by = employee_id
            status_booking.updated_date = date
            await getConnection().getRepository(Status_Booking).save(status_booking)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (status_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["status_booking.status","status_booking.description"])
                .from(Status_Booking, "status_booking")
                .where("status_booking.id = :status_id " , {status_id:status_id})
                .getRawOne();
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
                .select(["status_booking.id","status_booking.status"])
                .from(Status_Booking, "status_booking")
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall_by_employee : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["status_booking.id","status_booking.status"])
                .from(Status_Booking, "status_booking")
                .where("status_booking.status != 'ทำการจอง' " )
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

export default status_booking_Info