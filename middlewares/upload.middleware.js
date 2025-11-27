const multer = require('multer');

// Configurar multer para usar memoria (no guardar en disco)
const storage = multer.memoryStorage();

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 5 // Máximo 5 archivos por petición
  },
  fileFilter: (req, file, cb) => {
    // Validar tipo de archivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
    }
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: true,
        message: 'El archivo es muy grande. Tamaño máximo: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: true,
        message: 'Demasiados archivos. Máximo: 5 imágenes'
      });
    }
    return res.status(400).json({
      error: true,
      message: `Error al subir archivo: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      error: true,
      message: err.message || 'Error al procesar archivos'
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleMulterError
};
