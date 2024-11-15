import React from 'react';
import { FaLock } from 'react-icons/fa';

const UnauthorizedScreen: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 px-4">
      <div className="flex flex-col items-center space-y-6 max-w-md p-8 bg-white shadow-lg rounded-lg">
        {/* Icono de bloqueo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-200">
          <FaLock className="text-red-500 w-8 h-8" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800">
          Acceso no autorizado
        </h1>

        {/* Descripción */}
        <p className="text-gray-600 text-center">
          No tienes los permisos necesarios para acceder a esta página.
          Por favor, verifica con tu administrador o inicia sesión con una cuenta que tenga acceso.
        </p>

        {/* Botón para regresar */}
        <button
          onClick={onGoBack ? onGoBack : () => window.history.back()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedScreen;
