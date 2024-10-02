const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAbsensi = mongoose.model("user_absensi", {
  uid: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  is_paid: {
    type: String,
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
