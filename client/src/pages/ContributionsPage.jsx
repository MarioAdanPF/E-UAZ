import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import ContributionCard from '../components/ContributionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search } from 'lucide-react';
import Input from '../components/Input';

const ContributionsPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 12;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contributions', page],
    queryFn: async () => {
      const response = await api.get(`/contributions?page=${page}&limit=${limit}`);
      return response.data.data;
    }
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const response = await api.get(`/contributions/search?query=${searchQuery}&page=1&limit=${limit}`);
      return response.data.data;
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error al cargar contribuciones
      </div>
    </div>
  );

  const { contributions = [], pagination } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contribuciones Ambientales
        </h1>
        <p className="text-gray-600">
          Explora las acciones que la comunidad está tomando por el medio ambiente
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <Input
          type="text"
          placeholder="Buscar contribuciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
        />
      </form>

      {/* Contributions Grid */}
      {contributions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay contribuciones aún. ¡Sé el primero en compartir!
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {contributions.map((contribution) => (
              <ContributionCard
                key={contribution.id}
                contribution={contribution}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContributionsPage;
