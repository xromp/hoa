const express = require("express");
const route = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const billTypeController = require("../controllers/billing_type.controller");
route.use(cors());

route.get("/list", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const data = {
      property_ref: decoded.current_env.property_ref,
      parent_org_id: parseInt(decoded.current_env.parent_org_id),
    };
    const result = await billTypeController.getBillingTypeByParams(data);

    res.send(result);
  } catch (err) {
    res.status(400).json({ errors: err.toString("utf8") });
  }
});

route.get("/view/:id", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const result = await billTypeController.getBillingTypeById(req.params.id);

    res.send(result);
  } catch (err) {
    res.status(400).json({ errors: err.toString("utf8") });
  }
});

route.post("/save/:id", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const data = req.body.data;
    data.paramsId = req.params.id;
    data.property_ref = decoded.current_env.property_ref;
    data.parent_org_id = parseInt(decoded.current_env.parent_org_id);
    data.created_by = decoded.id;

    const result = await billTypeController.postBillingType(data);

    res.send(result);
  } catch (err) {
    res.status(400).json({ errors: err.toString("utf8") });
  }
});

route.post("/delete/:id", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const result = await billTypeController.deleteBillingTypeById(
      req.params.id
    );

    res.send(result);
  } catch (err) {
    res.status(400).json({ errors: err.toString("utf8") });
  }
});

route.get("/getTypes/:parent_org_id", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const { parent_org_id } = req.params;
    const result = await billTypeController.getTypesByPmcId({ parent_org_id });
    res.send(result);
  } catch (err) {
    res.status(400).json({ errors: err.toString("utf8") });
  }
});

module.exports = route;
