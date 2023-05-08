const Sequelize = require("sequelize");
module.exports = class Auction extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bid: { type: Sequelize.INTEGER, allowNull: false },
        message: { type: Sequelize.STRING(100), allowNull: true },

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
        modelName: "Auction",
        tableName: "auctions",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Auction.belongsTo(db.Good);
    db.Auction.belongsTo(db.User);
  }
};
