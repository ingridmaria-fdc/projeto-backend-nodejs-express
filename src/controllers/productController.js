const productService = require("../services/productService");
const handleError = require("../utils/handleError");
const {
  validateLimitAndPage,
  validatePriceRange,
  validateRequiredFields,
} = require("../utils/validators");

module.exports = {
  async searchProducts(req, res) {
    try {
      let {
        limit = "12",
        page = "1",
        fields = "",
        match,
        category_ids,
        "price-range": priceRange,
        ...optionFilters
      } = req.query;

      const limitPageError = validateLimitAndPage(limit, page);
      if (limitPageError)
        return res.status(400).json({ message: limitPageError });

      limit = parseInt(limit, 10);
      page = parseInt(page, 10);

      const fieldsArray = fields
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      if (!fieldsArray.includes("id")) fieldsArray.unshift("id");

      let categoryIdsArray;
      if (category_ids) {
        categoryIdsArray = category_ids
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id));
      }

      const {
        priceMin,
        priceMax,
        error: priceError,
      } = validatePriceRange(priceRange);
      if (priceError) return res.status(400).json({ message: priceError });

      const dynamicOptionFilters = {};
      for (const key in optionFilters) {
        const matchOpt = key.match(/^option\[(\d+)\]$/);
        if (matchOpt) {
          const optionId = parseInt(matchOpt[1], 10);
          const values = optionFilters[key].split(",").map((v) => v.trim());
          dynamicOptionFilters[optionId] = values;
        }
      }

      const result = await productService.searchProducts({
        limit,
        page,
        fields: fieldsArray,
        match,
        categoryIds: categoryIdsArray,
        priceMin,
        priceMax,
        optionFilters: dynamicOptionFilters,
      });

      return res.status(200).json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getByIdProduct(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(200).json(product);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createProduct(req, res) {
    try {
      const productData = extractProductData(req.body);

      const validationError = validateProductFields(productData);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const newProduct = await productService.createProduct(productData);

      return res.status(201).json({
        id: newProduct.id,
        ...productData,
      });
    } catch (error) {
      if (error.message === "Nome já está em uso") {
        return res.status(400).json({ message: error.message });
      }
      handleError(res, error);
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = extractProductData(req.body);

      const validationError = validateProductFields(productData);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const updated = await productService.updateProduct(id, productData);

      if (!updated) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      if (error.message === "Nome já está em uso") {
        return res.status(400).json({ message: error.message });
      }
      handleError(res, error);
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const deleted = await productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },
};

function extractProductData(body) {
  const {
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
  } = body;

  return {
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
  };
}

function validateProductFields(data) {
  const required = [
    "enabled",
    "name",
    "slug",
    "stock",
    "description",
    "price",
    "price_with_discount",
    "category_ids",
    "images",
    "options",
  ];

  const missing = validateRequiredFields(data, required);
  if (missing.length > 0) {
    return `Campos obrigatórios ausentes ou inválidos: ${missing.join(", ")}`;
  }

  if (typeof data.enabled !== "boolean") return "enabled deve ser booleano";
  if (typeof data.stock !== "number") return "stock deve ser numérico";
  if (typeof data.price !== "number") return "price deve ser numérico";
  if (typeof data.price_with_discount !== "number")
    return "price_with_discount deve ser numérico";
  if (!Array.isArray(data.category_ids))
    return "category_ids deve ser um array";
  if (!Array.isArray(data.images)) return "images deve ser um array";
  if (!Array.isArray(data.options)) return "options deve ser um array";

  return null;
}
