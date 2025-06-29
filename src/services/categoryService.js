const Category = require("../models/category");
const { Op } = require("sequelize");

module.exports = {
  async searchCategories({ limit, page, fields, useInMenuFilter }) {
    const where = buildCategoryWhereClause(useInMenuFilter);

    const options = {
      where,
      attributes: normalizeFields(fields, [
        "id",
        "name",
        "slug",
        "use_in_menu",
      ]),
      order: [["id", "ASC"]],
    };

    if (limit !== -1) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    const { count, rows } = await Category.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      limit: limit === -1 ? count : limit,
      page: limit === -1 ? 1 : page,
    };
  },

  async getByIdCategory(id) {
    return await Category.findByPk(id, {
      attributes: ["id", "name", "slug", "use_in_menu"],
    });
  },

  async createCategory({ id, name, slug, use_in_menu }) {
    await ensureCategoryNameIsUnique(name);
    return await Category.create({ id, name, slug, use_in_menu });
  },

  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    await Category.update(data, { where: { id } });
    return true;
  },

  async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    await Category.destroy({ where: { id } });
    return true;
  },
};

function buildCategoryWhereClause(useInMenuFilter) {
  const where = {};
  if (useInMenuFilter !== undefined) {
    where.use_in_menu = useInMenuFilter;
  }
  return where;
}

function normalizeFields(requestedFields, defaultFields) {
  const validFields = Array.isArray(requestedFields)
    ? requestedFields
    : typeof requestedFields === "string"
    ? requestedFields.split(",").map((f) => f.trim())
    : [];

  const filteredFields = validFields.length
    ? [...new Set(["id", ...validFields])]
    : defaultFields;

  return filteredFields;
}

async function ensureCategoryNameIsUnique(name) {
  const existing = await Category.findOne({ where: { name } });
  if (existing) {
    throw new Error("Nome já está em uso");
  }
}
