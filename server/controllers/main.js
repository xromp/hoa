const MaintenanceRequest = require("../models/maintenance_request");
const MaintenanceRequestVendor = require("../models/maintenance_request_vendor");
const NotificationRepeat = require("../models/notification_repeat");
const Notification = require("../models/notification");
const NotificationMessage = require("../models/notification_message");
const Vendor = require("../models/vendor");
const User = require("../models/user");
const mailController = require("../controllers/mail");
const pushNotif = require("../controllers/push_notif");
const notificationController = require("../controllers/notification.controller");
const Property = require("../models/property");
const {
  findUserByVendorId,
} = require("../controllers/maintenance_request.controller");
const { io } = require("../beta-axp");
const moment = require("moment");
let today = new Date();

MaintenanceRequest.belongsTo(MaintenanceRequestVendor, {
  targetKey: "maintenance_request_id",
  foreignKey: "id",
});
MaintenanceRequestVendor.belongsTo(User, {
  targetKey: "vendor_id",
  foreignKey: "vendor_id",
});
MaintenanceRequest.belongsTo(Property, {
  targetKey: "id",
  foreignKey: "property_id",
});
NotificationRepeat.belongsTo(Notification, {
  targetKey: "id",
  foreignKey: "notification_id",
});
Notification.belongsTo(User, { targetKey: "id", foreignKey: "user_id" });
Notification.belongsTo(NotificationMessage, {
  targetKey: "id",
  foreignKey: "notification_message_id",
});
let timezoneOffset = new Date().getTimezoneOffset() / -60;
//new Date().getTimezoneOffset() / -60
//0

exports.maintenanceReminder = async () => {
  try {
    let result = await MaintenanceRequest.findAll({
      include: [{ model: Property }],
      order: [["id", "DESC"]],
    });
    result = [
      ...new Map(result.map((item) => [item["order_id"], item])).values(),
    ];

    for (key in result) {
      const vendors = await findUserByVendorId(
        JSON.parse(result[key]["dataValues"]["rfp_recipients"])
      );
      let start = new Date();
      // start.setDate(start.getDate() + 2);
      let end = result[key]["dataValues"]["rfp_due_date"];
      let diff = Math.round(end.getTime() - start.getTime());
      let diff_days = diff / 3600000 / 24;

      console.log("start: ", start);
      console.log("end: ", end);
      console.log("diff_days: ", diff_days);

      if (diff_days <= 3 && diff_days > 0) {
        for (const { id, email, vendor_user } of vendors) {
          let business_name = vendor_user.vendor.business_name;
          let request_no = result[key]["dataValues"]["request_no"];
          let property_name = result[key]["dataValues"]["property"]["name"];
          let property_id = result[key]["dataValues"]["property"]["id"];
          let request_to = result[key]["dataValues"]["request_to"];

          let h1_title = `Maintenace RFP Due in ${diff_days.toFixed(0)} day(s)`;
          let p_body = `Hi ${business_name}, Request For Proposal for Work Order ${request_no} from Property ${property_name} closes in ${diff_days.toFixed(
            0
          )} day(s). Would you like to respond to it? Click SignIn`;

          if (email !== null) {
            console.log("sending ", diff_days);
            console.log("sending ", diff_days.toFixed(0));
            const notificationData = {
              title: h1_title,
              webBody: p_body,
              mobileBody: p_body,
              emailBody: p_body,
              propertyId: property_id,
              decodedId: request_to,
              send_by: request_to,
              type: "single",
              userData: null,
              user_id: id,
              email: email,
              emails: null,
              updatedAt: new Date(),
              createdAt: new Date(),
            };
            await notificationController.webMobileEmailNotification(
              notificationData
            );
          }
        }
      }
    }
  } catch (err) {
    console.log("Error: ", err.toString("utf8"));
    throw new Error(err.toString("utf8"));
  }
};

exports.checkMaintenanceendDate = async () => {
  try {
    const maintD = await MaintenanceRequest.findAll({
      include: [
        {
          model: MaintenanceRequestVendor,
          include: [{ model: User }],
        },
      ],
      where: {
        // eta_dt: today
        id: 591,
      },
    });

    for (maintKey in maintD) {
      //   console.log("maintD[maintKey]['dataValues']['maintenance_request_vendor']['vendor_id'] ", maintD[maintKey]['dataValues']['maintenance_request_vendor']['vendor_id'])
      //   console.log("maintD[maintKey]['dataValues']['maintenance_request_vendor']['user']['email'] ", maintD[maintKey]['dataValues']['maintenance_request_vendor']['user'] === null ? '' : maintD[maintKey]['dataValues']['maintenance_request_vendor']['user']['email'])

      today = new Date();
      today.setDate(today.getDate() + 2);
      var endDate = maintD[0]["dataValues"]["eta_dt"];

      console.log("today: ", today.toLocaleString());
      console.log("endDate: ", endDate.toLocaleString());
      console.log(
        "today.getDate() == endDate.getDate() ",
        today.getDate() == endDate.getDate()
      );

      var h1_title = "Maintenace Due";
      var p_body =
        "Your job request will be due on " + endDate.toLocaleString();
      var email =
        maintD[maintKey]["dataValues"]["maintenance_request_vendor"]["user"] ===
        null
          ? null
          : maintD[maintKey]["dataValues"]["maintenance_request_vendor"][
              "user"
            ]["email"];

      if (email !== null) {
        mailController.sendEmail(email, h1_title, p_body);
      }
    }
  } catch (err) {
    console.log("Err ", err);
  }
};

exports.checkNotification = async () => {
  try {
    const nr = await NotificationRepeat.findAll({
      include: [
        {
          model: Notification,
          include: [{ model: User }, { model: NotificationMessage }],
        },
      ],
      where: {
        isRecurring: 1,
      },
    });

    for (nrKey in nr) {
      // console.log("nr user ", nr[nrKey]['dataValues']['notification']['user']['email'])
      // console.log("nr title ", nr[nrKey]['dataValues']['notification']['notification_message']['title'])
      // console.log("nr message ", nr[nrKey]['dataValues']['notification']['notification_message']['message'])

      var startDate = nr[nrKey]["dataValues"]["start_date"];
      var endDate = nr[nrKey]["dataValues"]["end_date"];
      var weekDate = JSON.parse(nr[nrKey]["dataValues"]["weekly"]);
      var se = false;

      today = new Date();
      // today.setDate(today.getDate() + 2);

      // var dueMonth = new Date()
      // dueMonth.setMonth(dueMonth.getMonth() + 1);

      // var dueYear = new Date()
      // dueYear.setFullYear(dueYear.getFullYear() + 1);

      // console.log('today: ', today.toLocaleString());
      // console.log('endDate: ', endDate.toLocaleString());
      // console.log('today.getDate() == endDate.getDate() ', today.getDate() >= endDate.getDate() )
      // console.log('today.getTime() == endDate.getTime() ', today.getTime() >= endDate.getTime() )

      // console.log('today.getDay() ', today.getDay() )
      // console.log('endDate.getDay() ', endDate.getDay() )
      // console.log('today.getDay() == endDate.getDay() ', today.getDay() >= endDate.getDay() )

      // console.log('today.getMonth() ', today.getMonth() )
      // console.log('endDate.getMonth() ', endDate.getMonth() )
      // console.log('today.getMonth() == endDate.getMonth() ', today.getMonth() >= endDate.getMonth() )

      console.log(
        "================================================================"
      );
      console.log(
        "nr[nrKey]['dataValues']['repeat_type'] == 1 ",
        nr[nrKey]["dataValues"]["repeat_type"] == 1
      );
      console.log(
        "weekDate.indexOf(today.getDay().toLocaleString()) ",
        weekDate.indexOf(today.getDay().toLocaleString())
      );
      console.log(
        "today.getDate() >= endDate.getDate() ",
        today.getDate() <= endDate.getDate()
      );
      console.log(
        "today.getTime() >= endDate.getTime() ",
        today.getTime() <= endDate.getTime()
      );
      console.log(
        "today.getHours() == startDate.getHours() ",
        today.getHours() == startDate.getHours()
      );
      console.log(
        "today.getDate() == startDate.getDate() ",
        today.getDate() == startDate.getDate()
      );

      if (
        nr[nrKey]["dataValues"]["repeat_type"] == 1 &&
        weekDate.indexOf(today.getDay().toLocaleString()) != -1 &&
        today.getDate() <= endDate.getDate() &&
        today.getTime() <= endDate.getTime() &&
        today.getHours() == startDate.getHours()
      ) {
        console.log(
          "================================================================"
        );
        console.log(
          "================================================================"
        );
        console.log("Daily");
        console.log("today.getDay() 1: ", today.getDay().toLocaleString());
        console.log("today: ", today.toLocaleString());
        console.log("endDate: ", endDate.toLocaleString());
        se = true;
      } else if (
        nr[nrKey]["dataValues"]["repeat_type"] == 2 &&
        today.getDate() <= endDate.getDate() &&
        today.getTime() <= endDate.getTime() &&
        today.getHours() == startDate.getHours() &&
        today.getDate() == startDate.getDate()
      ) {
        console.log(
          "================================================================"
        );
        console.log(
          "================================================================"
        );
        console.log("Monthly");
        console.log("today.getDay() 1: ", today.getDay().toLocaleString());
        console.log("today: ", today.toLocaleString());
        console.log("endDate: ", endDate.toLocaleString());
        se = true;
      } else if (
        nr[nrKey]["dataValues"]["repeat_type"] == 3 &&
        today.getDate() <= endDate.getDate() &&
        today.getTime() <= endDate.getTime() &&
        today.getHours() == startDate.getHours() &&
        today.getDate() == startDate.getDate() &&
        today.getMonth() == startDate.getMonth()
      ) {
        console.log(
          "================================================================"
        );
        console.log(
          "================================================================"
        );
        console.log("Annual");
        console.log("today.getDay() 1: ", today.getDay().toLocaleString());
        console.log("today: ", today.toLocaleString());
        console.log("endDate: ", endDate.toLocaleString());
        se = true;
      }

      var h1_title =
        "You have new notification: " +
        nr[nrKey]["dataValues"]["notification"]["notification_message"][
          "title"
        ];
      var p_body =
        nr[nrKey]["dataValues"]["notification"]["notification_message"][
          "message"
        ];
      var email = nr[nrKey]["dataValues"]["notification"]["user"]["email"];

      if (email !== null && se) {
        pushNotif.sendMessage(email, h1_title, p_body);
        mailController.sendEmail(email, h1_title, p_body);
      }
      const { socket_id } = nr[nrKey]["dataValues"]["notification"]["user"];
      const { title, message } =
        nr[nrKey]["dataValues"]["notification"]["notification_message"];
      io.sockets.to(socket_id).emit("notify-user", { title, message });
    }
  } catch (err) {
    console.log("Err ", err);
  }
};

exports.formatDate = (strDate) => {
  let objDate = moment(strDate, "YYYY-MM-DD HH:mm");
  if (!objDate.isValid()) {
    return "";
  }
  return objDate.format("MMM DD YYYY");
  // return objDate.format("YYYY-MM-DD HH:mm");
};

export const formatDate2 = (strDate) => {
  let objDate = moment(strDate, "YYYY-MM-DD HH:mm:ss");
  if (!objDate.isValid()) {
    return "";
  }
  return objDate.format("YYYY-MM-DD HH:mm");
};

exports.formatDate3 = (strDate) => {
  let objDate = moment(strDate, "YYYY-MM-DD HH:mm:ss");
  if (!objDate.isValid()) {
    return "";
  }
  return objDate.format("YYYY-MM-DD");
};

exports.formatTime = (strDate) => {
  let objDate = moment(strDate, "YYYY-MM-DD HH:mm");
  if (!objDate.isValid()) {
    return "";
  }
  return objDate.format("HH:mm");
};

exports.setNewTZ = (d) => {
  let objDate = d.setHours(d.getHours() + timezoneOffset);
  return objDate;
};

exports.addHours = (strDate, h) => {
  let objDate = moment(strDate).add(h, "hours").format("YYYY-MM-DD HH:mm");
  return objDate;
};

exports.subtractHours = (strDate, h) => {
  let objDate = moment(strDate).subtract(h, "hours").format("YYYY-MM-DD HH:mm");
  return objDate;
};

exports.addDays = (strDate, d) => {
  let objDate = moment(strDate).add(d, "days").format("YYYY-MM-DD HH:mm");
  return objDate;
};

exports.convertT = (t, d) => {
  let isAm = t.indexOf("AM") !== -1;
  let isPm = t.indexOf("PM") !== -1;

  let nStartTime = null;
  if (isAm) {
    nStartTime = t.replace("AM", "");
    nStartTime = new Date(d + " " + nStartTime);
    nStartTime.setHours(nStartTime.getHours() + timezoneOffset);
  } else if (isPm) {
    nStartTime = t.replace("PM", "");
    nStartTime = new Date(d + " " + nStartTime);
    nStartTime.setHours(nStartTime.getHours() + timezoneOffset);
    if (nStartTime.getHours() !== 12) {
      nStartTime.setHours(nStartTime.getHours() + 12);
    }
  }

  return nStartTime;
};

exports.setTime = (date, h, m) => {
  let objDate = new Date(date);
  objDate.setHours(h);
  objDate.setMinutes(m);
  objDate = moment(objDate, "YYYY-MM-DD HH:mm");

  return objDate.format("YYYY-MM-DD HH:mm");
};

exports.replaceTime = (d, t) => {
  let isAm = t.indexOf("AM") !== -1;
  let isPm = t.indexOf("PM") !== -1;
  let objDate = module.exports.formatDate3(d);
  let objTime = null;

  if (isAm) {
    objTime = t.replace("AM", "");
    objDate = new Date(objDate + " " + objTime);
  } else if (isPm) {
    objTime = t.replace("PM", "");
    objDate = new Date(objDate + " " + objTime);

    if (objDate.getHours() !== 12) {
      objDate.setHours(objDate.getHours() + 12);
    }
  }

  return objDate;
};

exports.convertTime = (t, d) => {
  let isAm = t.indexOf("AM") !== -1;
  let isPm = t.indexOf("PM") !== -1;

  let nStartTime = null;
  if (isAm) {
    nStartTime = t.replace("AM", "");
    nStartTime = new Date(d + " " + nStartTime);
    nStartTime.setHours(nStartTime.getHours() + timezoneOffset); //*
  } else if (isPm) {
    nStartTime = t.replace("PM", "");
    nStartTime = new Date(d + " " + nStartTime);
    nStartTime.setHours(nStartTime.getHours() + timezoneOffset); //*

    if (nStartTime.getHours() !== 12) {
      nStartTime.setHours(nStartTime.getHours() + 12);
    }
  }

  return nStartTime;
  // timezoneOffset
  // 8
};

exports.addTime = (strDate, h, t) => {
  let objDate = moment(strDate).add(h, t).format("hh:mmA");
  return objDate;
};

exports.addTime3 = (strDate, h, t) => {
  let objDate = moment(strDate).add(h, t).format("YYYY-MM-DD HH:mm");
  return new Date(objDate);
};

exports.getWeek = (d) => {
  let objDate = moment(d, "YYYY-MM-DD HH:mm");
  if (!objDate.isValid()) {
    return "";
  }
  return objDate.format("w");
};
