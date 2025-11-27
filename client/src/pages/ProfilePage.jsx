import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import api from '../config/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { User as UserIcon, Lock, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/auth/profile', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      updateUserProfile(data);
      setSuccess('Perfil actualizado correctamente');
      setFormData({ ...formData, password: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      setErrors({ submit: error.response?.data?.message || 'Error al actualizar perfil' });
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateData = { name: formData.name };
    if (formData.password) {
      updateData.password = formData.password;
    }

    updateMutation.mutate(updateData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mi Perfil
      </h1>

      {/* Profile Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Miembro desde {formatDate(user?.createdAt)}</span>
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Actualizar Información
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <Input
            label="Usuario"
            type="text"
            value={user?.username}
            disabled
            icon={UserIcon}
            className="bg-gray-50"
          />

          <Input
            label="Nombre Completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={UserIcon}
            error={errors.name}
            required
          />

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Deja estos campos vacíos si no deseas cambiar tu contraseña
            </p>
            
            <div className="space-y-4">
              <Input
                label="Nueva Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
                error={errors.password}
                autoComplete="new-password"
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                placeholder="Repite tu nueva contraseña"
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={updateMutation.isPending}
            className="w-full"
          >
            Guardar Cambios
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
