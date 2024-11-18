"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { resetPassword } from "@/services/auth/reset-password/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Suspense } from "react";
import { useRouter } from "next/router";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Token inválido o ausente",
        text: "El enlace para restablecer tu contraseña no es válido. Por favor solicita uno nuevo.",
        icon: "error",
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#4169E1",
      }).then(() => {
        router.push("/auth/login");
      });
    }
  }, [token, router]);

  // Función para validar la contraseña
  const validatePassword = (password: string) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthCheck) return "La contraseña debe tener al menos 8 caracteres.";
    if (!uppercaseCheck)
      return "La contraseña debe incluir al menos una letra mayúscula.";
    if (!specialCharCheck)
      return "La contraseña debe incluir al menos un carácter especial.";
    return null;
  };

  // Validaciones en tiempo real
  useEffect(() => {
    if (newPassword) {
      setError(validatePassword(newPassword));
    } else {
      setError(null);
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden. Por favor, verifica.",
        icon: "error",
        confirmButtonColor: "#D93636",
      });
      return;
    }

    if (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#D93636",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (token) {
        const response = await resetPassword(token, newPassword);
        if (response) {
          Swal.fire({
            title: "¡Éxito!",
            text: "Tu contraseña se ha cambiado correctamente. Ahora puedes iniciar sesión.",
            icon: "success",
            confirmButtonColor: "#50C878",
          }).then(() => {
            router.push("/auth/login");
          });
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error al restablecer",
        text: error.response?.data?.message || "Inténtalo nuevamente.",
        icon: "error",
        confirmButtonColor: "#D93636",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-royalBlue-light p-4">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/posrtada2.jpg"
            alt="Background"
            fill
            className="object-cover blur-sm opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-xl shadow-xl bg-opacity-95 md:max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-royalBlue-darker">
              Restablecer Contraseña
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className={`w-full mt-1 px-4 py-2 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    error ? "focus:ring-red-500" : "focus:ring-royalBlue"
                  } focus:border-royalBlue transition duration-150`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center mt-1 px-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full mt-1 px-4 py-2 border ${
                  newPassword !== confirmPassword && confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  newPassword !== confirmPassword && confirmPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-royalBlue"
                } focus:border-royalBlue transition duration-150`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {newPassword !== confirmPassword && confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  Las contraseñas no coinciden.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                !!(isSubmitting || error || newPassword !== confirmPassword)
              }
              className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
                isSubmitting || error || newPassword !== confirmPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="w-full px-4 py-2 mt-3 text-white font-semibold rounded-md bg-gray-400 hover:bg-gray-500"
            >
              Volver
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default ResetPasswordPage;
