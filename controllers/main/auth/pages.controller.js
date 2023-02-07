const User = require("../../../models/main/auth/auth.model");
const Token = require("../../../models/main/auth/token.model");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.register = async (req, res) => {
  if (
    User &&
    User.schema &&
    User.schema.path("courses") &&
    User.schema.path("courses").enumValues
  ) {
    res.render("pages/auth/register", {
      title: "Register",
      User: User,
    });
  } else {
    res.status(500).send("Error: User schema not defined properly");
  }
};

module.exports.verifyPAGE = async (request, response) => {
  try {
    // GET VALUES FROM REQUEST BODT
    const { email } = request.params;

    // VERIFY IF THE VALUES EXIST
    if (!email) {
      throw Error("EMPTY VALUE");
    }

    // CHECK IF THE USER EXISTS
    const existingUser = await User.findOne({ email });
    const existingToken = await Token.findOne({
      user: existingUser._id,
    });
    console.log(existingUser);
    console.log(existingToken);

    if (!existingUser) {
      throw Error("NO RECORD FOUND");
    }

    if (!existingToken) {
      throw new Error("OTP NOT FOUND OR HAS EXPIRED");
    }

    response.render("pages/auth/verify", {
      title: "VERIFY PAGE",
      email,
    });
  } catch (error) {
    response.status(400).send(error.message);
  }
};

module.exports.login = async (req, res) => {
  res.render("pages/auth/login", {
    title: "Login",
  });
};

// EDIT A DOCUMENT PAGE

// EDIT A DOCUMENT

// DELETE A DOCUMENT

//
