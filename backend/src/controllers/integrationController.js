const axios = require("axios");
const crypto = require("crypto");
const Store = require("../models/Store");
const Order = require("../models/Orders");

const connectStore = (req, res) => {
  try {
    const { shop } = req.body;

    if (!shop) {
      return res.status(400).json({
        message: "Shop domain is required",
      });
    }

    const state = Buffer.from(
      JSON.stringify({
        userId: req.user.id,
      })
    ).toString("base64url");

    const installUrl =
      `https://${shop}/admin/oauth/authorize` +
      `?client_id=${process.env.SHOPIFY_API_KEY}` +
      `&scope=${process.env.SHOPIFY_SCOPES}` +
      `&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}` +
      `&state=${state}`;

    res.json({
      url: installUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const callback = async (req, res) => {
  try {
    const { shop, code, state } = req.query;

    if (!shop || !code || !state) {
      return res.status(400).json({
        message: "Invalid Callback",
      });
    }

    const decoded = JSON.parse(
      Buffer.from(state, "base64url").toString()
    );

    const userId = decoded.userId;

    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }
    );

    const accessToken = response.data.access_token;

    await Store.findOneAndUpdate(
      { shop },
      {
        shop,
        accessToken,
        connected: true,
        userId,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    const existingWebhooks = await axios.get(
      `https://${shop}/admin/api/2025-01/webhooks.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    const webhooks = existingWebhooks.data.webhooks;

    const ordersWebhookExists = webhooks.some(
      (webhook) =>
        webhook.topic === "orders/create" &&
        webhook.address ===
          `${process.env.NGROK_URL}/api/integration/webhooks/orders/create`
    );

    const uninstallWebhookExists = webhooks.some(
      (webhook) =>
        webhook.topic === "app/uninstalled" &&
        webhook.address ===
          `${process.env.NGROK_URL}/api/integration/webhooks/app/uninstalled`
    );

    if (!ordersWebhookExists) {
      await axios.post(
        `https://${shop}/admin/api/2025-01/webhooks.json`,
        {
          webhook: {
            topic: "orders/create",
            address: `${process.env.NGROK_URL}/api/integration/webhooks/orders/create`,
            format: "json",
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Orders Webhook Registered");
    }

    if (!uninstallWebhookExists) {
      await axios.post(
        `https://${shop}/admin/api/2025-01/webhooks.json`,
        {
          webhook: {
            topic: "app/uninstalled",
            address: `${process.env.NGROK_URL}/api/integration/webhooks/app/uninstalled`,
            format: "json",
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("App Uninstall Webhook Registered");
    }

    console.log("All Webhooks Registered");

    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to connect store",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({
      created_at: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

const syncOrders = async (req, res) => {
  try {
    const store = await Store.findOne({
      userId: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "No store connected",
      });
    }

    const response = await axios.get(
      `https://${store.shop}/admin/api/2025-01/orders.json?status=any&fields=id,name,created_at,total_price,currency,financial_status,fulfillment_status,line_items`,
      {
        headers: {
          "X-Shopify-Access-Token": store.accessToken,
        },
      },
    );

    const orders = response.data.orders;

    for (const order of orders) {
      await Order.findOneAndUpdate(
        { 
          orderId: order.id.toString() 
        },
        {
          orderId: order.id.toString(),
          shop: store.shop,
          userId: req.user.id,
          name: order.name,
          created_at: order.created_at,
          total_price: order.total_price,
          currency: order.currency,
          financial_status: order.financial_status,
          fulfillment_status: order.fulfillment_status,
          line_items: order.line_items,
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );
    }

    res.json({
      message: "Orders synced successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to sync orders",
    });
  }
};

const getStoreStatus = async (req, res) => {
  try {
    const store = await Store.findOne({
      userId: req.user.id,
    });

    if (!store) {
      return res.json({
        connected: false,
      });
    }

    res.json({
      connected: true,
      shop: store.shop,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch store status"
    });
  }
};

const disconnectedStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      userId: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "No store connected",
      });
    }

    const response = await axios.post(
  `https://${store.shop}/admin/api/2025-01/graphql.json`,
  {
    query: `
      mutation {
        appUninstall {
          userErrors {
            field
            message
          }
        }
      }
    `,
  },
      {
        headers: {
          "X-Shopify-Access-Token": store.accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 2));

    await Store.findOneAndDelete({
      userId: req.user.id,
    });

    res.json({
      message: "Store disconnected successfully",
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to disconnect store",
    });
  }
};

const ordersCreateWebhook = async (req, res) => {
  try {
    console.log("========== WEBHOOK RECEIVED ==========");

    const hmac = req.headers["x-shopify-hmac-sha256"];

    const rawBody = req.body;

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(rawBody)
      .digest("base64");

    if (generatedHmac !== hmac) {
      return res.status(401).send("Unauthorized");
    }

    const order = JSON.parse(rawBody.toString());

    const shop = req.headers["x-shopify-shop-domain"];

    const store = await Store.findOne({
      shop,
    });

    if (!store) {
      return res.status(404).send("Store not found");
    }

    await Order.findOneAndUpdate(
      {
        orderId: order.id.toString(),
      },
      {
        orderId: order.id.toString(),
        shop,
        userId: store.userId,
        name: order.name,
        created_at: order.created_at,
        total_price: order.total_price,
        currency: order.currency,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status,
        line_items: order.line_items,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    console.log("Order Saved");

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error(error);

    res.status(500).send("Webhook Error");
  }
};

const appUninstalledWebhook = async (req, res) => {
  try {
    console.log("========== APP UNINSTALLED ==========");

    // HMAC Verify
    const hmac = req.headers["x-shopify-hmac-sha256"];
    const rawBody = req.body;

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(rawBody)
      .digest("base64");

    if (generatedHmac !== hmac) {
      return res.status(401).send("Unauthorized");
    }

    const shop = req.headers["x-shopify-shop-domain"];

    // Store ko disconnected mark karo
    await Store.findOneAndUpdate(
      { shop },
      {
        connected: false,
        accessToken: null,
      },
      {
        returnDocument: "after",
      }
    );

    console.log("Store Disconnected");

    // Shopify ko hamesha success return karo
    return res.sendStatus(200);

  } catch (error) {
    console.error(error);

    // Agar error bhi aa jaye to Shopify retries avoid karne ke liye 200 bhej do
    return res.sendStatus(200);
  }
};

module.exports = {
  connectStore,
  callback,
  getOrders,
  syncOrders,
  getStoreStatus,
  disconnectedStore,
  ordersCreateWebhook,
  appUninstalledWebhook,
};
