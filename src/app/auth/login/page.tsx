"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";
import Swal from 'sweetalert2';

export default function Login() {
  const [correo, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !password) {
      setError("Por favor, complete todos los campos");
      return;
    }

    try {
      const response = await signIn("credentials", {
        redirect: false,
        correo,
        password,
        remember,
      });

      if (response?.ok) {
        Swal.fire({
          title: '¡Bienvenido de nuevo! 👋',
          text: 'Tu sesión se ha iniciado exitosamente. Nos alegra tenerte de vuelta.',
          icon: 'success',
          iconColor: '#4169E1',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true, // Muestra la alerta como toast en la esquina superior derecha
          position: 'top-end', // Coloca la alerta en la esquina superior derecha
          customClass: {
            popup: 'rounded-lg bg-white shadow-md',
            title: 'text-lg font-bold text-royalBlue-dark',
            htmlContainer: 'text-sm text-gray-600',
          },
          didOpen: () => {
            // Muestra el progreso del tiempo restante
            const progressBar = Swal.getTimerProgressBar();
            if (progressBar) {
              progressBar.style.backgroundColor = '#4169E1';
            }
          }
        });
        
        router.push("/");
      } else {
        setError(response?.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-royalBlue-light p-4">
      {/* Imagen de fondo con blur */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/posrtada2.jpg"
          alt="Background"
          fill
          className="object-cover blur-sm opacity-60"
          priority
        />
      </div>

      {/* Contenedor del formulario de login */}
      <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-xl shadow-xl bg-opacity-95 md:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-royalBlue-darker">Iniciar Sesión</h2>
          <p className="text-gray-600 text-sm mt-1">
            Ingrese sus credenciales para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue transition duration-150"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue transition duration-150"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label htmlFor="remember" className="flex items-center text-sm text-gray-800">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 rounded border-gray-300 focus:ring-royalBlue"
              />
              Recordar sesión
            </label>
            <Link href="recover-password" className="text-sm text-royalBlue hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-royalBlue text-white rounded-lg hover:bg-royalBlue-dark focus:outline-none focus:ring-2 focus:ring-royalBlue transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>


      </div>
    </div>
  );
}
