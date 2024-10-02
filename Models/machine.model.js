const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAbsensi = mongoose.model("Machinery", {
  name: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    required: false,
  },
  is_Own: {
    type: Boolean,
    required: false,
  },
  vendorName: {
    type: String,
    required: false,
  },
  vendorPhoneNumber: {
    type: String,
    required: false,
  },
  rentStartDate: {
    type: Date,
    required: false,
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  updated_at: {
    type: Date,
    required: false,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  created_at: {
    type: Date,
    required: false,
  },
});

module.exports = userAbsensi;
