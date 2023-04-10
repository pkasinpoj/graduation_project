import {getConnection} from "typeorm";
import {Farm} from "../entity/Farm";
import {Fish_Specie} from "../entity/Fish_Specie";

let specieInfo = {
    create : async (name,description,employee_id,date) => {
        try {
            let specie = new Fish_Specie()
            specie.fishspecie = name
            specie.description = description
            specie.status = true
            specie.created_by = employee_id
            specie.created_date = date
            await getConnection().getRepository(Fish_Specie).save(specie)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    edit : async (speciename,description,employee_id,specie_id,date) => {
        try {
            let specie = await getConnection().getRepository(Fish_Specie).findOne({id: specie_id})
            specie.fishspecie = speciename
            specie.description = description
            specie.updated_by = employee_id
            specie.updated_date = date
            await getConnection().getRepository(Fish_Specie).save(specie)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    showinfo : async (specie_id) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select(["fish_specie.fishspecie","fish_specie.description"])
                .from(Fish_Specie, "fish_specie")
                .where("fish_specie.id = :specie_id " , {specie_id:specie_id})
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
                .select(["fish_specie.id","fish_specie.fishspecie"])
                .from(Fish_Specie, "fish_specie")
                .where("fish_specie.status = true")
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

export default specieInfo