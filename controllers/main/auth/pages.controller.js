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

module.exports.verifyUser = async (req, res) => {
  res.render("pages/auth/verify", {
    title: "Verify",
  });
};

// EDIT A DOCUMENT PAGE

// EDIT A DOCUMENT

// DELETE A DOCUMENT

//
