import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Image, PlusCircle, TrendingUp, Leaf } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: PlusCircle,
      title: 'Crea Contribuciones',
      description: 'Comparte tus acciones ambientales con la comunidad',
      link: '/my-contributions',
      color: 'bg-primary-500'
    },
    {
      icon: Image,
      title: 'Explora Contribuciones',
      description: 'Descubre cómo otros cuidan el medio ambiente',
      link: '/contributions',
      color: 'bg-blue-500'
    },
    {
      icon: Trophy,
      title: 'Ver Ranking',
      description: 'Conoce a los usuarios más comprometidos',
      link: '/ranking',
      color: 'bg-yellow-500'
    }
  ];

  const tips = [
    'Separa tu basura en orgánica e inorgánica',
    'Reduce el uso de plásticos desechables',
    'Ahorra agua cerrando la llave mientras te cepillas',
    'Reutiliza y recicla antes de desechar',
    'Usa transporte sostenible cuando sea posible',
    'Planta árboles y cuida las áreas verdes'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-xl text-center text-primary-100 max-w-2xl mx-auto">
            Únete a nuestra comunidad comprometida con el cuidado del medio ambiente.
            Cada acción cuenta, cada contribución marca la diferencia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Sobre EcoUAZ
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              EcoUAZ es una plataforma diseñada para incentivar el cuidado del medio ambiente 
              entre los estudiantes de la universidad. Aquí puedes:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Publicar tus acciones ecológicas con fotos
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Inspirarte con las contribuciones de otros
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Competir sanamente por el bien del planeta
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Ser recompensado por tu compromiso ambiental
              </li>
            </ul>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Leaf className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Tips Ecológicos
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Ideas para tu próxima contribución:
            </p>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Comparte tu primera contribución y empieza a acumular puntos
          </p>
          <Link
            to="/my-contributions"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Crear Contribución
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
