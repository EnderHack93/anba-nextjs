"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { recoverPassword } from "@/services/auth/reset-password/page";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, ingrese su correo electrónico");
      return;
    }

    try {
      // Lógica para enviar solicitud de recuperación
      const response = await recoverPassword(email);
      if (response) {
          Swal.fire({
              title: "Correo electrónico enviado",
              text: "Revise su bandeja de entrada para restablecer su contraseña.",
              icon: "success",
              confirmButtonText: "Aceptar",
          })
      }
      else{
        setError("Error al enviar correo electrónico")
      }

    } catch (err) {
      setError("Error al conectar con el servidor.");
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

      {/* Contenedor del formulario de recuperación */}
      <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-xl shadow-xl bg-opacity-95 md:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-royalBlue-darker">Recuperar Contraseña</h2>
          <p className="text-gray-600 text-sm mt-1">
            Ingrese su correo electrónico para restablecer su contraseña.
          </p>
        </div>

        <form onSubmit={handleRecover} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue transition duration-150"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center text-sm mt-2">{success}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-royalBlue text-white rounded-lg hover:bg-royalBlue-dark focus:outline-none focus:ring-2 focus:ring-royalBlue transition duration-200"
          >
            Enviar Correo de Recuperación
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-royalBlue hover:underline">
            Regresar al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
