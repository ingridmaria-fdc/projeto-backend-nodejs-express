function validateRequiredFields(data, requiredFields) {
  return requiredFields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === ""
  );
}

function validatePasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

function validateBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function validateLimitAndPage(limit, page) {
  const limitNum = parseInt(limit, 10);
  const pageNum = parseInt(page, 10);

  if (isNaN(limitNum) || limitNum === 0) return "Limit inválido";
  if (limitNum !== -1 && (isNaN(pageNum) || pageNum < 1))
    return "Page inválido";

  return null;
}

function validatePriceRange(range) {
  if (!range) return { priceMin: undefined, priceMax: undefined, error: null };

  const [min, max] = range.split("-");
  const priceMin = parseFloat(min);
  const priceMax = parseFloat(max);

  if (isNaN(priceMin) || isNaN(priceMax)) {
    return { error: "Faixa de preço inválida. Use o formato min-max." };
  }

  return { priceMin, priceMax, error: null };
}

module.exports = {
  validateRequiredFields,
  validatePasswordsMatch,
  validateBoolean,
  validateLimitAndPage,
  validatePriceRange,
};
