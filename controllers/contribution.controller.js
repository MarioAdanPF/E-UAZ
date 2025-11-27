const { Contribution, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Crear nueva contribución
 */
const createContribution = async (req, res) => {
  try {
    const userId = req.user.id;
    const { description, images } = req.body;

    // Validaciones
    if (!description || description.trim() === '') {
      return res.status(400).json({
        error: true,
        message: 'La descripción es requerida'
      });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Debes agregar al menos una imagen'
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        error: true,
        message: `La descripción debe tener al menos 10 caracteres (actualmente tiene ${description.trim().length})`
      });
    }

    // Crear contribución
    const contribution = await Contribution.create({
      description,
      images,
      user_id: userId
    });

    // Obtener la contribución con datos del usuario
    const contributionWithUser = await Contribution.findByPk(contribution.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Contribución creada exitosamente',
      data: contributionWithUser
    });

  } catch (error) {
    console.error('Error en createContribution:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al crear contribución',
      details: error.message
    });
  }
};

/**
 * Obtener todas las contribuciones con paginación
 */
const getAllContributions = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = userId ? { user_id: userId } : {};

    const { count, rows: contributions } = await Contribution.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: {
        contributions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error en getAllContributions:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener contribuciones',
      details: error.message
    });
  }
};

/**
 * Buscar contribuciones por descripción
 */
const searchContributions = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        error: true,
        message: 'Se requiere un término de búsqueda'
      });
    }

    const { count, rows: contributions } = await Contribution.findAndCountAll({
      where: {
        description: {
          [Op.iLike]: `%${query}%`
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: {
        contributions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error en searchContributions:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al buscar contribuciones',
      details: error.message
    });
  }
};

/**
 * Obtener contribuciones del usuario autenticado
 */
const getMyContributions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: contributions } = await Contribution.findAndCountAll({
      where: { user_id: userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: {
        contributions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error en getMyContributions:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener tus contribuciones',
      details: error.message
    });
  }
};

/**
 * Obtener una contribución por ID
 */
const getContributionById = async (req, res) => {
  try {
    const { id } = req.params;

    const contribution = await Contribution.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }]
    });

    if (!contribution) {
      return res.status(404).json({
        error: true,
        message: 'Contribución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: contribution
    });

  } catch (error) {
    console.error('Error en getContributionById:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener contribución',
      details: error.message
    });
  }
};

/**
 * Actualizar una contribución
 */
const updateContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, images } = req.body;

    const contribution = await Contribution.findByPk(id);

    if (!contribution) {
      return res.status(404).json({
        error: true,
        message: 'Contribución no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño
    if (contribution.user_id !== userId) {
      return res.status(403).json({
        error: true,
        message: 'No tienes permiso para editar esta contribución'
      });
    }

    // Validaciones
    if (description && description.trim().length < 10) {
      return res.status(400).json({
        error: true,
        message: `La descripción debe tener al menos 10 caracteres (actualmente tiene ${description.trim().length})`
      });
    }

    // Actualizar
    await contribution.update({
      description: description || contribution.description,
      images: images || contribution.images
    });

    // Obtener contribución actualizada con usuario
    const updatedContribution = await Contribution.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Contribución actualizada exitosamente',
      data: updatedContribution
    });

  } catch (error) {
    console.error('Error en updateContribution:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al actualizar contribución',
      details: error.message
    });
  }
};

/**
 * Eliminar una contribución
 */
const deleteContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const contribution = await Contribution.findByPk(id);

    if (!contribution) {
      return res.status(404).json({
        error: true,
        message: 'Contribución no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño
    if (contribution.user_id !== userId) {
      return res.status(403).json({
        error: true,
        message: 'No tienes permiso para eliminar esta contribución'
      });
    }

    await contribution.destroy();

    return res.status(200).json({
      success: true,
      message: 'Contribución eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteContribution:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al eliminar contribución',
      details: error.message
    });
  }
};

module.exports = {
  createContribution,
  getAllContributions,
  searchContributions,
  getMyContributions,
  getContributionById,
  updateContribution,
  deleteContribution
};
