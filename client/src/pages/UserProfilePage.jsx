import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import ContributionCard from '../components/ContributionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { User as UserIcon, Calendar, Award } from 'lucide-react';

const UserProfilePage = () => {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Usuario no encontrado
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-12 h-12 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-xl text-gray-600 mb-2">@{user.username}</p>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Miembro desde {formatDate(user.createdAt)}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-primary-600">
              {user.contributions?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Contribuciones</p>
          </div>
        </div>
      </div>

      {/* Contributions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contribuciones de {user.name}
        </h2>
        
        {user.contributions && user.contributions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.contributions.map((contribution) => (
              <ContributionCard
                key={contribution.id}
                contribution={{
                  ...contribution,
                  user: {
                    id: user.id,
                    name: user.name,
                    username: user.username
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">
              Este usuario aún no tiene contribuciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
