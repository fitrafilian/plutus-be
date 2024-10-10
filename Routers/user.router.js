const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controller");

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
const storageCardID = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/CardID");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "cardID." +
        req.body.ktpNumber +
        "-" +
        makeid(25) +
        path.extname(file.originalname)
    );
  },
});

const uploadCardID = multer({ storage: storageCardID });

// lokasi upload Photo
const storagePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/Photo");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "photo." +
        req.body.ktpNumber +
        "-" +
        makeid(25) +
        path.extname(file.originalname)
    );
  },
});

const uploadPhoto = multer({ storage: storagePhoto });

router.get("/test", userController.test);
router.post(
  "/register",
  uploadCardID.single("ktpPhoto"),
  userController.register
);
router.post("/login", userController.login);
router.put(
  "/update-data",
  uploadPhoto.single("photo"),
  userController.updateUser
);
router.post("/user-absensi", userController.userAbsensi);
router.get("/all-users", userController.getUsers);
router.get("/detail/:userID", userController.getUserDetails);

module.exports = router;
