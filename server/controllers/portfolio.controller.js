const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const http = require("http");
const Portfolio = require("../models/pmc");
const PmcManager = require("../models/pmc_manager");
const User = require("../models/user");
const BillTypes = require("../models/bill_type");
const {
  getPortfolioByQuery,
  postUserOrgRole,
  assignNewParentAdminRoleByEmail,
} = require("./user_org_role.controller");
const { postProperty } = require("./property.controller");
const { postUserRolePermission } = require("./user_role.controller");
const { createDefaultBillTypesByPmcId } = require("./billing_type.controller");

const today = new Date();

Portfolio.hasMany(PmcManager, { foreignKey: "pmc_id" });
PmcManager.belongsTo(User, { targetKey: "id", foreignKey: "user_id" });

exports.getPortfolioByUserId = async (id) => {
  const result = await Portfolio.findAll({
    order: [["id", "DESC"]],
    where: { is_deleted: false },
  });

  return result;
};

exports.getPortfolioById = async (id) => {
  const result = await Portfolio.findOne({
    where: { id },
  });

  return result;
};

exports.getPortfolioByName = async (data) => {
  if (data.name === data.old_name) return true
  const result = await Portfolio.findOne({
    where: { name: data.name }
  })

  return result;
};

exports.postPortfolio = async (data) => {
  try {
    let result = [];
    if (data.paramsId == -1) {
      const defaultFuzeAccount = {
        InsightTag: "T0250702-0010000-00000000", //HOA Dues by default
        Fuze_Account_ID: "0M001R00WQ",
        Fuze_PUBLIC_API_Key: "k3trRP3sDSjca4EfFslMtScZz",
        Fuze_PRIVATE_API_Key: "V6LCjPvKLjgvrNAbpCSTvj6bF",
      };
      const portfolio_result = await Portfolio.create({
        name: data.name,
        notes: data.notes,
        address: data.address,
        phone: data.phone,
        classification: data.classification,
        email: data.email,
        fuze_obj: JSON.stringify(defaultFuzeAccount),
        is_deleted: false,
        updatedAt: today,
        createdAt: today,
      });

      data.pmc_id = portfolio_result["dataValues"]["id"];
      data.parent_org_id = portfolio_result["dataValues"]["id"];
      data.name = data.property_name;
      data.property_type = "single";
      data.caliber_client_id = 0;
      data.createdAt = today;
      const property_result = await postProperty(data);

      data.property_id = property_result["result"]["id"];
      const role_result = await postUserRolePermission(data);

      data.user_role_id = data.role_id;
      data.role_id = role_result[0]["id"];
      data.type = "add";
      data.unit_id = 0;
      data.is_clone = true;
      await postUserOrgRole(data);

      const user_org_role = role_result.filter(
        (result) => data.current_env.role_val === result.val
      );

      //assign current user
      data.user_role_id = data.role_id;
      data.role_id = user_org_role[0]["id"];
      data.type = "assign";
      data.unit_id = 0;
      data.user_id = [data.decodedId];
      data.is_clone = true;
      const user_org_result = await postUserOrgRole(data);
      createDefaultBillTypesByPmcId(data.pmc_id);
      assignNewParentAdminRoleByEmail({
        pmc_id: data.pmc_id,
        property_id: data.property_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        sender_id: data.decodedId,
      });
      return {
        portfolio_result,
        property_result,
        role_result,
        user_org_result,
      };
    } else {
      await Portfolio.update(
        {
          name: data.name,
          notes: data.notes,
          address: data.address,
          phone: data.phone,
          classification: data.classification,
          email: data.email,
          updatedAt: today,
        },
        {
          where: {
            id: data.paramsId,
          },
        }
      );

      data.type === "overflow";
      result = await getPortfolioByQuery(data);
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

exports.deletePortfolio = async (data) => {
  await Portfolio.update(
    {
      is_deleted: true,
    },
    {
      where: { id: data.paramsId },
    }
  );

  data.type === "overflow";
  const result = await getPortfolioByQuery(data);

  return result;
};

exports.findPMCById = async ({ id }) => {
  const pmc = await Portfolio.findOne({ where: { id } });
  if (!pmc) throw new Error("Pmc reference is invalid.");
  return pmc.dataValues;
};

exports.updateSettingById = async (
  id,
  { Fuze_Account_ID, Fuze_PRIVATE_API_Key, Fuze_PUBLIC_API_Key, billTypes }
) => {
  const isExist = await this.findPMCById({ id });
  if (!isExist) return;
  const fuze_obj = JSON.stringify({
    Fuze_Account_ID,
    Fuze_PRIVATE_API_Key,
    Fuze_PUBLIC_API_Key,
  });

  if (billTypes.length) {
    const data = billTypes.map(({ name, code, insight_tag }) => ({
      parent_org_id: id,
      property_id: 0,
      name,
      code,
      insight_tag,
      createdAt: new Date(),
    }));
    await BillTypes.destroy({ where: { parent_org_id: id } });
    await BillTypes.bulkCreate(data);
  }

  return await Portfolio.update(
    { fuze_obj },
    { where: { id }, returning: true }
  );
};
