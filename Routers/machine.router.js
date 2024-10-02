const express = require("express");
const router = express.Router();
const machineController = require("../Controllers/machine.controller");

router.post("/insert-machine", machineController.createMachine);
router.put("/edit-machine", machineController.updateMachine);

module.exports = router;
