const Sequelize = require("sequelize");
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nick: { type: Sequelize.STRING(30), allowNull: false },
        email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
        password: { type: Sequelize.STRING(200), allowNull: false },
        money: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
        createdAt: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        paranoid: false,
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Auction);
    db.User.hasMany(db.Good);
  }
};
