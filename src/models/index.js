const Product = require("./product");
const ProductImage = require("./productImage");
const ProductOption = require("./productOption");
const ProductCategory = require("./productCategory");
const Category = require("./category");

ProductImage.belongsTo(Product, {
  foreignKey: "product_id",
});

Product.hasMany(ProductOption, {
  as: "options",
  foreignKey: "product_id",
});

ProductOption.belongsTo(Product, {
  foreignKey: "product_id",
});

Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
});

module.exports = {
  Product,
  ProductImage,
  ProductOption,
  ProductCategory,
  Category,
};
