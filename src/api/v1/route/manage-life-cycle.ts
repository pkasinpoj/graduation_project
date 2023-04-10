import "reflect-metadata";
import {Life_Cycle} from "../../../entity/Life_Cycle";
import {getConnection} from "typeorm";
import {Fish_Specie} from "../../../entity/Fish_Specie";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import tokenInfo_employee from "../../../model/Token_Employee";
let express = require("express")
let bodyParser = require("body-parser")
var bcrypt = require('bcrypt');
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

app.post('/upload_file_life_cycle',checkToken_Employee,async (req, res) => {
    let employee_id = await tokenInfo_employee.checkInfoEmployee(req.headers['authorization'])
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
                        let date = new Date()
                        for (let i = 0; i < data.length; i++) {
                            let life_cycle = new Life_Cycle()
                            life_cycle.id = data[i]["life_cycle_id"]
                            let st_age = parseInt(data[i]["st_age"])
                            life_cycle.st_age = st_age
                            let end_age = parseInt(data[i]["end_age"])
                            life_cycle.end_age = end_age
                            life_cycle.fish_specie = await getConnection().getRepository(Fish_Specie).findOne({fishspecie:data[i]["specie"]})
                            life_cycle.status = true
                            life_cycle.created_by = employee_id
                            life_cycle.created_date = date
                            await getConnection().getRepository(Life_Cycle).save(life_cycle)
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
