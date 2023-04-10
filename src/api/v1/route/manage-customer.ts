import "reflect-metadata";
import checkToken from "../../../../middleware/checktoken";
import condition from "../../../../services/condition";
import customerInfo from "../../../model/Customer";
import tokenInfo_customer from "../../../model/Token_Customer";
import tokenService from "../../../../services/tokenservices";
import accountService from "../../../../services/accountservice";
import accountInfo from "../../../model/Account";
import farmInfo from "../../../model/Farm";
import equipmentInfo from "../../../model/Equipment";
import tokenInfo_employee from "../../../model/Token_Employee";
import Privilege from "../../../../services/Privilege";
import checkToken_Employee from "../../../../middleware/checktoken_employee";
import sendEmail from "../../../../services/sendEmail";
let express = require("express");
let bodyParser = require("body-parser");
let app = express.Router();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,accesstoken"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (condition.two_values(username, password)) {
    let result = await customerInfo.getInfoUser(username, password);
    if (result === undefined) {
      res.status(400).json({
        statusName: "Login failed",
      });
    } else {
      let account = await accountInfo.info_customer(result.id);
      let token = await tokenInfo_customer.genTokenCustomers(account);
      if (!token) {
        res.status(400).json({
          statusName: "Login failed",
        });
      }
      let customer_id = await tokenInfo_customer.checkInfoCustomers(token);
      let customerinfo = await customerInfo.showInfoUser(customer_id);
      res.status(200).json({
        Authorization: token,
        statusName: "Login Success",
        customerInfo: customerinfo,
      });
    }
  } else {
    res.status(400).json({
      statusName: "No username or password",
    });
  }
});

app.get("/home", checkToken, async (req, res) => {
  let customer_id = await tokenInfo_customer.checkInfoCustomers(
    req.headers["authorization"]
  );
  let farmlist = await farmInfo.showall(customer_id);
  let pond_list = await farmInfo.pond_list_home(customer_id);
  let ponds_id = Array();
  for (let i = 0; i < pond_list.length; i++) {
    ponds_id.push(pond_list[i].fish_pond_id);
  }
  let data_iot = await equipmentInfo.list_iot_value_home(customer_id, ponds_id);
  let j = 0;
  let data = [];
  pond_list.forEach((value, index) => {
    data.push({
      ...value,
      data_iot: Object.assign(data_iot[j++]),
    });
  });
  res.status(200).json({
    statusName: "success",
    farmlist: farmlist,
    pond_list: data,
  });
});

app.post("/dashboard-select", checkToken, async (req, res) => {
  let farm_id = req.body.farm_id;
  if (condition.one_value(farm_id)) {
    let customer_id = await tokenInfo_customer.checkInfoCustomers(
      req.headers["authorization"]
    );
    let farmlist = await farmInfo.showall(customer_id);
    let pond_list = await farmInfo.select_pond_list(customer_id, farm_id);
    let ponds_id = Array();
    for (let i = 0; i < pond_list.length; i++) {
      ponds_id.push(pond_list[i].fish_pond_id);
    }
    if (!farmlist || !pond_list) {
      res.status(200).json({
        statusName: "Data not Found",
      });
    } else {
      let data_iot = await equipmentInfo.list_iot_value_home(
        customer_id,
        ponds_id
      );
      let j = 0;
      let data = [];
      pond_list.forEach((value, index) => {
        data.push({
          ...value,
          data_iot: Object.assign(data_iot[j++]),
        });
      });
      res.status(200).json({
        statusName: "success",
        farmlist: farmlist,
        pond_list: data,
      });
    }
  } else {
    res.status(400).json({
      statusName: "No farm_id ",
    });
  }
});

app.post("/register", async (req, res) => {
  let employee_id = await tokenInfo_employee.checkInfoEmployee(
    req.headers["authorization"]
  );
  let api_name = "register-customer";
  let checkprivilege = await Privilege.check(employee_id, api_name);
  if (checkprivilege) {
    let name = req.body.name;
    let surname = req.body.surname;
    let tel = req.body.tel;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let date = new Date();
    if (condition.three_values(email, username, password)) {
      let result = await customerInfo.register(
        name,
        surname,
        tel,
        email,
        username,
        password,
        date,
        employee_id
      );
      if (!result) {
        res.status(400).json({
          statusName: "Recording failed",
        });
      } else {
        let accountresult = await accountService.createAccount_Customer(
          username,
          password,
          date,
          employee_id
        );
        let token = await tokenInfo_customer.genTokenCustomers(accountresult);
        await sendEmail.register(email, username, password);
        if (!token || !accountresult) {
          res.status(400).json({
            statusName: "Recording failed",
          });
        }
        res.status(200).json({
          Authorization: token,
          statusName: "Save successfully",
        });
      }
    } else {
      res.status(400).json({
        statusName: "No email or username or password",
      });
    }
  } else {
    res.status(400).json({
      statusName: "You dont have permission",
    });
  }
});

app.get("/show", checkToken, async (req, res) => {
  let customer_id = await tokenInfo_customer.checkInfoCustomers(
    req.headers["authorization"]
  );
  let customerinfo = await customerInfo.showInfoUser(customer_id);
  if (!customerinfo) {
    res.status(400).json({
      statusName: "failed",
    });
  }
  res.status(200).json({
    statusName: "Success",
    customerInfo: customerinfo,
  });
});

app.post("/show_info_by_admin", checkToken_Employee, async (req, res) => {
  let employee_id = await tokenInfo_employee.checkInfoEmployee(
    req.headers["authorization"]
  );
  let api_name = "show-info-by-admin-customer";
  let checkprivilege = await Privilege.check(employee_id, api_name);
  if (checkprivilege) {
    let keyword = req.body.keyword;
    if (!condition.one_value(keyword)) {
      res.status(400).json({
        statusName: "No keyword",
      });
    }
    let customer_info = await customerInfo.showInfoUser_by_admin(keyword);
    res.status(200).json({
      statusName: "Success",
      customerInfo: customer_info,
    });
  } else {
    res.status(400).json({
      statusName: "You dont have permission",
    });
  }
});

app.get("/list-by-admin", checkToken_Employee, async (req, res) => {
  let employee_id = await tokenInfo_employee.checkInfoEmployee(
    req.headers["authorization"]
  );
  let api_name = "list_by_admin-customer";
  let checkprivilege = await Privilege.check(employee_id, api_name);
  if (checkprivilege) {
    let list_customer = await customerInfo.list_by_admin();
    res.status(200).json({
      statusName: "Success",
      list_customer: list_customer,
    });
  } else {
    res.status(400).json({
      statusName: "You dont have permission",
    });
  }
});

app.post("/edit", checkToken, async (req, res) => {
  let customer_id = await tokenInfo_customer.checkInfoCustomers(
    req.headers["authorization"]
  );
  let name = req.body.name;
  let surname = req.body.surname;
  let tel = req.body.tel;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  if (!condition.three_values(email, username, password)) {
    res.status(400).json({
      statusName: "No email or username or password.",
    });
  } else {
    if (
      (await customerInfo.edit(
        name,
        surname,
        tel,
        email,
        username,
        password,
        customer_id
      )) === false
    ) {
      res.status(400).json({
        statusName: "์Recording failed",
      });
    }
    res.status(200).json({
      statusName: "edit successfull",
    });
  }
});

app.post("/home-report", checkToken, async (req, res) => {
  let customer_id = await tokenInfo_customer.checkInfoCustomers(
    req.headers["authorization"]
  );
  let date = new Date(req.body.date);
  let pond_id = req.body.pond_id;
  var date_to_use = new Date("07-01-2020");
  let result = await equipmentInfo.report_etl(pond_id, date_to_use);
  res.status(200).json({
    statusName: "edit successfull",
    result: result,
  });
});

app.post("/select-report", checkToken, async (req, res) => {
  let customer_id = await tokenInfo_customer.checkInfoCustomers(
    req.headers["authorization"]
  );
  let date = new Date(req.body.date);
  let pond_id = req.body.pond_id;
  // var date_to_use = new Date("07-01-2020")
  let result = await equipmentInfo.report_etl(pond_id, date);
  res.status(200).json({
    statusName: "edit successfull",
    result: result,
  });
});

// app.get('/test',async (req, res) => {
//     console.log("hi")
//     await sendEmail.test()
// })

app.post("/logout", checkToken, async (req, res) => {
  if (
    (await tokenService.deleteToken(req.headers["authorization"])) === false
  ) {
    res.status(400).json({
      statusName: "logout unsuccessful",
    });
  }
  res.status(200).json({
    statusName: "logout successfull",
  });
});

export default app;
