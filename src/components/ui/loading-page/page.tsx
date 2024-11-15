import React from 'react';

// Componente de pantalla de carga
const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 transition-all duration-500">
      <div className="flex flex-col items-center space-y-4 px-4">
        {/* Spinner de carga */}
        <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-blue-300 animate-spin-slow"></div>

        {/* Texto de carga */}
        <p className="text-lg font-medium text-black animate-fade-in">
          Cargando, por favor espera...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
