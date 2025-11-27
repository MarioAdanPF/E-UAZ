const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { upload, handleMulterError } = require('../middlewares/upload.middleware');
const { uploadImageToSupabase, validateImageFile } = require('../utils/uploadImage');

/**
 * @route   POST /api/upload/images
 * @desc    Subir una o múltiples imágenes a Supabase Storage
 * @access  Private
 */
router.post('/images', authenticateToken, upload.array('images', 5), handleMulterError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'No se recibieron imágenes para subir'
      });
    }

    // Validar y subir cada imagen
    const uploadPromises = req.files.map(async (file) => {
      // Validar archivo
      validateImageFile(file);
      
      // Subir a Supabase Storage
      const publicUrl = await uploadImageToSupabase(
        file.buffer,
        file.originalname,
        file.mimetype
      );
      
      return publicUrl;
    });

    const imageUrls = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: 'Imágenes subidas exitosamente',
      data: {
        imageUrls
      }
    });

  } catch (error) {
    console.error('Error al subir imágenes:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Error al subir imágenes',
      details: error.message
    });
  }
});

module.exports = router;
