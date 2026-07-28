import type { Evaluation } from "../models/Evaluation";
import './EvaluationCard.css';

/**
 * Función Pura: Genera el marcado HTML para una sola tarjeta de evaluación.
 */
export function createEvaluationCard(evaluation: Evaluation): string {
    // Determinamos la clase CSS del distintivo
    const badgeClass =
        evaluation.status === "Publicada"
            ? "badge-published"
            : evaluation.status === "Pendiente"
                ? "badge-pending"
                : "badge-completed";

    return `
    <article class="evaluation-card">
      <header class="card-header">
        <h3>${evaluation.subject}</h3>
        <span class="badge ${badgeClass}">
          ${evaluation.status}
        </span>
      </header>
      <div class="card-body">
        <p><strong>Copias solicitadas:</strong> ${evaluation.copies}</p>
        <p><strong>Fecha del Examen:</strong> ${evaluation.examDate}</p>
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
      <p class="empty-state">
        No se encontraron evaluaciones que coincidan con los criterios.
      </p>
    `;
        return;
    }

    const cardsHtml = evaluations.map((item) => createEvaluationCard(item)).join("");
    container.innerHTML = cardsHtml;
}
