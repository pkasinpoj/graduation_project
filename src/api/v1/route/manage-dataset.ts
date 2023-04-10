import "reflect-metadata";
let express = require("express")
let bodyParser = require("body-parser")
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var mongoDB = 'mongodb://heroku_dlpdrc9g:89pl5i0imsqtelovg60c1et8sb@ds135128.mlab.com:35128/heroku_dlpdrc9g';
var fs = require('fs');
var uniqid = require('uniqid');
var exceltojson = require("xls-to-json-lc");
const fileUpload = require('express-fileupload');
let app = express.Router()
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(fileUpload());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/test',async (req, res) => {
    await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let db = mongoose.connection;
    // db.collection("customers").insertOne({"UserName":"Sam","UserLoginDate":new Date("2020-06-20T11:14:21.493Z")})
    var json = "\"2020-06-20T11:14:21.493Z\"";
    var dateStr = JSON.parse(json);
    var date = new Date(dateStr);
    let datetouse = new Date(date.setHours(date.getHours() - 2))
    let result = await db.collection("dataset").find({"timestamp":{ "$gte": new Date(date.setHours(date.getHours() - 2))}}).toArray();
    // let result = await db.collection("customers").find({"UserName": "Sam"}).toArray();
    console.log(result)
    // db.findDataByDateDemo.insert({"UserName":"Sam","UserLoginDate":new Date("2019-05-02")});
})

app.post('/upload_file_dataset',async (req, res) => {
    await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let db = mongoose.connection;
    if (!req.files){
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file;
    const filename = req.files.file.name;
    const fileName = uniqid();
    file.mv('./uploads/' + fileName + '.xls', (err) => {
        let data
        if (err)
            return res.status(500).send(err);
        exceltojson(
            {
                input: './uploads/' + fileName + '.xls', // input xls
                output: "Question_Key_xEng.json", // output json
                lowerCaseHeaders: true
            },
            async function (err, result) {
                if (err) {
                    res.status(400).json({
                        error: err,
                    })
                } else {
                    try {
                        data = result
                        for (let i = 0; i < data.length; i++) {
                            db.collection("dataset").insertOne(
                                {"equip_id":data[i]["equip_id"],
                                       "port":data[i]["port"],
                                       "value":data[i]["value"],
                                       "timestamp":new Date(data[i]["timestamp"])})
                        }
                        fs.unlink('./uploads/' + fileName + '.xls', function (err) {
                            if (err) throw err;
                            res.status(200).json({
                                statusName: 'success',
                            })
                            console.log('successfully deleted ' + './uploads/' + fileName + '.xls');
                        });
                    }
                    catch(e){
                        res.status(400).json({
                            statusName: 'error datacolumn'
                        })
                    }
                }
            }
        )
    });
})

export default app
