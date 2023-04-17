const db = require("../models");
const Patient_Data = db.patient_data;
const User = db.user;
const Patient = db.patient;
const Doctor = db.doctor;

exports.allAccess = (req, res) => {
  res.status(200).send({ message: "Public Content" });
};

exports.deletePatient = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: "User not found" });
        return;
      }      

      if (user.user_type === "patient") {
        Patient.findOne({
          user: user
        })
          .then((pat) => {
            
            if (!pat) {
              res.status(500).send({ message: "Patient not found" });
              return;
            }

            Patient.findOneAndRemove({
              user: user,
            })
              .then((resp) => {
                User.findOneAndRemove({
                  username: req.body.username,
                })
                  .then((respons) => {
                    Patient_Data.find({
                      patient: user,
                    })
                      .deleteMany()
                      .then((re) => {
                        res.status(200).send({ message: "Patient Deleted" });
                      })
                      .catch((err) => {
                        res.status(500).send({ message: err });
                      });
                  })
                  .catch((err) => {
                    res.status(500).send({ message: err });
                  });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
          });
      } else {
        res.status(500).send({ message: "Doctors cannot" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.postPateintData = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: "User not found" });
        return;
      }

      var pat = new Patient_Data({
        patient: user,
        heart_rate: req.body.heart_rate,
        temperature: req.body.temperature,
        spo2: req.body.spo2,
      });

      pat
        .save()
        .then((pati) => {
          res.status(201).send({ message: pati });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.allPatient = (req, res) => {
  doctor_name = req.body.username;

  User.findOne({ username: doctor_name })
    .then((user) => {
      Patient.find({
        doctor: user,
      })
        .then((patients) => {
          if (patients.length > 0) {
            res.status(200).send({ message: patients });
          } else {
            res.status(204).send({ message: "No patients" });
          }
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.patientData = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: err });
        return;
      }

      Patient_Data.find({
        patient: user,
      })
        .then((datas) => {
          if (datas.length > 0) {
            res.status(200).send({ message: datas });
          } else {
            res.status(204).send({ message: "No Logs" });
          }
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
