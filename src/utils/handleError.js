module.exports = function handleError(res, error) {
  console.error("Erro:", error);
  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
};
