const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const courseRoutes = require("./routes/main/course/course.routes");
const authRoutes = require("./routes/main/auth/auth.routes");
const connectToDatabase = require("./config/database.config");
const { checkForLoggedInUser } = require("./middlewares/auth/auth.middleware");

const app = express();
connectToDatabase(app);

app.use(express.static("./dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));



app.set("view engine", "ejs");

app.get("*", checkForLoggedInUser);
app.get("/", (_, response) => {
  response.redirect("/api/v1/course/");
});

app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/auth", authRoutes);
