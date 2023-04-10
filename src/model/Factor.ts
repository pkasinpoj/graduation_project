import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Factor} from "../entity/Factor";
import {Factor_Dim} from "../entity/Factor_Dim";

let factorInfo = {
    create : async (name,description,unit,date,employee_id) => {
        try {
            let factor = new Factor()
            factor.facterType = name
            factor.description = description
            factor.unit = unit
            factor.status = true
            factor.created_by = employee_id
            factor.created_date = date
            await getConnection().getRepository(Factor).save(factor)
            let factor_dim = new Factor_Dim()
            factor_dim.id = factor.id
            factor_dim.facterType = name
            factor_dim.unit = unit
            await getConnection().getRepository(Factor_Dim).save(factor_dim)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (factorname,description,employee_id,unit,factor_id,date) => {
        try {
            let factor = await getConnection().getRepository(Factor).findOne({id: factor_id})
            factor.facterType = factorname
            factor.description = description
            factor.updated_by = employee_id
            factor.updated_date = date
            factor.unit = unit
            await getConnection().getRepository(Factor).save(factor)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (factor_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["factor.facterType","factor.description","factor.unit"])
                .from(Factor, "factor")
                .where("factor.id = :factor_id " , {factor_id:factor_id})
                .getRawOne();
            return JSON.parse(JSON.stringify(result))
        } catch (err) {
            console.log(err)
            return false
        }
    },
    list_factor : async () => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["factor.id","factor.facterType","factor.unit"])
                .from(Factor, "factor")
                .where("factor.status = true")
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
                .select(["factor.id","factor.facterType","factor.unit"])
                .from(Factor, "factor")
                .getMany();
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

export default factorInfo