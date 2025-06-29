const { Op, Sequelize } = require("sequelize");
const { Product, ProductImage, ProductOption, Category } = require("../models");

module.exports = {
  async searchProducts({
    limit,
    page,
    fields,
    match,
    categoryIds,
    priceMin,
    priceMax,
    options,
  }) {
    const where = buildWhereClause(match, priceMin, priceMax);
    const include = buildInclude(fields, categoryIds, options);

    const safeFields = fields.filter(
      (f) => !["images", "options", "categories"].includes(f)
    );

    const queryOptions = {
      where,
      attributes: safeFields,
      order: [["id", "ASC"]],
      include,
    };

    if (limit !== -1) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;
    }

    const { count, rows } = await Product.findAndCountAll(queryOptions);

    const dataWithCategoryIds = rows.map((product) => {
      const p = product.toJSON();
      p.category_ids = p.categories?.map((c) => c.id) || [];
      delete p.categories;
      return p;
    });

    return {
      data: dataWithCategoryIds,
      total: count,
      limit: limit === -1 ? count : limit,
      page: limit === -1 ? 1 : page,
    };
  },

  async getByIdProduct(id) {
    return await Product.findByPk(id, {
      attributes: {
        include: [
          "id",
          "enabled",
          "name",
          "slug",
          "stock",
          "description",
          "price",
          "price_with_discount",
          [
            Sequelize.literal(`(
              SELECT JSON_ARRAYAGG(category_id)
              FROM productcategories
              WHERE product_id = Product.id
            )`),
            "category_ids",
          ],
        ],
        exclude: ["created_at", "updated_at"],
      },
      include: [
        { model: ProductImage, as: "images", attributes: ["id", "path"] },
        {
          model: ProductOption,
          as: "options",
          attributes: [
            "id",
            "product_id",
            "title",
            "shape",
            "radius",
            "type",
            "values",
          ],
        },
      ],
    });
  },

  async createProduct({
    enabled,
    name,
    slug,
    stock,
    description,
    price,
    price_with_discount,
    category_ids,
    images,
    options,
  }) {
    const existing = await Product.findOne({ where: { name } });
    if (existing) throw new Error("Nome já está em uso");

    const product = await Product.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    });

    if (Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    await createProductImages(product.id, images);
    await createProductOptions(product.id, options);

    return product;
  },

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    const existing = await Product.findOne({
      where: { name: data.name, id: { [Op.ne]: id } },
    });
    if (existing) throw new Error("Nome já está em uso");

    await Product.update(
      {
        enabled: data.enabled,
        name: data.name,
        slug: data.slug,
        stock: data.stock,
        description: data.description,
        price: data.price,
        price_with_discount: data.price_with_discount,
      },
      { where: { id } }
    );

    if (Array.isArray(data.category_ids)) {
      await product.setCategories(data.category_ids);
    }

    await updateProductImages(id, data.images);
    await updateProductOptions(id, data.options);

    return true;
  },

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await Product.destroy({ where: { id } });
    return true;
  },
};

function buildWhereClause(match, priceMin, priceMax) {
  const where = {};

  if (match) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${match}%` } },
      { description: { [Op.iLike]: `%${match}%` } },
    ];
  }

  if (priceMin !== undefined && priceMax !== undefined) {
    where.price = { [Op.between]: [priceMin, priceMax] };
  }

  return where;
}

function buildInclude(fields, categoryIds, options) {
  const include = [];

  include.push({
    model: Category,
    as: "categories",
    attributes: ["id"],
    through: { attributes: [] },
    where: categoryIds?.length
      ? {
          id:
            categoryIds.length === 1
              ? categoryIds[0]
              : { [Op.in]: categoryIds },
        }
      : undefined,
    required: !!categoryIds?.length,
  });

  if (fields.includes("images")) {
    include.push({
      model: ProductImage,
      as: "images",
      attributes: ["id", "path"],
    });
  }

  if (fields.includes("options")) {
    include.push({
      model: ProductOption,
      as: "options",
      attributes: [
        "id",
        "product_id",
        "title",
        "shape",
        "radius",
        "type",
        "values",
      ],
      where: buildOptionFilter(options),
      required: !!(options && Object.keys(options).length),
    });
  }

  return include;
}

function buildOptionFilter(options) {
  if (!options || !Object.keys(options).length) return undefined;

  return {
    [Op.or]: Object.entries(options).map(([optionId, values]) => ({
      id: parseInt(optionId),
      values: { [Op.overlap]: values },
    })),
  };
}

async function createProductImages(productId, images) {
  if (!Array.isArray(images)) return;

  for (const _ of images) {
    await ProductImage.create({
      product_id: productId,
      path: `https://fake.cdn.com/produtos/${productId}/${Date.now()}.jpg`,
    });
  }
}

async function updateProductImages(productId, images) {
  if (!Array.isArray(images)) return;

  for (const img of images) {
    if (img.id && img.deleted) {
      await ProductImage.destroy({
        where: { id: img.id, product_id: productId },
      });
    } else if (img.id && img.content) {
      await ProductImage.update(
        { path: img.content },
        { where: { id: img.id, product_id: productId } }
      );
    } else if (!img.id && img.content) {
      await ProductImage.create({
        product_id: productId,
        path: `https://fake.cdn.com/produtos/${productId}/${Date.now()}.jpg`,
      });
    }
  }
}

async function createProductOptions(productId, options) {
  if (!Array.isArray(options)) return;

  for (const opt of options) {
    await ProductOption.create({
      product_id: productId,
      title: opt.title,
      shape: opt.shape || "square",
      radius: parseInt(opt.radius) || 0,
      type: opt.type || "text",
      values: formatOptionValues(opt),
    });
  }
}

async function updateProductOptions(productId, options) {
  if (!Array.isArray(options)) return;

  for (const opt of options) {
    const optionData = {
      title: opt.title,
      shape: opt.shape || "square",
      radius: parseInt(opt.radius) || 0,
      type: opt.type || "text",
      values: formatOptionValues(opt),
    };

    if (opt.id && opt.deleted) {
      await ProductOption.destroy({
        where: { id: opt.id, product_id: productId },
      });
    } else if (opt.id) {
      await ProductOption.update(optionData, {
        where: { id: opt.id, product_id: productId },
      });
    } else {
      await ProductOption.create({ ...optionData, product_id: productId });
    }
  }
}

function formatOptionValues(opt) {
  return Array.isArray(opt.values || opt.value)
    ? (opt.values || opt.value).join(",")
    : "";
}
