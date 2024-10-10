const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAbsensi = mongoose.model("Machinery_Operation", {
  machineID: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  machineHMStart: {
    type: Number,
    required: false,
  },
  machineHMEnd: {
    type: Number,
    required: false,
  },
  machineKMStart: {
    type: Number,
    required: false,
  },
  machineKMEnd: {
    type: Number,
    required: false,
  },
  supportingDocument: {
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
