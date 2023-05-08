const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
router.post("/join", async (req, res, next) => {
  const nick = req.body.nick;
  const email = req.body.email;
  const password = req.body.password;
  const money = req.body.money;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join/?error=이미 가입된 이메일 입니다.");
    }
    const hash = await bcrypt.hash(password, 12);
    User.create({
      nick,
      email,
      password: hash,
      money,
    });
    return res.redirect("/");
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});
router.get("/logout", (req, res, next) => {
  return req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.session.destroy();
  });
});
module.exports = router;
