const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUser, validateUser } = require("./models/quries");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (name, password, done) => {
      try {
        const user = await validateUser(name, password);

        if (!user) {
          return done(null, false, {
            message: "The email or password is wrong.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await getUser(id);
    return done(null, result || false);
  } catch (error) {
    return done(error);
  }
});
