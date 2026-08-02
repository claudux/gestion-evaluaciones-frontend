import type { Evaluation } from "../models/Evaluation";
import './EvaluationCard.css';

/**
 * Función Pura: Genera el marcado HTML para una sola tarjeta de evaluación.
 * Utiliza clases semánticas y BEM-like para fácil estilización.
 * @param evaluation Objeto que cumple con el contrato de la interfaz Evaluation.
 * @param index Índice de la tarjeta en la lista para calcular el retraso de stagger.
 * @returns {string} String con marcado HTML seguro.
 */
export function createEvaluationCard(evaluation: Evaluation, index: number = 0): string {
    // Asignación dinámica de clases para el distintivo (Badge) de estado
    const badgeClass =
        evaluation.status === "Publicada"
            ? "badge-published"
            : evaluation.status === "Pendiente"
                ? "badge-pending"
                : "badge-completed";

    // Determinar el marcado del botón de acción según el estado de la evaluación
    let actionButtonHtml = "";
    if (evaluation.status === "Completa") {
        actionButtonHtml = `<button class="btn-action btn-printed" disabled>Impreso</button>`;
    } else if (evaluation.status === "Publicada") {
        actionButtonHtml = `<button class="btn-action btn-print-active" data-id="${evaluation.id}">Imprimir</button>`;
    } else {
        actionButtonHtml = `<button class="btn-action btn-pending-print" disabled>Por Imprimir</button>`;
    }

    const staggerDelay = index * 40; // 40ms stagger delay por tarjeta (Emil Kowalski rule)

    return `
    <article class="evaluation-card glass-panel stagger-card" style="animation-delay: ${staggerDelay}ms;">
      <header class="card-header">
        <h3>${evaluation.subject}</h3>
        <span class="badge ${badgeClass}">
          ${evaluation.status}
        </span>
      </header>
      <div class="card-body">
        <div class="card-meta">
          <span class="meta-icon">📄</span>
          <p><strong>Copias solicitadas:</strong> ${evaluation.copies}</p>
        </div>
        <div class="card-meta">
          <span class="meta-icon">📅</span>
          <p><strong>Fecha del Examen:</strong> ${evaluation.examDate}</p>
        </div>
      </div>
      <div class="card-footer">
        ${actionButtonHtml}
      </div>
    </article>
  `;
}

/**
 * Función Contenedora: Limpia y renderiza la lista de evaluaciones en el DOM.
 * @param container Elemento del DOM donde se inyectarán las tarjetas.
 * @param evaluations Arreglo de evaluaciones a renderizar.
 */
export function renderEvaluationList(container: HTMLElement, evaluations: Evaluation[]): void {
    if (evaluations.length === 0) {
        container.innerHTML = `
      <div class="empty-state glass-panel fade-in">
        <span class="empty-icon">📭</span>
        <p>No se encontraron evaluaciones que coincidan con los criterios de búsqueda.</p>
      </div>
    `;
        return;
    }

    const cardsHtml = evaluations.map((item, index) => createEvaluationCard(item, index)).join("");
    container.innerHTML = cardsHtml;
}
