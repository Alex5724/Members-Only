require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const userRouter = require("./routes/userRoutes");

require("./passport");

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(
  session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", userRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("An error occurred.");
});

app.listen(PORT, () => {
  console.log("Server is live");
});
