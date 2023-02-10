const jwt = require("jsonwebtoken");

const User = require("../../models/main/auth/auth.model");

// CHECK IF THERE IS A LOGGED IN USER FROM THE JWT TOKEN

const checkForLoggedInUser = async (request, response, next) => {
  const token = request.cookies.jwt;
  try {
    if (token) {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.id);
      response.locals.user = user;
      request.user = user;
    } else {
      response.locals.user = null;
      request.user = null;
    }
  } catch (error) {
    response.locals.user = null;
    request.user = null;
  }
  next();
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

const checkAdmin = async (request, response, next) => {
  const user = await request.user;

  if (!user) {
    return response.redirect("/");
  } else if (user.role !== "admin") {
    return response.send("unauthorized");
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
