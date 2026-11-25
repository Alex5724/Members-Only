const { getContent } = require("../models/quries");

async function getPosts(req, res, next) {
  try {
    const posts = await getContent();
    res.render("postsSection", { posts });
  } catch (error) {
    next(error);
  }
}

async function redirectToRegisterForm(req, res) {
  return res.render("register", { errors: [] });
}

async function redirectToLoginForm(req, res) {
  const messages = req.session.messages || [];
  req.session.messages = [];

  const errors = messages.map((msg) => ({ msg }));

  return res.render("login", { errors });
}

module.exports = {
  getPosts,
  redirectToRegisterForm,
  redirectToLoginForm,
};
