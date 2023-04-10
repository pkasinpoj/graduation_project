import "reflect-metadata";
import {Life_Cycle} from "../../../entity/Life_Cycle";
import {getConnection} from "typeorm";
import {Fish_Specie} from "../../../entity/Fish_Specie";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import tokenInfo_employee from "../../../model/Token_Employee";
import {Factor_Of_Life_Cycle} from "../../../entity/Factor_Of_Life_Cycle";
import {Factor} from "../../../entity/Factor";
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

app.post('/upload_file_factor_of_life_cycle',checkToken_Employee,async (req, res) => {
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
                            let factor_of_life_cycle = new Factor_Of_Life_Cycle()
                            let value_min = parseFloat(data[i]["value_min"])
                            factor_of_life_cycle.value_min = value_min
                            let value_max = parseFloat(data[i]["value_max"])
                            factor_of_life_cycle.value_max = value_max
                            factor_of_life_cycle.life_cycle = await getConnection().getRepository(Life_Cycle).findOne({id:data[i]["life_cycle_id"]})
                            factor_of_life_cycle.factor = await getConnection().getRepository(Factor).findOne({facterType:data[i]["factor"]})
                            await getConnection().getRepository(Factor_Of_Life_Cycle).save(factor_of_life_cycle)
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
