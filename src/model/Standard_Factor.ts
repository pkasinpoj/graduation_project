// import {getConnection} from "typeorm";
// import {Farm} from "../entity/Farm";
// import {Equipments} from "../entity/Equipments";
// import {Fish_Pond} from "../entity/Fish_Pond";
// import {Customer} from "../entity/Customer";
// import {Port} from "../entity/Port";
// import {Factor} from "../entity/Factor";
// import {Equipment_Factor} from "../entity/Equipment_Factor";
// import {Dataset} from "../entity/Dataset";
// import {Status_Equipment} from "../entity/Status_Equipment";
// import {Standard_Factor} from "../entity/Standard_Factor";
// import {Accessory} from "../entity/Accessory";
//
// let standard_factorinfo = {
//     create : async (standard_name,description,max_danger_value,min_danger_value,min,max,employee_id,date) => {
//         try {
//             let standard_factor = new Standard_Factor()
//             standard_factor.standard_name = standard_name
//             standard_factor.description = description
//             standard_factor.max_danger_value = max_danger_value
//             standard_factor.min_danger_value = min_danger_value
//             standard_factor.min = min
//             standard_factor.max = max
//             standard_factor.status = true
//             standard_factor.created_by = employee_id
//             standard_factor.created_date = date
//             await getConnection().getRepository(Standard_Factor).save(standard_factor)
//             return true
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     edit : async (code,device_number,description,employee_id,listfactor,date,status_id) => {
//         try {
//             let equipments = await getConnection().getRepository(Equipments).findOne({id: device_number})
//             equipments.code = code
//             equipments.description = description
//             // equipments.status = status
//             equipments.updated_by = employee_id
//             equipments.updated_date = date
//             equipments.status_equipment = await getConnection().getRepository(Status_Equipment).findOne({id:status_id})
//             await getConnection().getRepository(Equipments).save(equipments)
//             const result = await getConnection()
//                 .createQueryBuilder()
//                 .select(["list_factor.id"])
//                 .from(Equipments, "equipments")
//                 .innerJoin("equipments.list_factor", "list_factor")
//                 .where("equipments.id = :device_number " , {device_number:device_number})
//                 .execute();
//             let list_factor = JSON.parse(JSON.stringify(result))
//             for (let j =0;j<list_factor.length;j++){
//                 await getConnection()
//                     .createQueryBuilder()
//                     .delete()
//                     .from(Port)
//                     .where("id = :id", {id: list_factor[j].list_factor_id})
//                     .execute();
//             }
//             for (let i = 0;i<listfactor.length;i++){
//                 let factor = new Port()
//                 factor.equipments = await getConnection().getRepository(Equipments).findOne({id:equipments.id})
//                 factor.factor = await getConnection().getRepository(Factor).findOne({id:listfactor[i]})
//                 await getConnection().getRepository(Port).save(factor)
//             }
//             return true
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
//     showinfo : async (standard_id) => {
//         try {
//             const result = await getConnection()
//                 .createQueryBuilder()
//                 .select(["standard_factor.standard_name","standard_factor.description","standard_factor.danger_value","standard_factor.min","standard_factor.max","factor.facterType"])
//                 .from(Standard_Factor, "standard_factor")
//                 .innerJoin("standard_factor.factor", "factor")
//                 .where("standard_factor.id = :standard_id and standard_factor.status = true",{standard_id:standard_id})
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
//                 .select(["standard_factor.standard_name","standard_factor.description","standard_factor.danger_value","standard_factor.min","standard_factor.max","factor.facterType"])
//                 .from(Standard_Factor, "standard_factor")
//                 .innerJoin("standard_factor.factor", "factor")
//                 .where("standard_factor.status = true")
//                 .getMany();
//             return JSON.parse(JSON.stringify(result))
//         } catch (err) {
//             console.log(err)
//             return false
//         }
//     },
// }
//
// export default standard_factorinfo