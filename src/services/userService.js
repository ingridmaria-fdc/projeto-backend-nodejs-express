const User = require("../models/user");

module.exports = {
  async getByIdUser(id) {
    return await findUserById(id, ["id", "firstname", "surname", "email"]);
  },

  async createUser({ firstname, surname, email, password }) {
    await ensureEmailIsUnique(email);

    return await User.create({
      firstname,
      surname,
      email,
      password,
    });
  },

  async updateUser(id, data) {
    const user = await findUserById(id);
    if (!user) return null;

    await User.update(data, { where: { id } });
    return true;
  },

  async deleteUser(id) {
    const user = await findUserById(id);
    if (!user) return null;

    await User.destroy({ where: { id } });
    return true;
  },

  async getByEmail(email) {
    return await User.findOne({ where: { email } });
  },
};

async function findUserById(id, attributes = undefined) {
  return await User.findByPk(id, attributes ? { attributes } : undefined);
}

async function ensureEmailIsUnique(email) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error("Email já está em uso");
  }
}
