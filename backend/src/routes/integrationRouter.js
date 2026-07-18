const express = require("express");
const router = express.Router();
const axios = require("axios");
const Store = require("../models/Store");
const auth = require("../middlewares/auth");

const {
  connectStore,
  callback,
  getOrders,
  getStoreStatus,
  disconnectedStore,
} = require("../controllers/integrationController");

router.post("/connect", auth, connectStore);

router.get("/callback", callback);

router.get("/orders", auth, getOrders);

router.get("/status", auth, getStoreStatus);

router.post("/disconnect", auth, disconnectedStore);

module.exports = router;
