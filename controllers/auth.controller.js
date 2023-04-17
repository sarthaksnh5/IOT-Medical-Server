const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Doctor = db.doctor;
const Patient = db.patient;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUpFunc = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    user_type: req.body.user_type
  });

  user
    .save()
    .then((user) => {
      if (req.body.user_type == "doctor") {
        const doctor = new Doctor({
          user: user,
          mobile_num: req.body.mobile_num,
        });

        doctor
          .save()
          .then((doc) => {
            res.send({ message: "User was registered successfully!", doc });
          })
          .catch(async (err) => {
            await User.findOneAndRemove({ username: user.username });
            res.status(500).send({ message: err });
          });
      } else if (req.body.user_type == "patient") {        
        User.findOne({
          email: req.body.doctor,
        })
          .then((doc_user) => {
            
            const patient = new Patient({
              user: user,
              mobile_num: req.body.mobile_num,
              doctor: doc_user,
            });

            patient
              .save()
              .then((pat) => {
                res.send({ message: "User was registered successfully!", pat });
              })
              .catch(async (err) => {
                console.log("Patient not saved");
                await User.findOneAndRemove({ username: user.username });
                res.status(500).send({ message: err });
              });
          })
          .catch(async (err) => {
            console.log(err);
            await User.findOneAndRemove({ username: user.username });
            res.status(500).send({ message: err });
          });
      } else {
        User.findOneAndRemove({ username: user.username }).then().catch();
        res.status(500).send({ message: "Please mention user type" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.signInFunc = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {      
      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ message: "Invalid username or Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });      

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        created_on: user.created_on,
        token,
        user_type: user.user_type
      });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
};

exports.signOutFunc = async (req, res) => {
  try {
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
