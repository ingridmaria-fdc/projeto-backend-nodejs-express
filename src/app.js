const express = require("express");
const setupSwagger = require("./swagger");
const app = express();
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
setupSwagger(app);

app.use(express.json());
app.use(authRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
