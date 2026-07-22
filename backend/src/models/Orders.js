const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },

    shop: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: String,

    created_at: Date,

    total_price: String,

    currency: String,

    financial_status: String,

    fulfillment_status: String,

    line_items: Array,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
