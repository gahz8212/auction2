require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const { sequelize } = require("./models");
const passport = require("passport");
const path = require("path");
const passportConfig = require("./passport");
const indexRouter = require("./routes");
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const socket = require("./socket");
const sse = require("./sse");
const app = express();
passportConfig();
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db연결 됨");
  })
  .catch((e) => {
    console.error(e);
  });
app.set("port", process.env.PORT || 4000);
app.set("view engine", "html");
nunjucks.configure("views", { express: app, watch: true });
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOpion = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});
app.use(sessionOpion);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method}${req.url}라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  return res.render("error");
});
const server = app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 서버 대기 중`);
});
socket(server, app);
sse(server);
