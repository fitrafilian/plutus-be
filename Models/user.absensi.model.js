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
});

module.exports = userAbsensi;
