const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], controller.signUpFunc);

  app.post("/api/auth/signin", controller.signInFunc)

  app.post("/api/auth/signout", controller.signOutFunc)
};
