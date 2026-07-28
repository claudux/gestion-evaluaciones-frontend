import type { Evaluation, EvaluationStatus } from "./models/Evaluation";
import { renderEvaluationList } from "./components/EvaluationCard";

// Mock Data
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
  },
  {
    id: 4,
    subject: "Bases de Datos",
    copies: 40,
    examDate: "2026-08-18",
    status: "Pendiente"
  }
];

// 1. Captura del contenedor principal
const appContainer = document.getElementById("app");

// 2. Guardia de Tipo (Type Guard) contra nulos
if (appContainer !== null) {
  // Renderizado del layout base
  appContainer.innerHTML = `
    <div style="max-width: 650px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; padding: 20px;">
      <header style="margin-bottom: 24px; border-bottom: 2px solid #e0e0e0; padding-bottom: 16px;">
        <h1 style="color: #0d47a1; margin-bottom: 8px;">📋 Gestión de Evaluaciones</h1>
        <p style="color: #616161; margin: 0 0 16px 0;">Control y seguimiento de pruebas institucionales</p>
        
        <!-- Panel de Control e Interacción -->
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Buscar por asignatura..." 
            style="flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px;"
          />
          <select id="status-filter" style="padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; background: white;">
            <option value="TODAS">Todos los Estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Publicada">Publicadas</option>
            <option value="Completa">Completas</option>
          </select>
        </div>
      </header>

      <main id="evaluations-list"></main>
    </div>
  `;

  // 3. Captura segura con Aserciones de Tipo (Type Assertions)
  const listContainer = document.getElementById("evaluations-list");
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  const statusFilter = document.getElementById("status-filter") as HTMLSelectElement | null;

  // Renderizado inicial
  if (listContainer !== null) {
    renderEvaluationList(listContainer, evaluations);

    // Función auxiliar para aplicar ambos filtros
    const updateFilteredList = () => {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
      const selectedStatus = statusFilter ? statusFilter.value : "TODAS";

      const filtered = evaluations.filter((item) => {
        const matchesSearch = item.subject.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === "TODAS" || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
      });

      renderEvaluationList(listContainer, filtered);
    };

    // 4. Suscripción segura a eventos
    if (searchInput !== null) {
      searchInput.addEventListener("input", updateFilteredList);
    }

    if (statusFilter !== null) {
      statusFilter.addEventListener("change", updateFilteredList);
    }
  }
} else {
  console.error("Error Crítico: El elemento '#app' no existe en el DOM.");
}
