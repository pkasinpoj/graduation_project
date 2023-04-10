import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Service} from "../entity/Service";
import {Service_Type} from "../entity/Service_Type";
import {Position} from "../entity/Position";
import {Equipments} from "../entity/Equipments";

let serviceInfo = {
    create : async (name,description,type_id,employee_id,date) => {
        try {
            let service = new Service()
            service.name = name
            service.description = description
            service.status = true
            service.created_by = employee_id
            service.created_date = date
            service.service_type = await getConnection().getRepository(Service_Type).findOne({id:type_id})
            await getConnection().getRepository(Service).save(service)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (service_id,name,description,employee_id,date) => {
        try {
            let service = await getConnection().getRepository(Service).findOne({id: service_id})
            service.name = name
            service.description = description
            service.updated_by = employee_id
            service.updated_date = date
            await getConnection().getRepository(Service).save(service)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (service_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.name","service.description","service.status"])
                .from(Service, "service")
                .where("service.id = :service_id " , {service_id:service_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_service_by_type : async (service_type_id) => {
        try {
            let data_service = Array()
            for (let i=0;i<service_type_id.length;i++){
                const value = await getConnection()
                    .createQueryBuilder()
                    .select(["service.id","service.name","service.description"])
                    .from(Service_Type, "service_type")
                    .innerJoin("service_type.service", "service")
                    .where("service_type.id = :service_type_id and service.status = true", {service_type_id:service_type_id[i]})
                    .execute();
                let list_service = JSON.parse(JSON.stringify(value))
                data_service.push(list_service)
            }
            return data_service
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showall : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.id","service.name","service.description"])
                .from(Service, "service")
                .where("service.status = true")
                .getMany();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showlist_type : async (type_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.id","service.name","service.description"])
                .from(Service, "service")
                .innerJoin("service.service_type", "service_type")
                .where("service_type.id = :type_id " , {type_id:type_id})
                .getMany();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    home_list_service : async () => {
        try {
            const data = await getConnection()
                .createQueryBuilder()
                .select(["service_type.id","service_type.typeName","service_type.description"])
                .from(Service_Type, "service_type")
                .where("service_type.status = true")
                .getOne();
            let date_type = JSON.parse(JSON.stringify(data))
            const result = await getConnection()
                .createQueryBuilder()
                .select(["service.id","service.name","service.description"])
                .from(Service, "service")
                .innerJoin("service.service_type", "service_type")
                .where("service_type.id = :service_type_id ", {service_type_id:date_type.id})
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

export default serviceInfo