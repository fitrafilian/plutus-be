const mongoose = require("mongoose");

//Connect database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB, () => {
  console.log("Connected to MongoDB");
});
