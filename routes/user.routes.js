const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/test/all", [authJwt.verifyToken], controller.allAccess)
  
  app.get("/api/patient/all", [authJwt.verifyToken], controller.allPatient)

  app.post("/api/patient/data", controller.postPateintData)
  // app.post("/api/patient/data", [authJwt.verifyToken], controller.postPateintData)

  app.post("/api/patients/all", [authJwt.verifyToken], controller.patientData)
  
  app.delete("/api/patient/delete", [authJwt.verifyToken], controller.deletePatient)
};
