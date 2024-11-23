"use client";

import React, { useState } from "react";
import { fetchPrediction } from "@/services/cuadro-de-mando/prediccion-estado";

// Define the classes for prediction
const CLASSES = [
  "Activo",
  "Alerta",
  "Condicional",
  "Excelencia",
  "Recuperación",
  "Reprobado",
];

const PredictionWidget = () => {
  const [formData, setFormData] = useState({
    Edad: 20,
    Promedio_Final: 95,
    Asistencia_Total: 95,
    Num_Faltas: 2,
    Porcentaje_Inasistencia: 5,
    porc_Materias_Aprobadas: 0,
    porc_Materias_Reprobadas: 14,
    Genero_M: 1,
    Especialidad_DIBUJO: 0,
    Especialidad_ESCULTURA: 1,
    Especialidad_GRAFICAS: 0,
    Especialidad_PINTURA: 0,
  });

  const [prediction, setPrediction] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPrediction(formData);
      setPrediction(result);
    } catch (err) {
      setError("No se pudo obtener la predicción. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Predicción del Estado Académico
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Completa los datos a continuación para predecir el estado académico del
        estudiante basado en la información proporcionada.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Input Fields */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-700"
            >
              {key.replace(/_/g, " ")} {key.includes("porc") ? "(%)" : ""}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Prediction Button */}
      <button
        onClick={handlePredict}
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Calculando..." : "Obtener Predicción"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Prediction Result */}
      {prediction && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold text-center">
            Resultado de Predicción
          </h3>
          <p className="text-center">
            <strong>Estado Académico:</strong> {prediction.estado_academico}
          </p>

          <h4 className="text-md font-semibold mt-4">Distribución:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {CLASSES.map((clase, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-md shadow-md"
              >
                <span className="font-semibold text-gray-700">{clase}</span>
                <span className="text-blue-600 font-bold">
                  {(prediction.probabilidades[index] * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionWidget;
