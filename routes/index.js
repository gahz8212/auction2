const express = require("express");
const router = express.Router();
const { Good, Auction, User, Image } = require("../models");
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
router.get("/", async (req, res) => {
  const goods = await Good.findAll({ include: { model: Image } });

  return res.render("main", { title: "Auctions", goods });
});
router.get("/join", async (req, res) => {
  return res.render("join");
});
router.get("/good", async (req, res) => {
  return res.render("good");
});
router.get("/good/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const [good, auction, images] = await Promise.all([
    Good.findOne({ where: { id }, include: { model: User, as: "Owner" } }),
    Auction.findAll({ where: { GoodId: id }, include: { model: User } }),
    Image.findAll({ where: { GoodId: id } }),
  ]);
  // console.log(images);
  return res.render("auction", {
    title: `${good.name}`,
    good,
    auction,
    images,
  });
});
router.post("/good/:id/bid");
module.exports = router;
