const jwt = require("jsonwebtoken");

const User = require("../../models/main/auth/auth.model");

// CHECK IF THERE IS A LOGGED IN USER FROM THE JWT TOKEN

const checkForLoggedInUser = async (request, response, next) => {
  const token = request.cookies.jwt;

  try {
    if (token) {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      request.user = await User.findById(decodedToken.id);
    } else {
      request.user = null;
    }

  } catch (error) {
    request.user = null;
  }

  response.locals.user = request.user;
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

  console.log(user);
  if (!user) {
    return response.redirect("/");
  } else if (user.role !== "admin") {
    return response.send("unauthorized");
  } else {
    next();
  }
};

// CHECK TO SEE IF THE  JSON WEB TOKEN EXISTS AND ALSO IF THE TOKEN HAS BEEN VERIFIED
const tokenVerification = async (request, response, next) => {
  const token = request.cookies.jwt;

  try {
    if (token) {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("REQUIRE AUTH : ", decodedToken);
      request.user = decodedToken;
      next();
    } else {
      response.redirect("/api/v1/auth/login");
    }
  } catch (error) {
    console.log(error.message);
    response.redirect("/api/v1/auth/login");
  }
};


module.exports = {
  tokenVerification,
  isLoggedIn,
  checkForLoggedInUser,
  checkAdmin,
};
