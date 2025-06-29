"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.Category, {
        through: "productcategories",
        foreignKey: "product_id",
        otherKey: "category_id",
        as: "categories",
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      });
      Product.hasMany(models.ProductOption, {
        foreignKey: "product_id",
        as: "options",
      });
    }
  }
  Product.init(
    {
      enabled: DataTypes.BOOLEAN,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      use_in_menu: DataTypes.BOOLEAN,
      stock: DataTypes.INTEGER,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
      price_with_discount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
