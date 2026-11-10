const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUser, validateUser } = require("./models/quries");

passport.use(
  new LocalStrategy({ usernameField: "name" }, async (name, password, done) => {
    try {
      const user = await validateUser(name, password);

      if (!user)
        return done(null, false, { msg: "The name or password is wrong" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
  try {
    const result = await getUser(user.id);

    return done(null, result || false);
  } catch (error) {
    return done(error);
  }
});
