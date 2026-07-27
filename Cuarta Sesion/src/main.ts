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

// Estructura conceptual asíncrona simulando Fetch
async function fetchEvaluations(): Promise<Evaluation[]> {
  try {
    console.log("Simulando obtención de evaluaciones desde la base de datos... (2s)");

    // Simulación de retraso de red (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    return evaluations;
  } catch (error) {
    console.error("Fallo al conectar con el servidor de evaluaciones:", error);
    return [];
  }
}

// Función principal de inicialización asíncrona
async function initializeDashboard() {
  const appContainer = document.getElementById("app");

  if (appContainer !== null) {
    // 1. Renderizado del layout base
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

    const listContainer = document.getElementById("evaluations-list");
    const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
    const statusFilter = document.getElementById("status-filter") as HTMLSelectElement | null;

    if (listContainer !== null) {
      // 2. Estado de Carga (Loading state)
      listContainer.innerHTML = "<p style='color: #616161;'><em>Consultando base de datos... ⏳</em></p>";

      // 3. Esperamos los datos asíncronamente
      const data = await fetchEvaluations();

      // 4. Renderizamos una vez que llegan los datos
      renderEvaluationList(listContainer, data);

      // 5. Configuración de Filtros (ahora usan 'data')
      const updateFilteredList = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedStatus = statusFilter ? statusFilter.value : "TODAS";

        const filtered = data.filter((item) => {
          const matchesSearch = item.subject.toLowerCase().includes(searchTerm);
          const matchesStatus = selectedStatus === "TODAS" || item.status === selectedStatus;
          return matchesSearch && matchesStatus;
        });

        renderEvaluationList(listContainer, filtered);
      };

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
}

// Ejecutamos la aplicación
initializeDashboard();
