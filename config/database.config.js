const mongoose = require("mongoose");

const { API_PORT, MONG0_DB_URI } = process.env;

const connectToDatabase = async (app) => {
  try {
    await mongoose.set("strictQuery", false).connect(MONG0_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("CONNECTED TO MONGODB DATABASE ");
    app.listen(API_PORT || 9000, () => {
      console.log(`AUTH BACKEND RUNNING ON PORT : ${API_PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDatabase;

//DATABASE CONNECTION AND SERVER INITIALISATION
