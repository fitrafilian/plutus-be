const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model("user", {
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  role: {
    type: Number,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  ktpNumber: {
    type: String,
    required: false,
  },
  ktpPhoto: {
    type: String,
    required: false,
  },
  bankName: {
    type: String,
    required: false,
  },
  bankNumber: {
    type: String,
    required: false,
  },
  dailySalary: {
    type: String,
    required: false,
  },
  monthlySalary: {
    type: String,
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

module.exports = User;
