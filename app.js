const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const apicache = require("apicache");
// const path = require("path");

const courseRoutes = require("./routes/main/course/course.routes");
const authRoutes = require("./routes/main/auth/auth.routes");
const connectToDatabase = require("./config/database.config");

const app = express();
connectToDatabase(app);

// MIDDLEWARES AND STATIC FILES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./dist"));
// app.use(express.static(__dirname));
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(compression());
const cache = apicache.middleware;

app.set("view engine", "ejs");

app.get("/", (_, response) => {
  response.redirect("/api/v1/course/");
});
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/auth", authRoutes);

//SERVER CONNECTION AND MIDDLEWARES
