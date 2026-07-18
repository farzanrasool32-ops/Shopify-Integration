const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    unique: true,
  },

  accessToken: {
    type: String,
    required: true,
  },

  connected: {
    type: Boolean,
    default: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const storeModel = mongoose.model("Store", storeSchema);

module.exports = storeModel;
