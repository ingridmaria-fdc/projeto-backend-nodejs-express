const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gerenciar categorias
 */

/**
 * @swagger
 * /v1/category/search:
 *   get:
 *     summary: Buscar categorias com filtros
 *     tags: [Categorias]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limite de resultados por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Página atual
 *       - in: query
 *         name: useInMenuFilter
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filtrar categorias usadas no menu
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           items:
 *             type: string
 *           example: "id, name"
 *         explode: true
 *         description: Campos a retornar id, name
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   use_in_menu:
 *                     type: boolean
 */
router.get("/v1/category/search", categoryController.searchCategories);

/**
 * @swagger
 * /v1/category/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 use_in_menu:
 *                   type: boolean
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/v1/category/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /v1/category:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eletrônicos"
 *               slug:
 *                 type: string
 *                 example: "eletronicos"
 *               use_in_menu:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 use_in_menu:
 *                   type: boolean
 *       400:
 *         description: Dados inválidos ou nome já em uso
 */
router.post("/v1/category", authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /v1/category/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eletrônicos Atualizados"
 *               slug:
 *                 type: string
 *                 example: "eletronicos-atualizados"
 *               use_in_menu:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       204:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.put(
  "/v1/category/:id",
  authMiddleware,
  categoryController.updateCategory
);

/**
 * @swagger
 * /v1/category/{id}:
 *   delete:
 *     summary: Deletar categoria por ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete(
  "/v1/category/:id",
  authMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
