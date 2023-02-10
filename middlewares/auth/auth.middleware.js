const jwt = require("jsonwebtoken");

const User = require("../../models/main/auth/auth.model");

// CHECK IF THERE IS A LOGGED IN USER FROM THE JWT TOKEN
const checkForLoggedInUser = (request, response, next) => {
  const token = request.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        response.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        response.locals.user = user;
        next();
      }
    });
  } else {
    response.locals.user = null;
    next();
  }
};

// CHECK FOR IF THE USER IS LOGGED IN BEFORE REDIRECTING USER
const isLoggedIn = (request, response, next) => {
  if (response.locals.user) {
    response.redirect("/api/v1/auth/home");
  } else {
    next();
  }
};

// CHECK FOR USER ROLE AS ADMIN TO DENY ENTRY TO CERTAIN ROUTES

// middlewares/checkAdmin.js
module.exports = (req, res, next) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  } else if (user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden" });
  } else {
    next();
  }
};


// CHECK TO SEE IF THE  JSON WEB TOKEN EXISTS AND ALSO IF THE TOKEN HAS BEEN VERIFIED
const tokenVerification = (request, response, next) => {
  const token = request.cookies.jwt;

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
  checkAdmin,
};
