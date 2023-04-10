import * as express from 'express'
let route = express.Router()
// import  Matching   from "./Matching"

import customer from "./manage-customer"
import farm from "./manage-farming"
import fishpond from "./manage-fishpond"
import fish from "./manage-fish"
import specie from "./manage-specie"
import factor from "./manage-factor"
import employee from "./manage-employee"
import equipment from "./manage-equipment"
import accessory_type from "./manage-accessory-type"
import accessory from "./manage-accessory"
import service_type from "./manage-service-type"
import service from "./manage-service"
import position from "./manage-position"
import booking from "./manage-booking"
import manual from "./manage-manual"
import status_equipment from "./manage-status-equipment"
import status_booking from "./manage-status-booking"
// import manage_requisition from "./manage-requisition"
import accessory_requisition from "./manage-accessory-requisition"
import account_type from "./manage-account-type"
import account from "./manage-account"
import dataset from "./manage-dataset"
import port from "./manage-port"
import life_cycle from "./manage-life-cycle"
import factor_of_life_cycle from "./manage-factor-of-life-cycle"
import data_iot from "./manage_data_iot"
import bookng_type from "./manage-bookng-type"




route.get('/',(req, res)=>{
  res.send("Access denied!");
});

route.use('/customer',customer)
route.use('/employee',employee)
route.use('/farm',farm)
route.use('/fishpond',fishpond)
route.use('/fish',fish)
route.use('/specie',specie)
route.use('/factor',factor)
route.use('/equipment',equipment)
route.use('/accessory-type',accessory_type)
route.use('/accessory',accessory)
route.use('/service-type',service_type)
route.use('/service',service)
route.use('/position',position)
route.use('/booking',booking)
route.use('/manual',manual)
route.use('/status-equipment',status_equipment)
route.use('/status-booking',status_booking)
// route.use('/manage-requisition',manage_requisition)
route.use('/accessory-requisition',accessory_requisition)
route.use('/account-type',account_type)
route.use('/account',account)
route.use('/dataset',dataset)
route.use('/port',port)
route.use('/life_cycle',life_cycle)
route.use('/factor_of_life_cycle',factor_of_life_cycle)
route.use('/data-iot',data_iot)
route.use('/bookng-type',bookng_type)

export default route
