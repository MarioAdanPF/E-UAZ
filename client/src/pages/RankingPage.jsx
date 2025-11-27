import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, Medal, Award, User } from 'lucide-react';

const RankingPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const response = await api.get('/users/ranking?limit=20');
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error al cargar el ranking</p>
          <p className="text-sm mt-1">{error.message || 'Por favor, intenta de nuevo más tarde'}</p>
        </div>
      </div>
    );
  }

  // Si no hay datos o el array está vacío
  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ranking EcoUAZ
          </h1>
          <p className="text-gray-600 text-lg">
            Los usuarios más comprometidos con el medio ambiente
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Aún no hay contribuciones
          </h2>
          <p className="text-gray-500 mb-6">
            Sé el primero en contribuir y aparece en el ranking
          </p>
          <Link
            to="/my-contributions"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Crear mi primera contribución
          </Link>
        </div>
      </div>
    );
  }

  const getMedalIcon = (position) => {
    if (position === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (position === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (position === 3) return <Award className="w-8 h-8 text-orange-600" />;
    return null;
  };

  const getMedalBg = (position) => {
    if (position === 1) return 'bg-yellow-50 border-yellow-200';
    if (position === 2) return 'bg-gray-50 border-gray-200';
    if (position === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Ranking EcoUAZ
        </h1>
        <p className="text-gray-600 text-lg">
          Los usuarios más comprometidos con el medio ambiente
        </p>
      </div>

      {/* Top 3 Podium */}
      {data && data.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="bg-gray-100 rounded-xl p-6 text-center w-full">
              <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-2xl text-gray-900">#2</p>
              <p className="font-semibold text-lg text-gray-900 mt-2">{data[1].name}</p>
              <p className="text-sm text-gray-600">@{data[1].username}</p>
              <p className="text-primary-600 font-bold text-xl mt-2">
                {data[1].contributionCount} contribuciones
              </p>
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-xl p-6 text-center w-full border-4 border-yellow-400">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <p className="font-bold text-3xl text-gray-900">#1</p>
              <p className="font-semibold text-xl text-gray-900 mt-2">{data[0].name}</p>
              <p className="text-sm text-gray-600">@{data[0].username}</p>
              <p className="text-primary-600 font-bold text-2xl mt-2">
                {data[0].contributionCount} contribuciones
              </p>
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="bg-orange-50 rounded-xl p-6 text-center w-full">
              <Award className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <p className="font-bold text-2xl text-gray-900">#3</p>
              <p className="font-semibold text-lg text-gray-900 mt-2">{data[2].name}</p>
              <p className="text-sm text-gray-600">@{data[2].username}</p>
              <p className="text-primary-600 font-bold text-xl mt-2">
                {data[2].contributionCount} contribuciones
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Ranking List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-2xl font-bold">Ranking Completo</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {data && data.map((user, index) => (
            <Link
              key={user.id}
              to={`/user/${user.id}`}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-2 ${getMedalBg(index + 1)}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-12">
                  {getMedalIcon(index + 1) || (
                    <span className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">
                  {user.contributionCount}
                </p>
                <p className="text-sm text-gray-600">contribuciones</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          🏆 Recompensas al Final del Curso
        </h3>
        <p className="text-gray-700">
          Los usuarios con más contribuciones recibirán reconocimientos especiales 
          por su compromiso con el medio ambiente. ¡Sigue contribuyendo!
        </p>
      </div>
    </div>
  );
};

export default RankingPage;
