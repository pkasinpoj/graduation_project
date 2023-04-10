import "reflect-metadata";
import * as express from 'express'
let server = express()
import routeV1 from './api/v1/route'
// const cron = require("node-cron");
var cron = require('node-schedule');
// var schedule = require("node-schedule");
import {createConnection,getConnection} from "typeorm";
import equipmentInfo from "./model/Equipment";
createConnection().then(async connection => {
    const cors = require('cors');

    const PORT = process.env.APP_PORT || 8080;
    /* Fixed none Authorization CORS*/
    server.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    server.use(cors());
    /* Fixed none Authorization CORS*/

    server.get('/',(req, res)=>{
        res.send("Access denied!")
    })
    server.use('/api/v1',routeV1)

    // var rule = new cron.RecurrenceRule();
    // rule.minute = new cron.Range(0,59,5);
    // cron.scheduleJob(rule,async function(){
    //     await equipmentInfo.check_life_cycle_5()
    // });
    //
    // var rule1 = new cron.RecurrenceRule();
    // rule1.minute = new cron.Range(0,59,10);
    // cron.scheduleJob(rule1,async function(){
    //     await equipmentInfo.check_life_cycle_10()
    // });
    //
    // var rule2 = new cron.RecurrenceRule();
    // rule2.minute = new cron.Range(0,59,15);
    // cron.scheduleJob(rule2,async function(){
    //     await equipmentInfo.check_life_cycle_15()
    // });

    // for (let i=1;i<3;i++){
    //     var rule2 = new cron.RecurrenceRule();
    //     rule2.minute = new cron.Range(0,59,i);
    //     cron.scheduleJob(rule2, function(){
    //         console.log(i);
    //     });
    // }

    server.listen(PORT, () => {
        console.log('Server running:' + PORT);
    })

})

    

