const mongoose = require("mongoose");

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
  ktpNumber: {
    type: String,
    required: false,
  },
  ktpPhoto: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
});

module.exports = User;
