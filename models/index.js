const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const User = require("./user");
const Good = require("./good");
const Image = require("./image");
const Auction = require("./auction");
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Good = Good;
db.Image = Image;
db.Auction = Auction;
User.init(sequelize);
Good.init(sequelize);
Image.init(sequelize);
Auction.init(sequelize);
User.associate(db);
Good.associate(db);
Image.associate(db);
Auction.associate(db);

module.exports = db;
