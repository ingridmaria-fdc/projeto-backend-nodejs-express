const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciar produtos
 */

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Buscar produtos com filtros e paginação
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: match
 *         schema:
 *           type: string
 *         description: Texto para busca
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite por página
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: true
 *         description: IDs das categorias
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           items:
 *             type: string
 *         explode: true
 *         description: Campos a retornar name,images,enabled,slug, stock, description, price, price_with_discount, options
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Preço máximo
 *     responses:
 *       200:
 *         description: Lista de produtos encontrada
 */
router.get("/v1/product/search", productController.searchProducts);

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get("/v1/product/:id", productController.getProductById);

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               price_with_discount:
 *                 type: number
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     type:
 *                       type: string
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/v1/product", authMiddleware, productController.createProduct);

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     summary: Atualizar um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               price_with_discount:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       204:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put("/v1/product/:id", authMiddleware, productController.updateProduct);

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Deletar produto por ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto deletado
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  "/v1/product/:id",
  authMiddleware,
  productController.deleteProduct
);

module.exports = router;
