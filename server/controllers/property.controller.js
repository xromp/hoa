const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const http = require('http')
const Property = require('../models/property')
const PropertyManager = require('../models/property_manager')
const PropertyUser = require('../models/property_user')
const Salutation = require('../models/salutation')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const UserOrgRole = require('../models/user_org_role')
const Building = require('../models/building')
const ParentOrg = require('../models/pmc')
const Unit = require('../models/unit')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const today = new Date()
const userOrgRoleController = require('../controllers/user_org_role.controller');
import { 
  bulkCreate as bulkCreateBuilding, 
  bulkUpdate as bulkdUpdateBuilding,
} from "../controllers/building.controller";

const { createDefaultPropertyFolders } = require("./file_manager");

Property.hasMany(PropertyManager, {foreignKey: 'property_id'})
Property.hasMany(PropertyUser, {foreignKey: 'property_id'})
Property.hasMany(Building, {foreignKey: 'property_id'})
Property.hasMany(Unit, { foreignKey: 'building_id'})
Property.hasMany(UserRole, { foreignKey: 'property_id' })
Property.hasMany(UserOrgRole, { foreignKey: 'property_id' })
PropertyManager.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
PropertyUser.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
Property.belongsTo(ParentOrg, {targetKey:'id',foreignKey: 'pmc_id'})
UserOrgRole.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
User.belongsTo(Salutation, { foreignKey: 'salutation_id' })

exports.getPropertyByPmcId = async (data) => {
  const result = await Property.findAll({
    include: [
      {
        model: PropertyManager,
        where: {
          pmc_id: data.headersPmcId,
        },
        include: [
          {
            model: User,
            where: {
              id: data.decodedId,
            },
          },
        ],
        required: true,
        right: true,
      },
    ],

    order: [["id", "DESC"]],
    where: {
      is_active: true,
    },
  });

  return result;
};

exports.getProperty = async (data) => {
  // let result = []
  // const userRole = await module.exports.findUserRole(data.decodedUserRoleId)
  // data.userId = data.decodedId
  // data.pmcId = data.decodedPmcId

  //  result = await module.exports.findPropertyByUser(data)

  let result = await UserOrgRole.findAll({
    include: [
      {
        model: Property,
        where: {
          is_active: true,
        },
      },
    ],
    where: {
      pmc_id: data.parent_org_id,
      user_id: data.decodedId,
      property_id: {
        [Op.ne]: "0",
      },
    },
    required: true,
    right: true,
    // group: ['property.ref']
  })
    .filter(({ property }) => property.pmc_id === data.parent_org_id)
    .map(({ property }) => property);
  result = [...new Map(result.map((item) => [item["id"], item])).values()];

  return result;
};

exports.getPropertyByParamsId = async (id) => {
	const result = await Property.findOne({
    include: [
      { model: Building },
      { model: ParentOrg }
    ],
    where: { id }
  })
  return result
}

exports.getPropertyByType = async (data) => {
  let result = [];
  if (data.paramsType === "code") {
    result = await Property.findOne({
      where: {
        code: data.paramsVal,
      },
    });
  } else if (data.paramsType === "property_ref") {
    result = await Property.findOne({
      where: {
        ref: data.paramsVal,
      },
    });
  } else {
    if (data.role_val === "admin") {
      //|| data.role_val !== 'manager' || data.role_val !== 'parent'
      result = await Property.findOne({
        where: {
          id: parseInt(data.paramsVal),
        },
      });
    } else {
      result = await UserOrgRole.findAll({
        include: [{ model: Property }],
        where: {
          property_id: parseInt(data.paramsVal),
          pmc_id: parseInt(data.parent_org_id),
        },
      }).map(({ property }) => property);
    }
  }

  return result;
};

exports.generatePropertyCode = async () => {
  const code = Math.random().toString(36).substr(2, 6);
  const property = await Property.findOne({ where: { code } });
  if (property) return this.generatePropertyCode();
  return code;
};

exports.generatePropertyRef = async (name, id) => {
  const code = Math.random().toString(36).substr(1, 3);
  const result = Buffer.from(name + code).toString("hex");

  return result.slice(-7) + "-" + id;
};

exports.postProperty = async (data) => {
  try {
    let result = [];

    if (data.paramsId == -1) {
      result = await this.createProperty(data);
      const currentData = {
        ...data,
        user_id: data.decodedId,
        pmc_id: parseInt(data.current_env.parent_org_id),
        property_id: result["dataValues"]["id"],
        role_id: parseInt(data.current_env.role_id),
        type: "add",
        unit_id: 0,
        is_clone: true,
      };

      await userOrgRoleController.postUserOrgRole(currentData)
      await createDefaultPropertyFolders(currentData);

      if (!!data.buildings) {
        data.buildings = data.buildings.filter((result) => result.property_id = currentData.property_id)
        bulkCreateBuilding(data.buildings);
      }
    } else {
      result = await this.updateProperty(data);
      bulkdUpdateBuilding({
        property_id: data.paramsId,
        buildings: data.buildings,
      });
    }

    return { message: "success", result };
  } catch (error) {
    throw new Error(error);
  }
};

exports.createProperty = async (data) => {
  const code = await this.generatePropertyCode();
  const ref = await this.generatePropertyRef(data.name, data.pmc_id);
  const result = await Property.create({
    name: data.name,
    address_line_1: data.address_line_1,
    address_line_2: data.address_line_2,
    city: data.city,
    postal_code: data.postal_code,
    state: data.state,
    country_id: data.country_id,
    radius: data.radius,
    code,
    is_deleted: data.is_deleted,
    created_by_manager_id: data.created_by_manager_id,
    manager_id: data.manager_id,
    property_type: data.property_type,
    permissions1_json: data.permissions1_json,
    permissions2_json: data.permissions2_json,
    domain: data.domain,
    pmc_id: data.pmc_id,
    photo_filename: data.photo_filename,
    ref,
    settings_json: data.settings_json,
    email_signature: data.email_signature,
    caliber_client_id: data.caliber_client_id,
    BillingAddress1: data.BillingAddress1,
    BillingAddress2: data.BillingAddress2,
    BillingAddress3: data.BillingAddress3,
    BillingCity: data.BillingCity,
    BillingCountry: data.BillingCountry,
    BillingFax: data.BillingFax,
    BillingPhoneArea: data.BillingPhoneArea,
    BillingPhone: data.BillingPhone,
    BillingPhoneType: data.BillingPhoneType,
    BillingState: data.BillingState,
    BillingZip: data.BillingZip,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });

  return result;
};

exports.updateProperty = async (data) => {
  const result = await Property.update(
    {
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2,
      city: data.city,
      postal_code: data.postal_code,
      state: data.state,
      country_id: data.country_id,
      radius: data.radius,
      is_deleted: data.is_deleted,
      created_by_manager_id: data.created_by_manager_id,
      manager_id: data.manager_id,
      property_type: data.property_type,
      permissions1_json: data.permissions1_json,
      permissions2_json: data.permissions2_json,
      domain: data.domain,
      pmc_id: data.pmc_id,
      photo_filename: data.photo_filename,
      ref: data.ref,
      settings_json: data.settings_json,
      email_signature: data.email_signature,
      caliber_client_id: data.caliber_client_id,
      BillingAddress1: data.BillingAddress1,
      BillingAddress2: data.BillingAddress2,
      BillingAddress3: data.BillingAddress3,
      BillingCity: data.BillingCity,
      BillingCountry: data.BillingCountry,
      BillingFax: data.BillingFax,
      BillingPhoneArea: data.BillingPhoneArea,
      BillingPhone: data.BillingPhone,
      BillingPhoneType: data.BillingPhoneType,
      BillingState: data.BillingState,
      BillingZip: data.BillingZip,
      updatedAt: data.updatedAt,
    },
    {
      where: {
        id: data.paramsId,
      },
    }
  );

  return result;
};

exports.findUserRole = async (id) => {
  const result = await UserRole.findOne({
    where: {
      id,
    },
  });

  return result;
};

exports.findPropertyByAdmin = async (data) => {
  const result = await Property.findAll({
    include: [
      {
        model: PropertyManager,
        include: [
          {
            model: User,
            where: {
              id: data.userId,
              pmc_id: data.pmcId,
            },
          },
        ],
        required: true,
        right: true,
      },
    ],

    order: [["id", "DESC"]],
    where: {
      is_active: true,
    },
  });

  return result;
};

exports.findPropertyByUser = async (data) => {
  const result = await Property.findAll({
    where: {
      pmc_id: data.queryPmcId,
      is_active: true,
    },
    order: [["id", "DESC"]],
  });

  return result;
};

export const findPropertyByRef = async ({ ref }) => {
  const property = await Property.findOne({ where: { ref } });
  if (!property) throw new Error("Property reference is invalid.");
  return property.dataValues;
};

exports.findPropertyById = async ({ id }) => {
  const property = await Property.findOne({ where: { id } });
  if (!property) throw new Error("Property reference is invalid.");
  return property;
};

exports.findPropertyByPMC = async ({ pmc_id }) => {
  const property = await Property.findAll({
    where: {
      pmc_id,
      is_active: true,
    },
    raw: true,
  });
  if (!property) throw new Error("Property reference is invalid.");
  return property;
};

exports.deletePropertyById = async (data) => {
  await Property.update({
    is_active: false,
  }, {
    where: {
      id: data.id
    }
  });

  const result = await this.getProperty(data);
  return result;
}

export const getPropertyForRegistration = async ({ code }) => {
  const salutation = await Salutation.findAll({});
  const property = await Property.findOne({
    attributes: ["id", "code", "name"],
    include: [
      {
        model: UserOrgRole,
        where: { is_clone: false },
        required: false,
        left: true,
        include: [
          {
            model: User,
            attributes: [
              "id",
              // 'email',
              "first_name",
              "middle_name",
              "last_name",
              "full_name",
              "suffix",
              "dob",
              "phone1",
              "phone2",
            ],
            include: [{ model: Salutation, attributes: ["id", "name"] }],
          },
        ],
      },
      {
        model: Unit,
        attributes: ["id", "number"],
      },
      {
        model: UserRole,
      },
    ],
    where: { code },
  });
  console.log({ code });
  return property ? { ...property.dataValues, salutation } : null;
};
