const express = require("express");
const router = express.Router();
const axios = require("axios");
const Store = require("../models/Store");
const auth = require("../middlewares/auth");

const {
  connectStore,
  callback,
  getOrders,
  syncOrders,
  getStoreStatus,
  disconnectedStore,
  ordersCreateWebhook,
  appUninstalledWebhook,
} = require("../controllers/integrationController");

router.post("/connect", auth, connectStore);

router.get("/callback", callback);

router.get("/orders", auth, getOrders);

router.post("/orders/sync", auth, syncOrders);

router.get("/status", auth, getStoreStatus);

router.post("/disconnect", auth, disconnectedStore);

router.post("/webhooks/orders/create", ordersCreateWebhook);

router.post("/webhooks/app/uninstalled", appUninstalledWebhook);

module.exports = router;
