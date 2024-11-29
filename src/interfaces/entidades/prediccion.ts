interface Prediction {
    nombre: string;
    especialidad: string;
    prediccion: {
      estado_academico: string;
      probabilidades: number[];
    };
  }