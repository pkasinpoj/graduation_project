import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Equipments} from "../entity/Equipments";
import {Fish_Pond} from "../entity/Fish_Pond";
import {Customer} from "../entity/Customer";
import {Port} from "../entity/Port";
import {Factor} from "../entity/Factor";
// import {Equipment_Factor} from "../entity/Equipment_Factor";
// import {Dataset} from "../entity/Dataset";
import {Status_Equipment} from "../entity/Status_Equipment";
import {Time_Dim} from "../entity/Time_Dim";
import etlInfo from "./ETL_Dataset";
import {Fact_Fish_Pond} from "../entity/Fact_Fish_Pond";
import {Pond_Dim} from "../entity/Pond_Dim";
import {Factor_Dim} from "../entity/Factor_Dim";
import {Fish} from "../entity/Fish";
import {Event_Factor} from "../entity/Event_Factor";

let equipmentInfo = {
    create : async (device_number,code,minute_feed,description,employee_id,date) => {
        try {
            let equipments = new Equipments()
            equipments.id = device_number
            equipments.code = code
            equipments.description = description
            equipments.minute_feed = minute_feed
            equipments.created_by = employee_id
            equipments.updated_by = employee_id
            equipments.status_equipment = await getConnection().getRepository(Status_Equipment).findOne({status:"ยังไม่ได้ติดตั้ง"})
            equipments.created_date = date
            equipments.updated_date = date
            await getConnection().getRepository(Equipments).save(equipments)
            // for (let i = 0;i<listfactor.length;i++){
            //     let list_factor = new Port()
            //     list_factor.equipments = await getConnection().getRepository(Equipments).findOne({id:equipments.id})
            //     list_factor.factor = await getConnection().getRepository(Factor).findOne({id:listfactor[i]})
            //     await getConnection().getRepository(Port).save(list_factor)
            // }
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    install_pond : async (code,fishpond_id,employee_id,date) => {
        try {
            let equipments = await getConnection().getRepository(Equipments).findOne({code: code})
            equipments.fish_pond = await getConnection().getRepository(Fish_Pond).findOne({id:fishpond_id})
            equipments.status_equipment = await getConnection().getRepository(Status_Equipment).findOne({status:"ติดตั้งเเล้ว"})
            equipments.updated_by = employee_id
            equipments.updated_date = date
            await getConnection().getRepository(Equipments).save(equipments)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (code,device_number,description,employee_id,listfactor,date,status_id) => {
        try {
            let equipments = await getConnection().getRepository(Equipments).findOne({id: device_number})
            equipments.code = code
            equipments.description = description
            // equipments.status = status
            equipments.updated_by = employee_id
            equipments.updated_date = date
            equipments.status_equipment = await getConnection().getRepository(Status_Equipment).findOne({id:status_id})
            await getConnection().getRepository(Equipments).save(equipments)
            const result = await getConnection()
                            .createQueryBuilder()
                            .select(["list_factor.id"])
                            .from(Equipments, "equipments")
                            .innerJoin("equipments.list_factor", "list_factor")
                            .where("equipments.id = :device_number " , {device_number:device_number})
                            .execute();
                        let list_factor = JSON.parse(JSON.stringify(result))
            for (let j =0;j<list_factor.length;j++){
                await getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(Port)
                    .where("id = :id", {id: list_factor[j].list_factor_id})
                    .execute();
            }
            for (let i = 0;i<listfactor.length;i++){
                let factor = new Port()
                factor.equipments = await getConnection().getRepository(Equipments).findOne({id:equipments.id})
                factor.factor = await getConnection().getRepository(Factor).findOne({id:listfactor[i]})
                await getConnection().getRepository(Port).save(factor)
            }
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (device_number) => {
        try {
            const result = await getConnection()
                            .createQueryBuilder()
                            .select(["equipments.id","equipments.code","equipments.description","status_equipment.status"])
                            .from(Equipments, "equipments")
                            .innerJoin("equipments.status_equipment", "status_equipment")
                            .where("equipments.id = :device_number " , {device_number:device_number})
                            .getRawOne();
                        return JSON.parse(JSON.stringify(result))
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_pond_admin : async (fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.description","status_equipment.status"])
                .from(Fish_Pond, "fish_pond")
                .innerJoin("fish_pond.equipments", "equipments")
                .innerJoin("equipments.status_equipment", "status_equipment")
                .where("fish_pond.id = :fishpond_id ", {fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },

    // test_auto : async (equipment_id) => {
    //     try {
    //         const result = await getConnection()
    //             .createQueryBuilder()
    //             .select(["list_factor.id"])
    //             .from(Equipments, "equipments")
    //             .innerJoin("equipments.list_factor", "list_factor")
    //             .where("equipments.id = :equipment_id ", {equipment_id:equipment_id})
    //             .execute();
    //         let list_factor = JSON.parse(JSON.stringify(result))
    //         for (let i = 0;i<list_factor.length;i++){
    //             let equipment_factor = new Equipment_Factor()
    //             equipment_factor.min = 12
    //             equipment_factor.max = 24
    //             equipment_factor.average = 15
    //             equipment_factor.list_factor = await getConnection().getRepository(Port).findOne({id:list_factor[i].list_factor_id})
    //             await getConnection().getRepository(Equipment_Factor).save(equipment_factor)
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    // test_auto : async () => {
    //     try {
    //         const result = await getConnection()
    //             .createQueryBuilder()
    //             .select(["equipments.id"])
    //             .from(Equipments, "equipments")
    //             .innerJoin("equipments.status_equipment", "status_equipment")
    //             .where("status_equipment.status = 'ติดตั้งเเล้ว' ")
    //             .execute();
    //         let equipment = JSON.parse(JSON.stringify(result))
    //         for (let i = 0;i<equipment.length;i++){
    //             let value1 = []
    //             let value2 = []
    //             let value3 = []
    //             let value4 = []
    //             let value5 = []
    //             let value6 = []
    //             let allvalue = []
    //             var json = "\"2020-06-20T11:14:21.493Z\"";
    //             var dateStr = JSON.parse(json);
    //             var date = new Date(dateStr);
    //             let datetouse = new Date(date.setHours(date.getHours() - 2))
    //             const result = await getConnection()
    //                 .createQueryBuilder()
    //                 .select(["dataset.equip_id","dataset.factor_1","dataset.factor_2","dataset.factor_3","dataset.factor_4","dataset.factor_5","dataset.factor_6"])
    //                 .from(Dataset, "dataset")
    //                 .where("dataset.equip_id = :equipment_id and dataset.timestamp >= :datetouse", {equipment_id:equipment[i].equipments_id,datetouse:datetouse})
    //                 // .where("dataset.equip_id = :equipment_id ", {equipment_id:equipment[i].equipments_id})
    //                 .execute();
    //             let data_iot =  JSON.parse(JSON.stringify(result))
    //             for (let j=0;j<data_iot.length;j++){
    //                 value1.push(data_iot[j].dataset_factor_1)
    //                 value2.push(data_iot[j].dataset_factor_2)
    //                 value3.push(data_iot[j].dataset_factor_3)
    //                 value4.push(data_iot[j].dataset_factor_4)
    //                 value5.push(data_iot[j].dataset_factor_5)
    //                 value6.push(data_iot[j].dataset_factor_6)
    //             }
    //             allvalue.push(value1,value2,value3,value4,value5,value6)
    //             // console.log(allvalue)
    //             const list_factors = await getConnection()
    //                 .createQueryBuilder()
    //                 .select(["list_factor.id","standard_factor.max_danger_value","standard_factor.min_danger_value","standard_factor.min","standard_factor.max"])
    //                 .from(Equipments, "equipments")
    //                 .innerJoin("equipments.list_factor", "list_factor")
    //                 .innerJoin("list_factor.factor", "factor")
    //                 .innerJoin("factor.standard_factor", "standard_factor")
    //                 .where("equipments.id = :equipment_id and standard_factor.status = true", {equipment_id:equipment[i].equipments_id})
    //                 .execute();
    //             let list_factor = JSON.parse(JSON.stringify(list_factors))
    //             for (let k = 0;k<list_factor.length;k++){
    //                 let min = Math.min(...allvalue[k])
    //                 let max = Math.max(...allvalue[k])
    //                 const sum = allvalue[k]
    //                 const reducer = (accumulator, currentValue) => accumulator + currentValue;
    //                 let average = sum.reduce(reducer)/allvalue[k].length
    //                 let datemake = new Date()
    //                 let datetouse = new Date(datemake.setDate(datemake.getDate() - 1))
    //                 let newdate = new Date()
    //                 let status
    //                 if (average < list_factor[k].standard_factor_min_danger_value || average > list_factor[k].standard_factor_max_danger_value){
    //                    status = 'อันตราย'
    //                 }else if (average >= list_factor[k].standard_factor_min && average < list_factor[k].standard_factor_max){
    //                    status = "ปกติ"
    //                 } else {
    //                     status = "พบสิ่งผิดปกติ"
    //                 }
    //                 let equipment_factor = new Equipment_Factor()
    //                 equipment_factor.min = min
    //                 equipment_factor.max = max
    //                 equipment_factor.average = average
    //                 equipment_factor.status = status
    //                 // equipment_factor.save_date = datetouse
    //                 equipment_factor.save_date = newdate
    //                 equipment_factor.list_factor = await getConnection().getRepository(Port).findOne({id:list_factor[k].list_factor_id})
    //                 await getConnection().getRepository(Equipment_Factor).save(equipment_factor)
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    // test_auto : async (equipment_id) => {
    //     try {
    //         const result = await getConnection()
    //             .createQueryBuilder()
    //             .select(["list_factor.id"])
    //             .from(Equipments, "equipments")
    //             .innerJoin("equipments.list_factor", "list_factor")
    //             .where("equipments.id = :equipment_id ", {equipment_id:equipment_id})
    //             .execute();
    //         let list_factor = JSON.parse(JSON.stringify(result))
    //         for (let i = 0;i<list_factor.length;i++){
    //             let equipment_factor = new Equipment_Factor()
    //             equipment_factor.min = 12
    //             equipment_factor.max = 24
    //             equipment_factor.average = 15
    //             equipment_factor.list_factor = await getConnection().getRepository(Port).findOne({id:list_factor[i].list_factor_id})
    //             await getConnection().getRepository(Equipment_Factor).save(equipment_factor)
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         return false
    //     }
    // },
    list_value_etl : async (pond_id,factor_id,date) => {
        try {
            let value_min = new Date(date)
            let value_max = new Date(date)
            // let min_date = new Date(value_min.setHours(value_min.getHours() - 24))
            // let min_date = value_min
            // let max_date = new Date(value_max.setHours(value_max.getHours() - 24))
            let min_date = new Date(value_min.setHours(0.0))
            let max_date = new Date(value_max.setHours(value_max.getHours() + 23.59))
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fact_fish_pond.value_avg","time_dim.date_data"])
                .from(Fact_Fish_Pond, "fact_fish_pond")
                .innerJoin("fact_fish_pond.factor_dim", "factor_dim")
                .innerJoin("fact_fish_pond.pond_dim", "pond_dim")
                .innerJoin("fact_fish_pond.time_dim", "time_dim")
                .where("factor_dim.id = :factor_id and  pond_dim.id = :pond_id and (time_dim.date_data >= :min_date and time_dim.date_data <= :max_date)", {factor_id:factor_id,pond_id:pond_id,min_date:min_date,max_date:max_date})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_value_etl_week : async (pond_id,factor_id,time_period_one,time_period_two) => {
        try {
            let value_min = new Date(time_period_one)
            let value_max = new Date(time_period_two)
            // let min_date = new Date(value_min.setHours(value_min.getHours() - 24))
            // let min_date = value_min
            // let max_date = new Date(value_max.setHours(value_max.getHours() - 24))
            let min_date = new Date(value_min.setHours(0.0))
            let max_date = new Date(value_max.setHours(value_max.getHours() + 23.59))
            // console.log(min_date)
            // console.log(max_date)
            const result = await getConnection()
                .createQueryBuilder()
                .select(["AVG(fact_fish_pond.value_avg) AS avg","time_dim.date_data"])
                .from(Fact_Fish_Pond, "fact_fish_pond")
                .innerJoin("fact_fish_pond.factor_dim", "factor_dim")
                .innerJoin("fact_fish_pond.pond_dim", "pond_dim")
                .innerJoin("fact_fish_pond.time_dim", "time_dim")
                .groupBy("date(time_dim.date_data)")
                .where("factor_dim.id = :factor_id and  pond_dim.id = :pond_id and (time_dim.date_data >= :min_date and time_dim.date_data <= :max_date)", {factor_id:factor_id,pond_id:pond_id,min_date:min_date,max_date:max_date})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_value_etl_month : async (pond_id,factor_id,year,month) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["AVG(fact_fish_pond.value_avg) AS avg","time_dim.date_data"])
                .from(Fact_Fish_Pond, "fact_fish_pond")
                .innerJoin("fact_fish_pond.factor_dim", "factor_dim")
                .innerJoin("fact_fish_pond.pond_dim", "pond_dim")
                .innerJoin("fact_fish_pond.time_dim", "time_dim")
                .groupBy("date(time_dim.date_data)")
                .where("factor_dim.id = :factor_id and  pond_dim.id = :pond_id and year(time_dim.date_data) = :year and month(time_dim.date_data) = :month ", {factor_id:factor_id,pond_id:pond_id,year:year,month:month})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    report_etl : async (pond_id,date) => {
        try {
            let value_min = new Date(date)
            let value_max = new Date(date)
            // let min_date = new Date(value_min.setHours(value_min.getHours() - 24))
            let min_date = new Date(value_min.setHours(0.0))
            let max_date = new Date(value_max.setHours(value_max.getHours() + 23.59))
            const result = await getConnection()
                .createQueryBuilder()
                .select(["time_dim.date_data"])
                .from(Time_Dim, "time_dim")
                .where("time_dim.date_data >= :min_date and time_dim.date_data <= :max_date", {min_date:min_date,max_date:max_date})
                .execute();
            let time =  JSON.parse(JSON.stringify(result))
            // for (let i=0;i<time.length;i++){
                // let value_time_min = new Date(time[i].time_dim_date_data)
                // let min_time = new Date(value_time_min.setMinutes(value_time_min.getMinutes() - 1))
                // console.log(min_time)
                // let value_time_max = new Date(time[i].time_dim_date_data)
                // let max_time = new Date(value_time_max.setMinutes(value_time_max.getMinutes() + 1))
                // console.log(max_time)
                const list_data = await getConnection()
                    .createQueryBuilder()
                    .select(["fact_fish_pond.value_avg","time_dim.date_data","factor_dim.facterType","factor_dim.unit"])
                    .from(Fact_Fish_Pond, "fact_fish_pond")
                    .innerJoin("fact_fish_pond.factor_dim", "factor_dim")
                    .innerJoin("fact_fish_pond.pond_dim", "pond_dim")
                    .innerJoin("fact_fish_pond.time_dim", "time_dim")
                    .where("pond_dim.id = :pond_id ", {pond_id:pond_id})
                    .execute();
                let list_value =  JSON.parse(JSON.stringify(list_data))
            let alldata = []
            for (let t=0;t<time.length;t++){
                let data = []
                for (let d =0;d<list_data.length;d++){
                    if (time[t].time_dim_date_data == list_value[d].time_dim_date_data){
                        data.push(list_value[d])
                    }
                        }
                alldata.push(data)
            }
            let data_all = []
            let j =0
            time.forEach((value, index) => {
                if (alldata[j].length != 0) {
                    let time_test = new Date(time[j].time_dim_date_data)
                    let time_result = time_test.toLocaleTimeString()
                    data_all.push({
                        time_dim_date_data:time_result,
                        data_iot: Object.assign(alldata[j++])
                    })
                }
            })
            return data_all
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_life_cycle_5 : async () => {
        try {
            // let date = new Date()
            let minute = 5
            // let result_minute = minute+1
            let hour_brach = 6
            //
            var date = new Date("03-08-2020")
            let time = new Date(date.setHours(date.getHours() - hour_brach))
            let min_time = time
            let max_time = new Date(date.setMinutes(date.getMinutes() + 6))
            // let max_time = new Date(date.setMinutes(date.getMinutes() + 1))
            // let min_time = new Date(date.setMinutes(date.getMinutes() - result_minute))
            // let all_time = []
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id"])
                .from(Equipments, "equipments")
                .innerJoin("equipments.status_equipment", "status_equipment")
                .innerJoin("equipments.fish_pond", "fish_pond")
                // .where("status_equipment.status = 'ติดตั้งเเล้ว' and equipments.minute_feed = :minute", {minute:minute})
                .where("equipments.minute_feed = :minute", {minute:minute})
                .execute();
            let equipment = JSON.parse(JSON.stringify(result))
            for (let i = 0;i<equipment.length;i++){
                const port = await getConnection()
                    .createQueryBuilder()
                    .select(["port.id","factor.id","fish_pond.id"])
                    .from(Equipments, "equipments")
                    .innerJoin("equipments.port", "port")
                    .innerJoin("port.factor", "factor")
                    .innerJoin("equipments.fish_pond", "fish_pond")
                    .where("equipments.id = :equipment_id", {equipment_id:equipment[i].equipments_id})
                    .execute();
                let port_of_equipment = JSON.parse(JSON.stringify(port))
                const fish = await getConnection()
                    .createQueryBuilder()
                    .select(["fish.id","fish.birth_day","fish_specie.id"])
                    .from(Equipments, "equipments")
                    .innerJoin("equipments.fish_pond", "fish_pond")
                    .innerJoin("fish_pond.fish", "fish")
                    .innerJoin("fish.fish_specie", "fish_specie")
                    .where("equipments.id = :equipment_id ", {equipment_id:equipment[i].equipments_id})
                    .execute();
                let list_fish = JSON.parse(JSON.stringify(fish))
                let age_fish = []
                for (let f=0;f<list_fish.length;f++) {
                    let birth_day = new Date(list_fish[0].fish_birth_day)
                    var birth_date = +new Date(birth_day)
                    let float_day = (Date.now() - birth_date) / (31557600000)
                    let sum_day = Math.floor(float_day * 365)
                    age_fish.push(sum_day)
                }
                for (let j=0;j<port_of_equipment.length;j++){
                        let equipment_id = equipment[i].equipments_id
                        let port_id = port_of_equipment[j].port_id
                        let factor_id = port_of_equipment[j].factor_id
                        let response = await etlInfo.check_life_cycle_5(equipment_id,port_id,min_time,max_time)
                    for (let f=0;f<list_fish.length;f++) {
                        const life_cycle = await getConnection()
                            .createQueryBuilder()
                            .select(["factor_of_life_cycle.id","factor_of_life_cycle.value_min","factor_of_life_cycle.value_max"])
                            .from(Fish, "fish")
                            .innerJoin("fish.fish_specie", "fish_specie")
                            .innerJoin("fish_specie.life_cycle", "life_cycle")
                            .innerJoin("life_cycle.factor_of_life_cycle", "factor_of_life_cycle")
                            .innerJoin("factor_of_life_cycle.factor", "factor")
                            .where("factor.id = :factor_id and fish.id = :fish_id and (life_cycle.st_age < :age_fish and life_cycle.end_age > :age_fish)", {factor_id: factor_id,fish_id: list_fish[f].fish_id,age_fish:age_fish[f]})
                            .getRawOne();
                        let life_cycle_of_fish = JSON.parse(JSON.stringify(life_cycle))
                        let value_min = life_cycle_of_fish.factor_of_life_cycle_value_min
                        let value_max = life_cycle_of_fish.factor_of_life_cycle_value_max
                        if (response[0].value < value_min) {
                            let event_factor = new Event_Factor()
                            event_factor.value_alert = response[0].value
                            event_factor.massage = "มีค่าต่ำกว่าเกณฑ์มาตรฐาน"
                            event_factor.timestamp = response[0].timestamp
                            event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                            event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                            await getConnection().getRepository(Event_Factor).save(event_factor)
                        }else if (response[0].value > value_max){
                            let event_factor = new Event_Factor()
                            event_factor.value_alert = response[0].value
                            event_factor.massage = "มีค่าสูงกว่าเกณฑ์มาตรฐาน"
                            event_factor.timestamp = response[0].timestamp
                            event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                            event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                            await getConnection().getRepository(Event_Factor).save(event_factor)
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_life_cycle_10 : async () => {
        try {
            try {
                // let date = new Date()
                let minute = 10
                // let result_minute = minute+1
                let hour_brach = 6
                //
                var date = new Date("03-08-2020")
                let time = new Date(date.setHours(date.getHours() - hour_brach))
                let min_time = time
                let max_time = new Date(date.setMinutes(date.getMinutes() + 6))
                // let max_time = new Date(date.setMinutes(date.getMinutes() + 1))
                // let min_time = new Date(date.setMinutes(date.getMinutes() - result_minute))
                // let all_time = []
                const result = await getConnection()
                    .createQueryBuilder()
                    .select(["equipments.id"])
                    .from(Equipments, "equipments")
                    .innerJoin("equipments.status_equipment", "status_equipment")
                    .innerJoin("equipments.fish_pond", "fish_pond")
                    // .where("status_equipment.status = 'ติดตั้งเเล้ว' and equipments.minute_feed = :minute", {minute:minute})
                    .where("equipments.minute_feed = :minute", {minute:minute})
                    .execute();
                let equipment = JSON.parse(JSON.stringify(result))
                for (let i = 0;i<equipment.length;i++){
                    const port = await getConnection()
                        .createQueryBuilder()
                        .select(["port.id","factor.id","fish_pond.id"])
                        .from(Equipments, "equipments")
                        .innerJoin("equipments.port", "port")
                        .innerJoin("port.factor", "factor")
                        .innerJoin("equipments.fish_pond", "fish_pond")
                        .where("equipments.id = :equipment_id", {equipment_id:equipment[i].equipments_id})
                        .execute();
                    let port_of_equipment = JSON.parse(JSON.stringify(port))
                    const fish = await getConnection()
                        .createQueryBuilder()
                        .select(["fish.id","fish.birth_day","fish_specie.id"])
                        .from(Equipments, "equipments")
                        .innerJoin("equipments.fish_pond", "fish_pond")
                        .innerJoin("fish_pond.fish", "fish")
                        .innerJoin("fish.fish_specie", "fish_specie")
                        .where("equipments.id = :equipment_id ", {equipment_id:equipment[i].equipments_id})
                        .execute();
                    let list_fish = JSON.parse(JSON.stringify(fish))
                    let age_fish = []
                    for (let f=0;f<list_fish.length;f++) {
                        let birth_day = new Date(list_fish[0].fish_birth_day)
                        var birth_date = +new Date(birth_day)
                        let float_day = (Date.now() - birth_date) / (31557600000)
                        let sum_day = Math.floor(float_day * 365)
                        age_fish.push(sum_day)
                    }
                    for (let j=0;j<port_of_equipment.length;j++){
                        let equipment_id = equipment[i].equipments_id
                        let port_id = port_of_equipment[j].port_id
                        let factor_id = port_of_equipment[j].factor_id
                        let response = await etlInfo.check_life_cycle_5(equipment_id,port_id,min_time,max_time)
                        for (let f=0;f<list_fish.length;f++) {
                            const life_cycle = await getConnection()
                                .createQueryBuilder()
                                .select(["factor_of_life_cycle.id","factor_of_life_cycle.value_min","factor_of_life_cycle.value_max"])
                                .from(Fish, "fish")
                                .innerJoin("fish.fish_specie", "fish_specie")
                                .innerJoin("fish_specie.life_cycle", "life_cycle")
                                .innerJoin("life_cycle.factor_of_life_cycle", "factor_of_life_cycle")
                                .innerJoin("factor_of_life_cycle.factor", "factor")
                                .where("factor.id = :factor_id and fish.id = :fish_id and (life_cycle.st_age < :age_fish and life_cycle.end_age > :age_fish)", {factor_id: factor_id,fish_id: list_fish[f].fish_id,age_fish:age_fish[f]})
                                .getRawOne();
                            let life_cycle_of_fish = JSON.parse(JSON.stringify(life_cycle))
                            let value_min = life_cycle_of_fish.factor_of_life_cycle_value_min
                            let value_max = life_cycle_of_fish.factor_of_life_cycle_value_max
                            if (response[0].value < value_min) {
                                let event_factor = new Event_Factor()
                                event_factor.value_alert = response[0].value
                                event_factor.massage = "มีค่าต่ำกว่าเกณฑ์มาตรฐาน"
                                event_factor.timestamp = response[0].timestamp
                                event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                                event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                                await getConnection().getRepository(Event_Factor).save(event_factor)
                            }else if (response[0].value > value_max){
                                let event_factor = new Event_Factor()
                                event_factor.value_alert = response[0].value
                                event_factor.massage = "มีค่าสูงกว่าเกณฑ์มาตรฐาน"
                                event_factor.timestamp = response[0].timestamp
                                event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                                event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                                await getConnection().getRepository(Event_Factor).save(event_factor)
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err)
                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_life_cycle_15 : async () => {
        try {
            try {
                // let date = new Date()
                let minute = 15
                // let result_minute = minute+1
                let hour_brach = 6
                //
                var date = new Date("03-08-2020")
                let time = new Date(date.setHours(date.getHours() - hour_brach))
                let min_time = time
                let max_time = new Date(date.setMinutes(date.getMinutes() + 6))
                // let max_time = new Date(date.setMinutes(date.getMinutes() + 1))
                // let min_time = new Date(date.setMinutes(date.getMinutes() - result_minute))
                // let all_time = []
                const result = await getConnection()
                    .createQueryBuilder()
                    .select(["equipments.id"])
                    .from(Equipments, "equipments")
                    .innerJoin("equipments.status_equipment", "status_equipment")
                    .innerJoin("equipments.fish_pond", "fish_pond")
                    // .where("status_equipment.status = 'ติดตั้งเเล้ว' and equipments.minute_feed = :minute", {minute:minute})
                    .where("equipments.minute_feed = :minute", {minute:minute})
                    .execute();
                let equipment = JSON.parse(JSON.stringify(result))
                for (let i = 0;i<equipment.length;i++){
                    const port = await getConnection()
                        .createQueryBuilder()
                        .select(["port.id","factor.id","fish_pond.id"])
                        .from(Equipments, "equipments")
                        .innerJoin("equipments.port", "port")
                        .innerJoin("port.factor", "factor")
                        .innerJoin("equipments.fish_pond", "fish_pond")
                        .where("equipments.id = :equipment_id", {equipment_id:equipment[i].equipments_id})
                        .execute();
                    let port_of_equipment = JSON.parse(JSON.stringify(port))
                    const fish = await getConnection()
                        .createQueryBuilder()
                        .select(["fish.id","fish.birth_day","fish_specie.id"])
                        .from(Equipments, "equipments")
                        .innerJoin("equipments.fish_pond", "fish_pond")
                        .innerJoin("fish_pond.fish", "fish")
                        .innerJoin("fish.fish_specie", "fish_specie")
                        .where("equipments.id = :equipment_id ", {equipment_id:equipment[i].equipments_id})
                        .execute();
                    let list_fish = JSON.parse(JSON.stringify(fish))
                    let age_fish = []
                    for (let f=0;f<list_fish.length;f++) {
                        let birth_day = new Date(list_fish[0].fish_birth_day)
                        var birth_date = +new Date(birth_day)
                        let float_day = (Date.now() - birth_date) / (31557600000)
                        let sum_day = Math.floor(float_day * 365)
                        age_fish.push(sum_day)
                    }
                    for (let j=0;j<port_of_equipment.length;j++){
                        let equipment_id = equipment[i].equipments_id
                        let port_id = port_of_equipment[j].port_id
                        let factor_id = port_of_equipment[j].factor_id
                        let response = await etlInfo.check_life_cycle_5(equipment_id,port_id,min_time,max_time)
                        for (let f=0;f<list_fish.length;f++) {
                            const life_cycle = await getConnection()
                                .createQueryBuilder()
                                .select(["factor_of_life_cycle.id","factor_of_life_cycle.value_min","factor_of_life_cycle.value_max"])
                                .from(Fish, "fish")
                                .innerJoin("fish.fish_specie", "fish_specie")
                                .innerJoin("fish_specie.life_cycle", "life_cycle")
                                .innerJoin("life_cycle.factor_of_life_cycle", "factor_of_life_cycle")
                                .innerJoin("factor_of_life_cycle.factor", "factor")
                                .where("factor.id = :factor_id and fish.id = :fish_id and (life_cycle.st_age < :age_fish and life_cycle.end_age > :age_fish)", {factor_id: factor_id,fish_id: list_fish[f].fish_id,age_fish:age_fish[f]})
                                .getRawOne();
                            let life_cycle_of_fish = JSON.parse(JSON.stringify(life_cycle))
                            let value_min = life_cycle_of_fish.factor_of_life_cycle_value_min
                            let value_max = life_cycle_of_fish.factor_of_life_cycle_value_max
                            if (response[0].value < value_min) {
                                let event_factor = new Event_Factor()
                                event_factor.value_alert = response[0].value
                                event_factor.massage = "มีค่าต่ำกว่าเกณฑ์มาตรฐาน"
                                event_factor.timestamp = response[0].timestamp
                                event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                                event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                                await getConnection().getRepository(Event_Factor).save(event_factor)
                            }else if (response[0].value > value_max){
                                let event_factor = new Event_Factor()
                                event_factor.value_alert = response[0].value
                                event_factor.massage = "มีค่าสูงกว่าเกณฑ์มาตรฐาน"
                                event_factor.timestamp = response[0].timestamp
                                event_factor.fish = await getConnection().getRepository(Fish).findOne({id:list_fish[f].fish_id})
                                event_factor.factor = await getConnection().getRepository(Factor).findOne({id:port_of_equipment[j].factor_id})
                                await getConnection().getRepository(Event_Factor).save(event_factor)
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err)
                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
    test_auto : async (date_user) => {
        try {
            let test = date_user
            // let test = "2020-07-01T00:00:00.000Z"
            // let hour_brach = 6
            let hour_brach = 24
            // var date = new Date("03-08-2020")
            let date = new Date(test)
            console.log(date)
            // let time = new Date(date.setHours(date.getHours() - hour_brach))
            let time_minute = hour_brach * 60
            let minute_per_round = 15
            let all_time = []
            all_time[0] = new Date(test)
            for(let i = 0;i<=time_minute;i = i + minute_per_round){
                let time = new Time_Dim()
                let date_time = new Date(date.setMinutes(date.getMinutes() + minute_per_round))
                time.date_data = date_time
                await getConnection().getRepository(Time_Dim).save(time)
                all_time.push(date_time)
            }
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","fish_pond.id"])
                .from(Equipments, "equipments")
                .innerJoin("equipments.status_equipment", "status_equipment")
                .innerJoin("equipments.fish_pond", "fish_pond")
                .where("status_equipment.status = 'ติดตั้งเเล้ว' ")
                .execute();
            let equipment = JSON.parse(JSON.stringify(result))
            for (let i = 0;i<equipment.length;i++){
                const port = await getConnection()
                        .createQueryBuilder()
                        .select(["port.id","factor.id"])
                        .from(Equipments, "equipments")
                        .innerJoin("equipments.port", "port")
                        .innerJoin("port.factor", "factor")
                        .where("equipments.id = :equipment_id", {equipment_id:equipment[i].equipments_id})
                        .execute();
                    let port_of_equipment = JSON.parse(JSON.stringify(port))
                for (let j=0;j<port_of_equipment.length;j++){
                    for (let k=0;k<all_time.length;k++){
                        let equipment_id = equipment[i].equipments_id
                        let port_id = port_of_equipment[j].port_id
                        let min_time = k
                        let max_time = min_time+1
                        console.log(all_time[max_time])
                        let response = await etlInfo.etl(equipment_id,port_id,all_time[min_time],all_time[max_time])
                        if (response == false){
                            break;
                        } else {
                            let fact = new Fact_Fish_Pond()
                            fact.value_avg = response
                            fact.pond_dim = await getConnection().getRepository(Pond_Dim).findOne({id:equipment[i].fish_pond_id})
                            fact.time_dim = await getConnection().getRepository(Time_Dim).findOne({date_data:new Date(all_time[max_time])})
                            fact.factor_dim = await getConnection().getRepository(Factor_Dim).findOne({id:port_of_equipment[j].factor_id})
                            await getConnection().getRepository(Fact_Fish_Pond).save(fact)
                        }
                    }
                }
            }
            console.log("success")
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_iot_value_home : async (customer_id,ponds_id) => {
        try {
            let data_iot = Array()
            for (let i=0;i<ponds_id.length;i++){
                const list_factors = await getConnection()
                    .createQueryBuilder()
                    .select(["port.id","factor.facterType"])
                    .from(Customer, "customer")
                    .innerJoin("customer.farm", "farm")
                    .innerJoin("farm.fish_pond", "fish_pond")
                    .innerJoin("fish_pond.equipments", "equipments")
                    .innerJoin("equipments.port", "port")
                    .innerJoin("port.factor", "factor")
                    .where("customer.id = :customer_id and fish_pond.id = :pond_id", {customer_id:customer_id,pond_id:ponds_id[i]})
                    .execute();
                let list_factor = JSON.parse(JSON.stringify(list_factors))
                let iot = Array()
                for (let j=0;j<list_factor.length;j++){
                    const value = await getConnection()
                        .createQueryBuilder()
                        .select(["fact_fish_pond.id","fact_fish_pond.value_avg","factor_dim.facterType","factor_dim.unit"])
                        .from(Fact_Fish_Pond, "fact_fish_pond")
                        .innerJoin("fact_fish_pond.pond_dim", "pond_dim")
                        .innerJoin("fact_fish_pond.factor_dim", "factor_dim")
                        .innerJoin("fact_fish_pond.time_dim", "time_dim")
                        .orderBy('Fact_Fish_Pond.id', 'DESC')
                        .where("pond_dim.id = :pond_id and factor_dim.facterType = :facterType  ", {pond_id:ponds_id[i],facterType:list_factor[j].factor_facterType})
                        .getRawOne();
                    let iot_value = JSON.parse(JSON.stringify(value))
                    let value_min = new Date("2020-03-07T00:00:00.000Z")
                    let value_max = new Date("2020-03-07T00:00:00.000Z")
                    let min_date = new Date(value_min.setHours(0.0))
                    let max_date = new Date(value_max.setHours(value_max.getHours() + 23.59))
                    const test_event = await getConnection()
                        .createQueryBuilder()
                        .select(["event_factor.id"])
                        .from(Event_Factor, "event_factor")
                        .innerJoin("event_factor.fish", "fish")
                        .innerJoin("fish.fish_pond", "fish_pond")
                        .innerJoin("event_factor.factor", "factor")
                        .where("factor.facterType = :facterType and fish_pond.id = :fish_pond_id and  (event_factor.timestamp >= :min_date and event_factor.timestamp <= :max_date)  ", {fish_pond_id:ponds_id[i],facterType:list_factor[j].factor_facterType,min_date:min_date,max_date:max_date})
                        .execute();
                    let test_event_tran = JSON.parse(JSON.stringify(test_event))
                    let test = [iot_value]
                    let data_list = []
                    test.forEach((value, index) => {
                        if (test_event_tran.length != 0){
                            data_list.push({
                                ...value,
                                status: "ผิดปกติ"
                            })
                        }else {
                            data_list.push({
                                ...value,
                                status: "ปกติ"
                            })
                        }
                    })
                    iot.push(data_list[0])
                }
                data_iot.push(iot)
            }
            return data_iot
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_factor_of_pond_customer : async (customer_id,fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["port.id","factor.facterType","factor.unit"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.equipments", "equipments")
                .innerJoin("equipments.port", "port")
                .innerJoin("port.factor", "factor")
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id" , {customer_id:customer_id,fishpond_id:fishpond_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    getfirst_port : async (customer_id,fishpond_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["port.id","factor.id","factor.facterType","factor.unit","factor.y_axis"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.equipments", "equipments")
                .innerJoin("equipments.port", "port")
                .innerJoin("port.factor", "factor")
                .where("customer.id = :customer_id and fishpond.id = :fishpond_id" , {customer_id:customer_id,fishpond_id:fishpond_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_unit_of_port : async (port_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["factor.id","factor.facterType","factor.unit","factor.y_axis"])
                .from(Customer, "customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fishpond")
                .innerJoin("fishpond.equipments", "equipments")
                .innerJoin("equipments.port", "port")
                .innerJoin("port.factor", "factor")
                .where("port.id = :port_id " , {port_id:port_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_iot_by_admin : async (equipments_id) => {
        try {
            let date = new Date()
            let datetouse = date.getDay()
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipment_factor.min","equipment_factor.max","equipment_factor.average","equipment_factor.status","equipment_factor.save_date","factor.facterType","factor.unit"])
                .from(Customer,"customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fish_pond")
                .innerJoin("fish_pond.equipments", "equipments")
                .innerJoin("equipments.list_factor", "list_factor")
                // .from(Port, "list_factor")
                .innerJoin("list_factor.factor", "factor")
                .innerJoin("list_factor.equipment_factor", "equipment_factor")
                .where("equipments.id = :equipments_id ", {equipments_id:equipments_id})
                .orderBy('equipment_factor.save_date' ,'DESC')
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    history_iot : async (customer_id,list_factor_id) => {
        try {
            let date = new Date()
            let datetouse = new Date(date.setDate(date.getDate() - 1))
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipment_factor.min","equipment_factor.max","equipment_factor.average","equipment_factor.status","equipment_factor.save_date","factor.facterType","factor.unit"])
                .from(Customer,"customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fish_pond")
                .innerJoin("fish_pond.equipments", "equipments")
                .innerJoin("equipments.list_factor", "list_factor")
                // .from(Port, "list_factor")
                .innerJoin("list_factor.factor", "factor")
                .innerJoin("list_factor.equipment_factor", "equipment_factor")
                .where("customer.id = :customer_id and list_factor.id = :list_factor_id and equipment_factor.save_date >= :datetouse", {list_factor_id:list_factor_id,customer_id:customer_id,datetouse:datetouse})
                .orderBy('equipment_factor.save_date' ,'DESC')
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    select_history_iot : async (customer_id,list_factor_id,datetouse) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipment_factor.min","equipment_factor.max","equipment_factor.average","equipment_factor.save_date","equipment_factor.status","factor.facterType","factor.unit"])
                .from(Customer,"customer")
                .innerJoin("customer.farm", "farm")
                .innerJoin("farm.fish_pond", "fish_pond")
                .innerJoin("fish_pond.equipments", "equipments")
                .innerJoin("equipments.list_factor", "list_factor")
                // .from(Port, "list_factor")
                .innerJoin("list_factor.factor", "factor")
                .innerJoin("list_factor.equipment_factor", "equipment_factor")
                .where("customer.id = :customer_id and list_factor.id = :list_factor_id and equipment_factor.save_date >= :datetouse ", {list_factor_id:list_factor_id,customer_id:customer_id,datetouse:datetouse})
                .orderBy('equipment_factor.save_date' ,'DESC')
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
                .select(["equipments.id","equipments.code","equipments.description"])
                .from(Equipments, "equipments")
        .getMany();
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_equipments : async (status_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.code","equipments.description","status_equipment.status"])
                .from(Equipments, "equipments")
                .innerJoin("equipments.status_equipment", "status_equipment")
                .where("status_equipment.id = :status_id ", {status_id:status_id})
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    home_list_equipments : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["equipments.id","equipments.code","equipments.description","status_equipment.status"])
                .from(Equipments, "equipments")
                .innerJoin("equipments.status_equipment", "status_equipment")
                .where("status_equipment.status = 'ติดตั้งเเล้ว' ", )
                .execute();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_factor_by_equipments : async (device_number) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["factor.id","factor.facterType","factor.description","factor.unit"])
                .from(Equipments, "equipments")
                .innerJoin("equipments.port", "port")
                .innerJoin("port.factor", "factor")
                .where("equipments.id = :device_number ", {device_number:device_number})
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

export default equipmentInfo