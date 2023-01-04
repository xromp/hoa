
const BillModel = require("../../models/bill")

const UnitResidentModel = require('../../models/unit_resident')
const UnitModel = require('../../models/unit')
const PropertyModel = require('../../models/property')
const BillTypeModel = require('../../models/bill_type')
const UserRoleModel = require('../../models/user_role')
const VendorModel = require('../../models/vendor')
const UserModel = require('../../models/user')

BillModel.belongsTo(UnitResidentModel, {targetKey:'id',foreignKey: 'unit_resident_id'})
BillModel.belongsTo(UnitModel, {targetKey:'id',foreignKey: 'unit_id'})
BillModel.belongsTo(PropertyModel, {targetKey:'id',foreignKey: 'property_id'})
BillModel.belongsTo(VendorModel, {targetKey:'id',foreignKey: 'vendor_id'})

exports.save  = async ()=> {}