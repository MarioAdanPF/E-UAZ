const supabase = require('../config/supabase');
const path = require('path');

/**
 * Sube una imagen a Supabase Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {String} fileName - Nombre del archivo
 * @param {String} mimetype - Tipo MIME del archivo
 * @returns {Promise<String>} URL pública de la imagen
 */
const uploadImageToSupabase = async (fileBuffer, fileName, mimetype) => {
  try {
    // Generar nombre único para el archivo
    const fileExt = path.extname(fileName);
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = `contributions/${uniqueFileName}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('contribution-images')
      .upload(filePath, fileBuffer, {
        contentType: mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error al subir imagen a Supabase:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    // Obtener URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from('contribution-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Error en uploadImageToSupabase:', error);
    throw error;
  }
};

/**
 * Elimina una imagen de Supabase Storage
 * @param {String} imageUrl - URL de la imagen a eliminar
 * @returns {Promise<Boolean>} True si se eliminó correctamente
 */
const deleteImageFromSupabase = async (imageUrl) => {
  try {
    // Extraer el path del archivo desde la URL
    const urlParts = imageUrl.split('/contribution-images/');
    if (urlParts.length < 2) {
      throw new Error('URL de imagen inválida');
    }
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('contribution-images')
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar imagen de Supabase:', error);
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }

    return true;

  } catch (error) {
    console.error('Error en deleteImageFromSupabase:', error);
    // No lanzar error para no bloquear la eliminación de la contribución
    return false;
  }
};

/**
 * Valida que el archivo sea una imagen válida
 * @param {Object} file - Archivo de multer
 * @returns {Boolean} True si es válido
 */
const validateImageFile = (file) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(file.mimetype)) {
    throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es muy grande. Tamaño máximo: 5MB');
  }

  return true;
};

module.exports = {
  uploadImageToSupabase,
  deleteImageFromSupabase,
  validateImageFile
};
