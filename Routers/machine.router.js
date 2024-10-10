const express = require("express");
const router = express.Router();
const machineController = require("../Controllers/machine.controller");

// Upload photo settings
const multer = require("multer");

const path = require("path");

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// lokasi upload KTP
const storageMachineOpeartion = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/MachineOperation");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "MachineID." +
        req.params.machineID +
        "-" +
        makeid(25) +
        path.extname(file.originalname)
    );
  },
});

const uploadMachineOperation = multer({ storage: storageMachineOpeartion });

router.post("/insert-machine", machineController.createMachine);
router.put("/edit-machine", machineController.updateMachine);
router.post(
  "/input-operation/:machineID",
  uploadMachineOperation.single("supportingDocument"),
  machineController.machineOperation
);
router.get(
  "/get-machine-operation/:machineID",
  machineController.getMachineOperation
);

module.exports = router;
