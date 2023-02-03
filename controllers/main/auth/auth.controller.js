const { Auth } = require("../../../models/main/auth/auth.model");
const { Token } = require("../../../models/main/auth/token.model");
const { hashData, verifyHashedData } = require("../../../utils/hashData");
const { handleErrors } = require("../../../utils/error.handling");
const { sendEmail } = require("../../../utils/send.email");
const crypto = require("crypto");
const emailTemplate = require("../../../utils/email.template");
//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.register = async (req, res) => {
  res.render("pages/auth/register", {
    title: "Register",
  });
};
module.exports.login = async (req, res) => {
  res.render("pages/auth/login", {
    title: "Login",
  });
};
module.exports.registerUser = async (req, res) => {
  let { email, password, firstname, lastname } = req.body;
  console.log(req.body);
  email = email.trim();
  password = password.trim();
  firstname = firstname.trim();
  lastname = lastname.trim();

  const existing_authModel_user = await Auth.findOne({ email: email });
  const existing_tokenModel_user = await Token.findOne({ email: email });

  if (!(email && password && firstname && lastname)) {
    throw Error("empty input fields");
  } else if (!validateName(firstname)) {
    throw Error("Invalid firstname entered");
  } else if (!validateName(lastname)) {
    throw Error("Invalid lastname entered");
  } else if (!validateEmail(email)) {
    throw Error("invalid email format  entered");
  } else if (password.length < 6) {
    throw Error("password is short");
  } else if (existing_authModel_user || existing_tokenModel_user) {
    res.status(400).json({ message: "EMAIL ALREADY EXIST" });
  } else {
    try {
      const created_token = crypto.randomBytes(32).toString("hex");
      const hashed_token = await hashData(created_token, 10);
      const created_token_model = await Token.create({
        email,
        password,
        firstname,
        lastname,
        hash: hashed_token,
      });

      const URL = `/api/v1/auth/verify/${created_token_model._id}/${created_token}`;

      await sendEmail(
        email,
        `PLEASE ${created_token_model.firstname}  - VERIFY YOUR ACCOUNT`,
        emailTemplate(created_token_model.email, URL)
      );
      res
        .status(200)
        .json({ message: "VERIFICATION EMAIL SENT, PLEASE CHECK YOUR INBOX" });
    } catch (error) {
      // ERROR HANDLERS
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  }
};

module.exports.verifyUser = async (req, res) => {
  res.render("pages/auth/verify", {
    title: "Verify",
  });
};
module.exports.loginUser = async (req, res) => {
  res.render("pages/auth/login", {
    title: "Login",
  });
};

// EDIT A DOCUMENT PAGE

// EDIT A DOCUMENT

// DELETE A DOCUMENT

//

function validateEmail(email) {
  const request =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return request.test(email);
}
function validateName(name) {
  const request = /^[a-zA-z]*$/;
  return request.test(name);
}
