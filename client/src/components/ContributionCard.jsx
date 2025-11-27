import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

const ContributionCard = ({ contribution, onDelete, onEdit, isOwner = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = contribution.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Images Carousel */}
      {images.length > 0 && (
        <div className="relative h-64 bg-gray-200">
          <img
            src={images[currentImageIndex]}
            alt={`Contribución ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* User Info */}
        <div className="flex items-center justify-between mb-3">
          <Link
            to={`/user/${contribution.user?.id}`}
            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{contribution.user?.name}</span>
            <span className="text-sm text-gray-500">@{contribution.user?.username}</span>
          </Link>

          {/* Actions */}
          {isOwner && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(contribution)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(contribution.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{contribution.description}</p>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(contribution.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionCard;
