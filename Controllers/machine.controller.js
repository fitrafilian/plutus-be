const Machinery = require("../Models/machine.model");
const MachineryOperation = require("../Models/machine.operation.model");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.Key);
const { JWTCreate, JWTCheck, getUserData } = require("../Controllers/JWT");
var ObjectId = require("mongodb").ObjectId;

function convertDateTimeInUTC7(date) {
  // Create a Date object for the current UTC date/time
  const utcDate = new Date(date);

  // Add 7 hours to convert it to UTC+7
  const utcPlus7 = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Return the Date object, which MongoDB will store as ISODate
  return utcPlus7;
}

function getCurrentDateTimeInUTC7() {
  // Create a Date object for the current UTC date/time
  const utcDate = new Date();

  // Add 7 hours to convert it to UTC+7
  const utcPlus7 = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Return the Date object, which MongoDB will store as ISODate
  return utcPlus7;
}

module.exports = {
  createMachine: async (req, res) => {
    const {
      name,
      type,
      model,
      isOwn,
      vendorName,
      vendorPhoneNumber,
      rentStartDate,
    } = req.body;
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      await Machinery.insertMany({
        name: name,
        type: type,
        model: model,
        is_Own: isOwn,
        vendorName: vendorName,
        vendorPhoneNumber: vendorPhoneNumber,
        rentStartDate: convertDateTimeInUTC7(rentStartDate),
        created_at: getCurrentDateTimeInUTC7(),
        created_by: userAuth.uid,
      })
        .then((result) => {
          res.send({
            message: "Input Mesin berhasil",
            status: 200,
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  updateMachine: async (req, res) => {
    const {
      machineID,
      name,
      type,
      model,
      isOwn,
      vendorName,
      vendorPhoneNumber,
      rentStartDate,
    } = req.body;

    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      const machineData = await Machinery.findOne({
        _id: new ObjectId(machineID),
      });

      if (machineData) {
        await Machinery.updateMany(
          {
            _id: machineID,
          },
          {
            $set: {
              name: name,
              type: type,
              model: model,
              is_Own: isOwn,
              vendorName: vendorName,
              vendorPhoneNumber: vendorPhoneNumber,
              rentStartDate: convertDateTimeInUTC7(rentStartDate),
              updated_at: getCurrentDateTimeInUTC7(),
              updated_by: userAuth.uid,
            },
          }
        )
          .then((result) => {
            res.send({
              message: "Update Mesin berhasil",
              status: 200,
              data: result,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({
          message: "Data Mesin tidak ditemukan",
          status: 200,
          data: result,
        });
      }
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  machineOperation: async (req, res) => {
    const {
      date,
      machineHMStart,
      machineHMEnd,
      machineKMStart,
      machineKMEnd,
      supportingDocument,
    } = req.body;
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    let file;
    if (supportingDocument) {
      file = "";
    } else {
      file = req.file;
    }

    let ImgURL;
    if (req.file) {
      ImgURL =
        req.protocol +
        "://" +
        req.get("host") +
        "/MachineOperation/" +
        file.filename;
    }

    if (userAuth.role === 101 || userAuth.role === 102) {
      const machineID = req.params.machineID;
      const o_machineID = new ObjectId(machineID);

      const machineData = await Machinery.findOne({ _id: o_machineID });

      if (machineData) {
        if (machineData.type === "1") {
          //exca
          await MachineryOperation.insertMany({
            date: convertDateTimeInUTC7(date),
            machineID: machineID,
            machineHMStart: machineHMStart,
            machineHMEnd: machineHMEnd,
            created_at: getCurrentDateTimeInUTC7(),
            created_by: userAuth.uid,
            supportingDocument: req.file ? ImgURL : null,
          })
            .then((result) => {
              res.send({
                message: "Update Mesin berhasil",
                status: 200,
                data: result,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (machineData.type === "2") {
          await MachineryOperation.insertMany({
            date: convertDateTimeInUTC7(date),
            machineID: machineID,
            machineKMStart: machineKMStart,
            machineKMEnd: machineKMEnd,
            created_at: getCurrentDateTimeInUTC7(),
            created_by: userAuth.uid,
            supportingDocument: req.file ? ImgURL : null,
          })
            .then((result) => {
              res.send({
                message: "Update Mesin berhasil",
                status: 200,
                data: result,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          await MachineryOperation.insertMany({
            date: convertDateTimeInUTC7(date),
            machineID: machineID,
            machineHMStart: machineHMStart,
            machineHMEnd: machineHMEnd,
            created_at: getCurrentDateTimeInUTC7(),
            created_by: userAuth.uid,
            supportingDocument: req.file ? ImgURL : null,
          })
            .then((result) => {
              res.send({
                message: "Update Mesin berhasil",
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
          message: "Mesin tidak ditemukan",
          status: 200,
          data: result,
        });
      }
    } else {
      res.send({
        message: "Authentication Failed",
        status: 400,
      });
    }
  },

  getMachineOperation: async (req, res) => {
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    const userAuth = getUserData(token);

    if (userAuth.role === 101 || userAuth.role === 102) {
      const machineID = req.params.machineID;
      const o_machineID = new ObjectId(machineID);

      const machineData = await Machinery.findOne({ _id: o_machineID });

      if (machineData) {
        await MachineryOperation.find({ machineID: machineData._id })
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
    }
  },
};
