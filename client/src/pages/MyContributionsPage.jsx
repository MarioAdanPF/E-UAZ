import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import ContributionCard from '../components/ContributionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import { PlusCircle, X, Upload } from 'lucide-react';

const MyContributionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-contributions', page],
    queryFn: async () => {
      const response = await api.get(`/contributions/my?page=${page}&limit=12`);
      return response.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (contributionData) => {
      console.log('📤 Enviando a API:', contributionData);
      const response = await api.post('/contributions', contributionData);
      console.log('📥 Respuesta de API:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('✅ Contribución creada exitosamente');
      queryClient.invalidateQueries(['my-contributions']);
      setShowModal(false);
      resetForm();
      alert('✅ ¡Contribución publicada exitosamente!');
    },
    onError: (error) => {
      console.error('❌ Error al crear contribución:', error);
      console.error('Detalles:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error al crear la contribución';
      alert(`❌ Error: ${errorMessage}`);
      setUploadingImages(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contributions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-contributions']);
    }
  });

  const resetForm = () => {
    setFormData({ description: '' });
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    // Validar que sean imágenes
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo por archivo)
    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Algunas imágenes son muy grandes. Tamaño máximo: 5MB por imagen');
      return;
    }

    setSelectedFiles(validFiles);

    // Crear previews
    const previews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== INICIANDO SUBMIT ===');
    console.log('Descripción:', formData.description);
    console.log('Archivos seleccionados:', selectedFiles.length);
    
    if (!formData.description.trim()) {
      alert('Por favor agrega una descripción');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    try {
      setUploadingImages(true);
      console.log('Iniciando subida de imágenes...');

      // Subir imágenes a Supabase Storage
      const formDataToSend = new FormData();
      selectedFiles.forEach(file => {
        console.log('Agregando archivo:', file.name, file.size);
        formDataToSend.append('images', file);
      });

      console.log('Enviando petición a /api/upload/images...');
      const uploadResponse = await api.post('/upload/images', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Respuesta del servidor:', uploadResponse.data);
      const imageUrls = uploadResponse.data.data.imageUrls;
      console.log('URLs de imágenes:', imageUrls);

      // Crear contribución con las URLs de las imágenes
      console.log('Creando contribución con datos:', {
        description: formData.description,
        descripcionLength: formData.description.length,
        images: imageUrls,
        imagesCount: imageUrls.length
      });
      
      createMutation.mutate({
        description: formData.description,
        images: imageUrls
      });

    } catch (error) {
      console.error('=== ERROR AL SUBIR IMÁGENES ===');
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al subir imágenes';
      alert(`❌ Error: ${errorMessage}\n\n${error.response?.data?.details || ''}`);
    } finally {
      setUploadingImages(false);
      console.log('=== FIN DEL SUBMIT ===');
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  const { contributions = [], pagination } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Contribuciones
          </h1>
          <p className="text-gray-600">
            Gestiona y comparte tus acciones ambientales
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          icon={PlusCircle}
        >
          Nueva Contribución
        </Button>
      </div>

      {/* Contributions Grid */}
      {contributions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg mb-4">
            Aún no has creado contribuciones
          </p>
          <Button onClick={() => setShowModal(true)} icon={PlusCircle}>
            Crear mi primera contribución
          </Button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {contributions.map((contribution) => (
              <ContributionCard
                key={contribution.id}
                contribution={contribution}
                isOwner={true}
                onDelete={(id) => {
                  if (window.confirm('¿Estás seguro de eliminar esta contribución?')) {
                    deleteMutation.mutate(id);
                  }
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Nueva Contribución
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  label="Descripción (mínimo 10 caracteres)"
                  placeholder="Describe tu acción ambiental... ¿Qué hiciste hoy por el medio ambiente? (ej: Hoy separé mi basura en orgánica e inorgánica para facilitar el reciclaje)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
                {formData.description && (
                  <p className={`text-xs mt-1 ${formData.description.length >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.description.length}/10 caracteres {formData.description.length >= 10 ? '✓' : '(mínimo requerido)'}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes *
                  </label>
                  
                  {/* File Input */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 mb-1">
                        Haz clic para seleccionar imágenes
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG, GIF o WebP (máx. 5MB cada una, hasta 5 imágenes)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {(selectedFiles[index].size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {selectedFiles.length} {selectedFiles.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    loading={createMutation.isPending || uploadingImages}
                    className="flex-1"
                    disabled={uploadingImages || formData.description.length < 10}
                  >
                    {uploadingImages ? 'Subiendo imágenes...' : 'Publicar Contribución'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={uploadingImages}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContributionsPage;
