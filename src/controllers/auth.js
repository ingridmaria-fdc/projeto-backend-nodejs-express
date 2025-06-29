const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const handleError = require("../utils/handleError");
const { validateRequiredFields } = require("../utils/validators");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  async generateToken(req, res) {
    const { email, password } = req.body;

    const missingFields = validateRequiredFields({ email, password }, [
      "email",
      "password",
    ]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    try {
      const user = await userService.getByEmail(email);

      const passwordMatch = user && user.password === password;
      if (!passwordMatch) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ token });
    } catch (error) {
      handleError(res, error);
    }
  },
};
