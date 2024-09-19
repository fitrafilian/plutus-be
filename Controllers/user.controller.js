const User = require("../Models/user.model");
const userAbsensi = require("../Models/user.absensi.model");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.Key);
const { JWTCreate, JWTCheck, getUserData } = require("../Controllers/JWT");

// convert time
function convertTime(date, offset) {
  if (offset) {
    offset = parseFloat(offset);
  } else {
    offset = 0;
  }
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
          token: tokenData,
          userData: {
            uid: userData._id,
            name: userData.name,
            email: userData.email,
          },
        });
      }
    }
  },

  register: async (req, res) => {
    const { name, email, role, phone, password, ktpNumber, ktpPhoto } =
      req.body;
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
        date: new Date(),
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
  },

  updateUser: async (req, res) => {
    const { email, uid, name, role, phone, password, ktpNumber } = req.body;

    const userData = await User.findOne({ email: email } || { uid: uid });

    if (userData) {
      await User.updateMany({
        name: name !== null ? name : userData.name,
        role: role !== null ? role : userData.role,
        phone: phone !== null ? phone : userData.phone,
        password:
          password !== null ? cryptr.encrypt(password) : userData.password,
        ktpNumber: ktpNumber !== null ? ktpNumber : userData.ktpNumber,
      })
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
  },

  userAbsensi: async (req, res) => {
    const { email, uid, status } = req.body;
    const userData = await User.findOne({ uid: uid });

    if (userData) {
      await userAbsensi
        .insertMany({
          uid: uid,
          date: convertTime(new Date(), +7),
          status: status,
        })
        .then((result) => {
          res.send({
            message: "Absensi berhasil",
            status: 200,
            data: result,
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
  },
};
