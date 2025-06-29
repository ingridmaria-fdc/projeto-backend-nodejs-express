const categoryService = require("../services/categoryService");
const handleError = require("../utils/handleError");
const {
  validateRequiredFields,
  validateBoolean,
} = require("../utils/validators");

module.exports = {
  async searchCategories(req, res) {
    try {
      let {
        limit = "12",
        page = "1",
        fields = "name,slug",
        use_in_menu,
      } = req.query;

      limit = parseInt(limit, 10);
      page = parseInt(page, 10);

      if (isNaN(limit) || limit === 0) {
        return res.status(400).json({ message: "Limit inválido" });
      }
      if (limit !== -1 && (isNaN(page) || page < 1)) {
        return res.status(400).json({ message: "Page inválido" });
      }

      const fieldsArray = fields
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (!fieldsArray.includes("id")) {
        fieldsArray.unshift("id");
      }

      let useInMenuFilter;
      if (use_in_menu !== undefined) {
        const parsed = validateBoolean(use_in_menu);
        if (parsed === null) {
          return res.status(400).json({
            message: "use_in_menu inválido, deve ser true ou false",
          });
        }
        useInMenuFilter = parsed;
      }

      const result = await categoryService.searchCategories({
        limit,
        page,
        fields: fieldsArray,
        useInMenuFilter,
      });

      return res.status(200).json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.getByIdCategory(id);

      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      return res.status(200).json(category);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createCategory(req, res) {
    try {
      const { name, slug, use_in_menu } = req.body;

      const missingFields = validateRequiredFields(
        { name, slug, use_in_menu },
        ["name", "slug", "use_in_menu"]
      );
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
        });
      }

      if (typeof use_in_menu !== "boolean") {
        return res
          .status(400)
          .json({ message: "use_in_menu deve ser booleano" });
      }

      const newCategory = await categoryService.createCategory({
        name,
        slug,
        use_in_menu,
      });

      return res.status(201).json({
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        use_in_menu: newCategory.use_in_menu,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, use_in_menu } = req.body;

      const missingFields = validateRequiredFields(
        { name, slug, use_in_menu },
        ["name", "slug", "use_in_menu"]
      );
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
        });
      }

      if (typeof use_in_menu !== "boolean") {
        return res
          .status(400)
          .json({ message: "use_in_menu deve ser booleano" });
      }

      const updated = await categoryService.updateCategory(id, {
        name,
        slug,
        use_in_menu,
      });

      if (!updated) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const deleted = await categoryService.deleteCategory(id);

      if (!deleted) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },
};
