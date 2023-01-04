require("dotenv").config();
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
const path = require("path");
var port = process.env.PORT;
const fileUpload = require("express-fileupload");
const cron = require("node-cron");
const mainController = require("./controllers/main");
const { socketIO } = require("./middleware");
import { auth } from "./middleware";

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(fileUpload());
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
module.exports = { io: socketIO(io) };

//Routes
const Auth = require("./routes/auth");
const User = require("./routes/user");
const Portfolio = require("./routes/portfolio");
const Maintenance = require("./routes/maintenance_request");
const Vendor = require("./routes/vendor");
const Billing = require("./routes/payment/billing");
const BillingLine = require("./routes/payment/billing_line");
const Payment = require("./routes/payment/payment");
const PaymentMethod = require("./routes/payment/payment_methods");
const FileManager = require("./routes/file_manager");
const MaintenanceThread = require("./routes/maintenance_request_thread");
const MaintenanceEquipment = require("./routes/maintenance_equipment");
const UserRole = require("./routes/user_role");
const UserRolePermission = require("./routes/user_role_permission");
const ApiHelper = require("./routes/api");
const Docs = require("./routes/document");
const Notification = require("./routes/notification");
const NotificationTemplate = require("./routes/notification_template");
const MaintenanceOrder = require("./routes/maintenance_order");
const MaintenancePart = require("./routes/maintenance_part");
const NotificationSent = require("./routes/notification_sent");
const Caliber = require("./routes/caliber");
const Properties = require("./routes/properties");
const PortfolioManager = require("./routes/portfolio_manager");
const PortfolioUser = require("./routes/portfolio_user");
const PropertyManager = require("./routes/property_manager");
const PropertyUser = require("./routes/property_user");
const Amenity = require("./routes/amenity");
const AmenityReservation = require("./routes/amenity_reservation");
const Unit = require("./routes/unit");
const unitResident = require("./routes/unit_resident");
const unitUser = require("./routes/unit_user");
const AmenityReservationDetail = require("./routes/amenity_reservation_detail");
const Approval = require("./routes/approval");
const ApprovalItem = require("./routes/approver_item");
const Approver = require("./routes/approver");
const UserOrgRole = require("./routes/user_org_role");
const UserModule = require("./routes/user_module");
const VendorUser = require("./routes/vendor_user");
const UserDesignation = require("./routes/user_designation");
const BillType = require("./routes/billing_type");
const Transaction = require("./routes/transaction");
const UserPendingRequest = require("./routes/user_pending_request");

//Use Routes
app.use("/auth", Auth);
app.use("/user", User);
// app.use(auth)
app.use("/portfolio", Portfolio);
app.use("/maintenance", Maintenance);
app.use("/vendor", Vendor);
app.use("/billing", Billing);
app.use("/billing-line", BillingLine);
app.use("/payment", Payment);
app.use("/payment-method", PaymentMethod);
app.use("/file-manager", FileManager);
app.use("/thread", MaintenanceThread);
app.use("/equipment", MaintenanceEquipment);
app.use("/role", UserRole);
app.use("/permission", UserRolePermission);
app.use("/api", ApiHelper);
app.use("/docs", Docs);
app.use("/notification", Notification);
app.use("/notificationTemplate", NotificationTemplate);
app.use("/order", MaintenanceOrder);
app.use("/part", MaintenancePart);
app.use("/notification-sent", NotificationSent);
app.use("/caliber", Caliber);
app.use("/property", Properties);
app.use("/portfolio-manager", PortfolioManager);
app.use("/portfolio-user", PortfolioUser);
app.use("/property-manager", PropertyManager);
app.use("/property-user", PropertyUser);
app.use("/amenity", Amenity);
app.use("/amenity-reservation", AmenityReservation);
app.use("/unit", Unit);
app.use("/unit-resident", unitResident);
app.use("/unit-user", unitUser);
app.use("/amenity-reservation-detail", AmenityReservationDetail);
app.use("/approval", Approval);
app.use("/approval-item", ApprovalItem);
app.use("/approver", Approver);
app.use("/user-org", UserOrgRole);
app.use("/user-module", UserModule);
app.use("/vendor-user", VendorUser);
app.use("/user-designation", UserDesignation);
app.use("/bill-type", BillType);
app.use("/transaction", Transaction);
app.use("/user-pending-request", UserPendingRequest);

//These 2 lines make sure that vue and express app are coming from the same server.
app.use("/", express.static(path.join(__dirname, "./public/")));
// app.get('/', function(req,res) {
//    res.sendFile('index.html', { root: path.join(__dirname, './public/') });
// });

cron.schedule("*/30 * * * *", function () {
  mainController.checkNotification();
  console.log("running a task every 30 minute");
});

cron.schedule("0 8 * * *", function () {
  mainController.maintenanceReminder();
  console.log("running a task daily");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
