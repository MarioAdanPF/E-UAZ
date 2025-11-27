const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña
 * @param {String} password - Contraseña en texto plano
 * @returns {Promise<String>} Contraseña hasheada
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
};

/**
 * Compara una contraseña con su hash
 * @param {String} password - Contraseña en texto plano
 * @param {String} hash - Hash de la contraseña
 * @returns {Promise<Boolean>} True si coinciden
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
