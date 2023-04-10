import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Accessory} from "../entity/Accessory";
import {Account} from "../entity/Account";
import {Accessory_Requisition_List} from "../entity/Accessory_Requisition_List";
import {Booking} from "../entity/Booking";

let accessorryrequisitionInfo = {
    create : async (description,booking_id,accessory_id,borrowed_amount,date,employee_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.balance"])
                .from(Accessory, "accessory")
                .where("accessory.id = :accessory_id " , {accessory_id:accessory_id})
                .getRawOne();
            if (borrowed_amount<result.accessory_balance){
                let accessory_requisition_list = new Accessory_Requisition_List()
                accessory_requisition_list.description = description
                accessory_requisition_list.borrowed_amount = borrowed_amount
                accessory_requisition_list.status = true
                accessory_requisition_list.lend_date = date
                accessory_requisition_list.created_by = employee_id
                accessory_requisition_list.created_date = date
                accessory_requisition_list.booking = await getConnection().getRepository(Booking).findOne({id:booking_id})
                accessory_requisition_list.accessory = await getConnection().getRepository(Accessory).findOne({id:accessory_id})
                await getConnection().getRepository(Accessory_Requisition_List).save(accessory_requisition_list)
                let accessory = await getConnection().getRepository(Accessory).findOne({id: accessory_id})
                accessory.balance = result.accessory_balance-borrowed_amount
                await getConnection().getRepository(Accessory).save(accessory)
                return true
            }else {
                return  false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
    return_requisition : async (date,requisition_id,remaining_amount,description,employee_id) => {
        try {
            let accessory_requisition_list = await getConnection().getRepository(Accessory_Requisition_List).findOne({id: requisition_id})
            accessory_requisition_list.return_date = date
            accessory_requisition_list.update_date = date
            accessory_requisition_list.updated_by = employee_id
            accessory_requisition_list.remaining_amount = remaining_amount
            accessory_requisition_list.description = description
            await getConnection().getRepository(Accessory_Requisition_List).save(accessory_requisition_list)
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.id","accessory.balance"])
                .from(Accessory, "accessory")
                .innerJoin("accessory.accessory_requisition_list", "accessory_requisition_list")
                .where("accessory_requisition_list.id = :requisition_id " , {requisition_id:requisition_id})
                .getRawOne();
            let amount = parseInt(remaining_amount)
            let accessory = await getConnection().getRepository(Accessory).findOne({id: result.accessory_id})
            accessory.balance = result.accessory_balance+amount
            await getConnection().getRepository(Accessory).save(accessory)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_accessorry_by_booking : async (booking_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["accessory.name","accessory_requisition_list.lend_date","accessory_requisition_list.return_date","accessory_requisition_list.borrowed_amount","accessory_requisition_list.remaining_amount","accessory_requisition_list.description"])
                .from(Booking, "booking")
                .innerJoin("booking.accessory_requisition_list", "accessory_requisition_list")
                .innerJoin("accessory_requisition_list.accessory", "accessory")
                .where("booking.id = :booking_id " , {booking_id:booking_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default accessorryrequisitionInfo