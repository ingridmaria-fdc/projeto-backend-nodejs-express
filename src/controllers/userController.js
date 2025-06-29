const userService = require("../services/userService");
const handleError = require("../utils/handleError");
const {
  validateRequiredFields,
  validatePasswordsMatch,
} = require("../utils/validators");

module.exports = {
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getByIdUser(id);

      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });

      return res.status(200).json(user);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createUser(req, res) {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body;

      const missingFields = validateRequiredFields(
        { firstname, surname, email, password, confirmPassword },
        ["firstname", "surname", "email", "password", "confirmPassword"]
      );
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
        });
      }

      if (!validatePasswordsMatch(password, confirmPassword)) {
        return res.status(400).json({ message: "As senhas não coincidem" });
      }

      const newUser = await userService.createUser({
        firstname,
        surname,
        email,
        password,
      });

      return res.status(201).json({
        id: newUser.id,
        firstname: newUser.firstname,
        surname: newUser.surname,
        email: newUser.email,
      });
    } catch (error) {
      if (error.message.includes("Email já está em uso")) {
        return res.status(400).json({ message: error.message });
      }
      handleError(res, error);
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstname, surname, email } = req.body;

      const missingFields = validateRequiredFields(
        { firstname, surname, email },
        ["firstname", "surname", "email"]
      );
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
        });
      }

      const updated = await userService.updateUser(id, {
        firstname,
        surname,
        email,
      });

      if (!updated)
        return res.status(404).json({ message: "Usuário não encontrado" });

      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deleted = await userService.deleteUser(id);

      if (!deleted)
        return res.status(404).json({ message: "Usuário não encontrado" });

      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  },
};
