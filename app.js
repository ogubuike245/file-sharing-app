const express = require("express");
const morgan = require("morgan");

const Routes = require("./routes/main/routes");
const connectToDatabase = require("./config/database.config");

const app = express();
connectToDatabase(app);

// MIDDLEWARES AND STATIC FILES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./dist"));
app.use(morgan("dev"));

app.set("view engine", "ejs");

app.use("/api/v1/user", Routes);

//SERVER CONNECTION AND MIDDLEWARES
