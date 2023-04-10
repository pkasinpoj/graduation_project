// import {getConnection} from "typeorm";
// import {Farm} from "../entity/Farm";
// import {Accessory} from "../entity/Accessory";
// import {Requisition} from "../entity/Requisition";
// import {Account} from "../entity/Account";
// import {Accessory_Requisition_List} from "../entity/Accessory_Requisition_List";
//
// let requisitionInfo = {
//     create : async (name,description,account_id,employee_id,date,list_accessorry) => {
//         try {
//             let requisition = new Requisition()
//             requisition.name = name
//             requisition.description = description
//             requisition.status = true
//             requisition.lend_date = date
//             requisition.created_by = employee_id
//             requisition.updated_by = employee_id
//             requisition.created_date = date
//             requisition.update_date = date
//             requisition.account = await getConnection().getRepository(Account).findOne({id:account_id})
//             await getConnection().getRepository(Requisition).save(requisition)
//             for (let i = 0;i<list_accessorry.length;i++){
//                 let accessory_requisition_list = new Accessory_Requisition_List()
//                 accessory_requisition_list.requisition = await getConnection().getRepository(Requisition).findOne({id:requisition.id})
//                 accessory_requisition_list.accessory = await getConnection().getRepository(Accessory).findOne({id:list_accessorry[i]})
//                 await getConnection().getRepository(Accessory_Requisition_List).save(accessory_requisition_list)
//             }
//             return true
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     return_requisition : async (date,requisition_id,employee_id) => {
//         try {
//             let requisition = await getConnection().getRepository(Requisition).findOne({id: requisition_id})
//             requisition.return_date = date
//             requisition.update_date = date
//             requisition.updated_by = employee_id
//             await getConnection().getRepository(Requisition).save(requisition)
//             return true
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     showinfo : async (requisition_id) => {
//         try {
//             const result = await getConnection()
//                 .createQueryBuilder()
//                 .select(["accessory.name","accessory.description","accessory.status","accessory.balance"])
//                 .from(Requisition, "accessory")
//                 .where("accessory.id = :accessory_id " , {accessory_id:requisition_id})
//                 .getRawOne();
//             return JSON.parse(JSON.stringify(result))
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     showall : async () => {
//         try {
//             const result = await getConnection()
//                 .createQueryBuilder()
//                 .select(["requisition.id","requisition.name","requisition.description","requisition.lend_date","requisition.return_date"])
//                 .from(Requisition, "requisition")
//                 .where("requisition.status = true")
//                 .getMany();
//             return JSON.parse(JSON.stringify(result))
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     showlist_type : async (type_id) => {
//         try {
//             const result = await getConnection()
//                 .createQueryBuilder()
//                 .select(["accessory.id","accessory.name","accessory.description","accessory.balance"])
//                 .from(Accessory, "accessory")
//                 .innerJoin("accessory.accessory_type", "accessory_type")
//                 .where("accessory_type.id = :type_id " , {type_id:type_id})
//                 .getMany();
//             return JSON.parse(JSON.stringify(result))
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     delete : async (farm_id) => {
//         try {
//             let farm = await getConnection().getRepository(Farm).findOne({id: farm_id})
//             farm.status = false
//             await getConnection().getRepository(Farm).save(farm)
//             return true
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
// }
//
// export default requisitionInfo