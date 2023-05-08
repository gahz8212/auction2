const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { User, Good, Auction, Image } = require("../models");
try {
  fs.readdirSync("uploads");
} catch (e) {
  console.log("uploads폴더를 새로 만듭니다.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post("/image", upload.array("images"), (req, res) => {
  // console.log(req.files);
  const imageArray = req.files.map((file) => ({
    url: `/img/${file.filename}`,
  }));
  return res.json(imageArray);
});

const upload2 = multer();
router.post("/good", upload2.none(), async (req, res, next) => {
  try {
    const { name, price, descript, images } = req.body;
    console.log(name, price, descript, images);
    const good = await Good.create({
      name,
      descript,
      price,
      UserId: req.user.id,
      OwnerId: req.user.id,
    });
    if (images) {
      const pics = images.match(/#[^\s#]*/g);
      // console.log(pics);
      const results = await Promise.all(
        pics.map((pic) =>
          Image.create({ image: pic.slice(1), GoodId: good.id })
        )
      );
      await good.addImages(results.map((result) => result[0]));
    }
    return res.redirect("/");
  } catch (e) {
    console.error(e);
  }
});
module.exports = router;
