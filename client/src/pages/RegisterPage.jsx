import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Lock, User as UserIcon, UserCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
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

    setLoading(true);
    setErrors({});

    const result = await register(formData.username, formData.name, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Leaf className="w-16 h-16 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Únete a EcoUAZ
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Comienza a contribuir al medio ambiente hoy
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <Input
              label="Nombre de Usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              icon={UserIcon}
              placeholder="usuario123"
              error={errors.username}
              required
              autoComplete="username"
            />

            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={UserCircle}
              placeholder="Juan Pérez"
              error={errors.name}
              required
              autoComplete="name"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              placeholder="Mínimo 6 caracteres"
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              placeholder="Repite tu contraseña"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Registrarse
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
