import type { Evaluation } from "./models/Evaluation";

// Datos simulados (Mock Data) fuertemente tipados
const evaluations: Evaluation[] = [
  {
    id: 1,
    subject: "Matemáticas Avanzadas",
    copies: 35,
    examDate: "2026-08-10",
    status: "Publicada"
  },
  {
    id: 2,
    subject: "Historia Universal",
    copies: 20,
    examDate: "2026-08-12",
    status: "Pendiente"
  },
  {
    id: 3,
    subject: "Programación en Java",
    copies: 50,
    examDate: "2026-07-01",
    status: "Completa"
  }
];

// Captura del contenedor
const appContainer = document.getElementById("app");

// Guardia de tipo contra valores nulos
if (appContainer !== null) {
  const cardsHtml = evaluations
    .map((item) => {
      // Color distintivo según el estado
      const badgeColor =
        item.status === "Publicada"
          ? "#2e7d32"
          : item.status === "Pendiente"
          ? "#ed6c02"
          : "#0288d1";

      return `
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 12px; background-color: #fafafa;">
          <h2 style="margin-top: 0;">${item.subject}</h2>
          <p><strong>Copias solicitadas:</strong> ${item.copies}</p>
          <p><strong>Fecha de Examen:</strong> ${item.examDate}</p>
          <p><strong>Estado:</strong> 
            <span style="background-color: ${badgeColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">
              ${item.status}
            </span>
          </p>
        </div>
      `;
    })
    .join("");

  appContainer.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
      <h1>Sistema de Gestión de Evaluaciones</h1>
      ${cardsHtml}
    </div>
  `;
} else {
  console.error("Error Crítico: El nodo con ID 'app' no existe en el DOM.");
}