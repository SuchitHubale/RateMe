const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  rating_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating_value: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "ratings",
  timestamps: false,
});

// Associations
Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
User.hasMany(Rating, { foreignKey: "user_id" });
Store.hasMany(Rating, { foreignKey: "store_id" });

module.exports = Rating;
