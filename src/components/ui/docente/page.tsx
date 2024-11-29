"use client";
import { useSession } from "next-auth/react";

export default function InicioDocente() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Encabezado */}
      <header className="bg-white shadow-md w-full max-w-5xl p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido, {session?.user?.name || "Docente"}!
        </h1>
        <p className="text-gray-600 mt-2">Esperamos que tengas un día productivo.</p>
      </header>

      {/* Accesos rápidos */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <button className="bg-emerald-500 text-white rounded-lg p-6 shadow-lg hover:bg-emerald-600 transition-all"
        onClick={() => {
            window.location.href = "/asistencia"
        }}>
          <h2 className="text-xl font-semibold">Registro de Asistencia</h2>
          <p className="text-sm mt-2">Registra la asistencia de tus estudiantes rápidamente.</p>
        </button>
        <button className="bg-blue-500 text-white rounded-lg p-6 shadow-lg hover:bg-blue-600 transition-all"
                onClick={() => {
                    window.location.href = "/notas"
                }}>
          <h2 className="text-xl font-semibold">Evaluaciones</h2>
          <p className="text-sm mt-2">Consulta y gestiona evaluaciones de tus clases.</p>
        </button>
        <button className="bg-indigo-500 text-white rounded-lg p-6 shadow-lg hover:bg-indigo-600 transition-all"
                onClick={() => {
                    window.location.href = "/clases"
                }}>
          <h2 className="text-xl font-semibold">Planificación de Clases</h2>
          <p className="text-sm mt-2">Organiza y planea tus actividades docentes.</p>
        </button>
        <button className="bg-gray-300 text-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-400 transition-all">
          <h2 className="text-xl font-semibold">Acceder al Dashboard</h2>
          <p className="text-sm mt-2">Revisa información detallada y estadísticas completas.</p>
        </button>
      </section>

      {/* Información relevante */}
      <section className="mt-8 bg-white shadow-md w-full max-w-5xl p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Próximos eventos</h2>
        <ul className="mt-4 space-y-4">
          <li className="flex items-start">
            <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">Reunión del equipo docente</h3>
              <p className="text-sm text-gray-600">Lunes, 4 de diciembre, 10:00 AM</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">Entrega de calificaciones</h3>
              <p className="text-sm text-gray-600">Viernes, 8 de diciembre</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Estadísticas resumidas */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-bold text-emerald-500">5</h3>
          <p className="text-gray-600 mt-2">Clases activas</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-bold text-blue-500">120</h3>
          <p className="text-gray-600 mt-2">Estudiantes registrados</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-bold text-indigo-500">10</h3>
          <p className="text-gray-600 mt-2">Evaluaciones pendientes</p>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="mt-12 text-center text-gray-600">
        <p>¿Necesitas ayuda? <a href="#" className="text-blue-500 underline">Contacta al soporte</a>.</p>
      </footer>
    </div>
  );
}
