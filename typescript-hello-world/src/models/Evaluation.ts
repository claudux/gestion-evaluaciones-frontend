// 1. Unión de tipos para bloquear cadenas libres
export type EvaluationStatus = "Pendiente" | "Publicada" | "Completa";

// 2. Contrato de datos hermético para una Evaluación
export interface Evaluation {
  id: number;
  subject: string;
  copies: number;
  examDate: string;
  status: EvaluationStatus;
}