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
      }),
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

    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());

    const userId = decoded.userId;

    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      },
    );

    const accessToken = response.data.access_token;

    const store = await Store.findOneAndUpdate(
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
      },
    );

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
    }).sort({ created_at: -1 });

    res.json(orders);
  } catch (error) {
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
      }
    );

    const orders = response.data.orders;

    for (const order of orders) {
      await Order.findOneAndUpdate(
        { orderId: order.id.toString() },
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
          new: true,
        }
      );
    }

    res.json({
      message: "Orders synced successfully",
    });
  } catch (error) {
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
    res.status(500).json({
      message: error.message,
    });
  }
};

const disconnectedStore = async (req, res) => {
  try {
    const store = await Store.findOneAndDelete({
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
      },
    );

    console.log(JSON.stringify(response.data, null, 2));

    await Store.findOneAndDelete({
      userId: req.user.id,
    });

    res.json({
      message: "Store disconnected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  connectStore,
  callback,
  getOrders,
  syncOrders,
  getStoreStatus,
  disconnectedStore,
};
