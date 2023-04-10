var mongoose = require('mongoose');
var mongoDB = 'mongodb://heroku_dlpdrc9g:89pl5i0imsqtelovg60c1et8sb@ds135128.mlab.com:35128/heroku_dlpdrc9g';

let etlInfo = {
    etl : async (equipment_id,port_id,min_time,max_time) => {
        try {
            await mongoose.connect(mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = mongoose.connection;
            let result = await db.collection("dataset").find({"timestamp":{ "$gte": new Date(min_time), "$lt": new Date(max_time) },"equip_id":equipment_id,"port":port_id}).toArray();
            let sum = 0
            for (let i =0;i<result.length;i++){
                let value = parseFloat(result[i].value)
                sum = sum + value
            }
            if (result.length == 0) {
                return false
            }else {
                let avg = sum/result.length
                let last_avg = parseFloat(avg.toFixed(2))
                return last_avg
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
    check_life_cycle_5 : async (equipment_id,port_id,min_time,max_time) => {
        try {
            await mongoose.connect(mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = mongoose.connection;
            let result = await db.collection("dataset").find({"timestamp":{ "$gte": new Date(min_time), "$lt": new Date(max_time) },"equip_id":equipment_id,"port":port_id}).toArray();
            if (result.length == 0) {
                return false
            }else {
                return result
            }
        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default etlInfo