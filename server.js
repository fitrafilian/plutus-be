const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// dotenv
require("dotenv").config();

// Database
require("./Config/db");

// Cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

//To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public file
app.use(express.static(path.join(__dirname, "public")));

// router user api
const userAPI = require("./Routers/user.router");
const machineAPI = require("./Routers/machine.router");
app.use("/api/user", userAPI);
app.use("/api/machinery", machineAPI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening from PORT ${PORT}`));
