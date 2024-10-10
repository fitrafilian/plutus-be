const User = require("../Models/user.model");
const userAbsensi = require("../Models/user.absensi.model");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.Key);
const { JWTCreate, JWTCheck, getUserData } = require("../Controllers/JWT");
var ObjectId = require("mongodb").ObjectId;

// convert time
function convertTZ(date, tzString) {
  return date.toLocaleString("en-US", { timeZone: tzString });
}

function getCurrentDateTimeInUTC7() {
  // Create a Date object for the current UTC date/time
  const utcDate = new Date();

  // Add 7 hours to convert it to UTC+7
  const utcPlus7 = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Return the Date object, which MongoDB will store as ISODate
  return utcPlus7;
}

function convertDateTimeInUTC7(date) {
  // Create a Date object for the current UTC date/time
  const utcDate = new Date(date);

  // Add 7 hours to convert it to UTC+7
  const utcPlus7 = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Return the Date object, which MongoDB will store as ISODate
  return utcPlus7;
}

module.exports = {
  test: async (req, res) => {
    res.send({
      message: "ok",
      status: 200,
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const tokenData = await JWTCreate({
        uid: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      if (password !== cryptr.decrypt(userData.password)) {
        res.send({
          message: "Password salah",
          status: 400,
        });
      } else {
        res.send({
          message: "Login berhasil",
          status: 200,
          token: "Bearer " + tokenData,
          userData: {
            uid: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          },
        });
      }
    }
  },

  register: async (req, res) => {
    const { name, email, role, phone, password, ktpNumber, ktpPhoto } =
      req.body;

    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101) {
      const userData = await User.findOne({ email: email });
      let file;
      if (ktpPhoto) {
        file = "";
      } else {
        file = req.file;
      }

      let ImgURL;
      if (req.file) {
        ImgURL =
          req.protocol + "://" + req.get("host") + "/CardID/" + file.filename;
      }

      if (userData) {
        res.send({
          message: "Email sudah terdaftar",
          status: 400,
        });
      } else {
        await User.insertMany({
          name: name,
          email: email,
          role: role,
          phone: phone,
          password: cryptr.encrypt(password),
          ktpNumber: ktpNumber,
          ktpPhoto: req.file ? ImgURL : null,
          created_by: userAuth.uid,
          created_at: getCurrentDateTimeInUTC7(),
        })
          .then((result) => {
            res.send({
              message: "Registrasi berhasil",
              status: 200,
              data: result,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  updateUser: async (req, res) => {
    const { email, name, role, phone, password, ktpNumber, photo } = req.body;

    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    let file;
    if (photo) {
      file = "";
    } else {
      file = req.file;
    }

    let ImgURL;
    if (req.file) {
      ImgURL =
        req.protocol + "://" + req.get("host") + "/Photo/" + file.filename;
    }

    if (userAuth.role === 101) {
      const userData = await User.findOne({ email: email });

      if (userData) {
        await User.updateMany(
          {
            email: email,
          },
          {
            $set: {
              name: name,
              role: role,
              phone: phone,
              password: cryptr.encrypt(password),
              ktpNumber: ktpNumber,
              updated_by: userAuth.uid,
              updated_at: getCurrentDateTimeInUTC7(),
              photo: req.file ? ImgURL : null,
            },
          }
        )
          .then((result) => {
            res.send({
              message: "Update data berhasil",
              status: 200,
              data: result,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({
          message: "Update data gagal",
          status: 400,
        });
      }
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  userAbsensi: async (req, res) => {
    const { uid, status, date } = req.body;

    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      const userData = await User.findOne({ _id: uid });

      if (userData) {
        await userAbsensi
          .insertMany({
            uid: userData._id,
            date: convertDateTimeInUTC7(date),
            status: status,
            is_paid: 0,
            created_by: userAuth.uid,
            created_at: getCurrentDateTimeInUTC7(),
          })
          .then((result) => {
            res.send({
              message: "Absensi berhasil",
              status: 200,
              data: result,
              uiduser: userAuth,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({
          message: "Absensi gagal",
          status: 400,
        });
      }
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  getUsers: async (req, res) => {
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      await User.find()
        .then((result) => {
          res.send({
            message: "Data ditemukan",
            status: 200,
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  getUserDetails: async (req, res) => {
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      const userID = req.params.userID;
      const o_userID = new ObjectId(userID);

      await User.findOne({ _id: o_userID })
        .then((result) => {
          res.send({
            message: "Data ditemukan",
            status: 200,
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
