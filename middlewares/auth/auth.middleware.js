const jwt = require("jsonwebtoken");

const User = require("../../models/main/auth/auth.model");

// CHECK IF THERE IS A LOGGED IN USER
const checkForLoggedInUser = (request, response, next) => {
  const token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        response.locals.user = null;
        console.log("CHECKED USER EMPTY");
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        response.locals.user = user;
        console.log("CHECKED USER", decodedToken);
        next();
      }
    });
  } else {
    response.locals.user = null;
    console.log("CHECKED USER EMPTY");
    next();
  }
};
const isLoggedIn = (request, response, next) => {
  if (response.locals.user) {
    response.redirect("/");
  } else {
    next();
  }
};

const tokenVerification = (request, response, next) => {
  const token = request.cookies.jwt;

  // CHECK TO SEE IF THE  JSON WEB TOKEN EXISTS AND ALSO IF THE TOKEN HAS BEEN VERIFIED
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        response.redirect("/api/v1/auth/login");
      } else {
        console.log("REQUIRE AUTH : ", decodedToken);
        next();
      }
    });
  } else {
    response.redirect("/api/v1/auth/login");
  }
};

module.exports = {
  tokenVerification,
  isLoggedIn,
  checkForLoggedInUser,
};
