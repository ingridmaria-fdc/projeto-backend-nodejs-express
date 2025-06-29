const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoint para geração de token
 */

/**
 * @swagger
 * /v1/user/token:
 *   post:
 *     summary: Gerar token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciais inválidas
 */
router.post("/v1/user/token", authController.generateToken);

module.exports = router;
