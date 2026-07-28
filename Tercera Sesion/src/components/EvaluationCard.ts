import type { Evaluation } from "../models/Evaluation";

/**
 * Función Pura: Genera el marcado HTML para una sola tarjeta de evaluación.
 */
export function createEvaluationCard(evaluation: Evaluation): string {
    // Determinamos el color semántico del distintivo
    const badgeColor =
        evaluation.status === "Publicada"
            ? "#2e7d32" // Verde
            : evaluation.status === "Pendiente"
                ? "#ed6c02" // Naranja
                : "#0288d1"; // Azul

    return `
    <article class="evaluation-card" style="border: 1px solid #e0e0e0; padding: 18px; margin-bottom: 14px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #1a237e;">${evaluation.subject}</h3>
        <span style="background-color: ${badgeColor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">
          ${evaluation.status}
        </span>
      </header>
      <div style="font-size: 0.95em; color: #424242;">
        <p style="margin: 4px 0;"><strong>Copias solicitadas:</strong> ${evaluation.copies}</p>
        <p style="margin: 4px 0;"><strong>Fecha del Examen:</strong> ${evaluation.examDate}</p>
      </div>
    </article>
  `;
}

/**
 * Función Contenedora: Limpia y renderiza la lista de evaluaciones en el DOM de forma segura.
 */
export function renderEvaluationList(container: HTMLElement, evaluations: Evaluation[]): void {
    if (evaluations.length === 0) {
        container.innerHTML = `
      <p style="text-align: center; color: #757575; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        No se encontraron evaluaciones que coincidan con los criterios.
      </p>
    `;
        return;
    }

    const cardsHtml = evaluations.map((item) => createEvaluationCard(item)).join("");
    container.innerHTML = cardsHtml;
}
