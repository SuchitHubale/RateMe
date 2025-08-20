const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Store = sequelize.define("Store", {
  store_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("Electronics", "Clothing", "Books", "Grocery", "Cafe", "Sports", "Other"),
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  description: {
    type: DataTypes.TEXT,
  },
  image_url: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0,
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "stores",
  timestamps: false,
});

// Associations
Store.belongsTo(User, { foreignKey: "owner_id", onDelete: "CASCADE" });
User.hasMany(Store, { foreignKey: "owner_id" });

module.exports = Store;
