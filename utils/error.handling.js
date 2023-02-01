const handleErrors = (errorInfo) => {
  // console.log(errorInfo.message, errorInfo.code);
  let errors = {
    email: "",
    password: "",
    nickname: "",
    verified: "",
  };

  // INCORRECT EMAIL HANDLER
  if (errorInfo.message === "incorrect Email Format") {
    errors.email = "That email  has a wrong format".toUpperCase();
  }
  if (errorInfo.message === "Email Does Not Exist") {
    errors.email = "That email is not registered or Verified".toUpperCase();
  }
  if (errorInfo.message === "not verified") {
    errors.verified =
      "EMAIL NOT VERIFIED, PLEASE CHECK YOUR INBOX FOR VERIFICATION LINK".toUpperCase();
  }

  // WRONG PASSWORD  HANDLER
  if (errorInfo.message === "incorrect password") {
    errors.password = "That password is incorrect".toUpperCase();
  }

  // DUPLICATE ERROR HANDLERS
  if (errorInfo.code === 11000) {
    if (errorInfo.keyPattern.email) {
      errors.email = "That Email is already registered".toUpperCase();
    }
    if (errorInfo.keyPattern.nickname) {
      errors.nickname = "That Nickname is already Taken".toUpperCase();
    }

    return errors;
  }

  // MONGOOSE VALIDATION ERRORS OBJECT
  if (
    errorInfo.message.includes("user validation failed") ||
    errorInfo.message.includes("token validation failed")
  ) {
    Object.values(errorInfo.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = { handleErrors };
