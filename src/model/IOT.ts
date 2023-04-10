var mongoose = require('mongoose');
var mongoDB = 'mongodb://heroku_dlpdrc9g:89pl5i0imsqtelovg60c1et8sb@ds135128.mlab.com:35128/heroku_dlpdrc9g';

let iotInfo = {
    graph_realtime : async (port_id,date) => {
        var date_dataset = new Date("03-08-2020")
        var new_date = new Date(date_dataset)
        var min_date = new Date(date_dataset)
        let date_to_min = new Date(min_date.setHours(min_date.getHours() - 24))
        let date_to_max = new Date(new_date.setHours(new_date.getHours() + 24))
        // let date_to_use = date
        try {
            await mongoose.connect(mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = mongoose.connection;
            let result = await db.collection("dataset").find({"timestamp":{ "$gte": new Date(date_to_min),"$lt": new Date(date_to_max) },"port":port_id}).toArray();
            return result

        } catch (err) {
            console.log(err)
            return false
        }
    },
}

export default iotInfo