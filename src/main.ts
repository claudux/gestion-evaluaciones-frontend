import type { Evaluation, EvaluationStatus } from "./models/Evaluation";
import { renderEvaluationList } from "./components/EvaluationCard";
import './style.css';
import './styles/page.css';

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
        <div class="app-container">
          <header class="dashboard-header">
            <h1>📋 Gestión de Evaluaciones</h1>
            <p>Control y seguimiento de pruebas institucionales</p>
            
            <!-- Panel de Control e Interacción -->
            <div class="filters-container">
              <input 
                type="text" 
                id="search-input" 
                class="search-input"
                placeholder="Buscar por asignatura..." 
              />
              <select id="status-filter" class="status-filter">
                <option value="TODAS">Todos los Estados</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Publicada">Publicadas</option>
                <option value="Completa">Completas</option>
              </select>
            </div>
          </header>

          <!-- SECCIÓN DEL FORMULARIO (Sesión 5) -->
          <section class="form-section">
            <h2>📝 Registrar Nueva Evaluación</h2>
            <form id="add-evaluation-form" class="academic-form" novalidate>
              <div class="form-group">
                <label for="subject">Asignatura:</label>
                <input type="text" id="subject" name="subject" placeholder="Ej. Cálculo Avanzado" />
              </div>
              <div class="form-group">
                <label for="copies">Número de Copias:</label>
                <input type="number" id="copies" name="copies" min="1" placeholder="Ej. 40" />
              </div>
              <div class="form-group">
                <label for="examDate">Fecha del Examen:</label>
                <input type="date" id="examDate" name="examDate" />
              </div>
              <div class="form-group">
                <label for="status">Estado:</label>
                <select id="status" name="status">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Publicada">Publicada</option>
                  <option value="Completa">Completa</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">Registrar Evaluación</button>
              <div id="form-error" class="form-error"></div>
            </form>
          </section>

          <main id="evaluations-list" class="evaluations-list"></main>
        </div>
      `;

    const listContainer = document.getElementById("evaluations-list");
    const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
    const statusFilter = document.getElementById("status-filter") as HTMLSelectElement | null;

    if (listContainer !== null) {
      // 2. Estado de Carga (Loading state)
      listContainer.innerHTML = "<p class='loading-state'><em>Consultando base de datos... ⏳</em></p>";

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

      // 6. Gestión de Formularios y Eventos (Sesión 5)
      const addEvaluationForm = document.getElementById("add-evaluation-form") as HTMLFormElement | null;
      const formError = document.getElementById("form-error") as HTMLDivElement | null;

      if (addEvaluationForm !== null) {
        addEvaluationForm.addEventListener("submit", (e: SubmitEvent) => {
          // Evitamos recarga de la página
          e.preventDefault();

          if (formError !== null) formError.textContent = "";

          // Extracción Segura
          const subjectInput = document.getElementById("subject") as HTMLInputElement;
          const copiesInput = document.getElementById("copies") as HTMLInputElement;
          const dateInput = document.getElementById("examDate") as HTMLInputElement;
          const statusSelect = document.getElementById("status") as HTMLSelectElement;

          const subject = subjectInput.value.trim();
          const copies = parseInt(copiesInput.value, 10);
          const examDate = dateInput.value;
          const status = statusSelect.value as EvaluationStatus;

          // Validación Estricta
          if (!subject || !examDate) {
            if (formError) formError.textContent = "Error: Asignatura y Fecha son obligatorios.";
            return;
          }

          if (isNaN(copies) || copies <= 0) {
            if (formError) formError.textContent = "Error: El número de copias debe ser mayor a 0.";
            return;
          }

          // Creación de objeto bajo contrato de interfaz
          const newEvaluation: Evaluation = {
            id: data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1,
            subject,
            copies,
            examDate,
            status
          };

          // Actualizamos los datos en memoria y repintamos
          data.push(newEvaluation);
          updateFilteredList(); // Usamos la misma función de los filtros para re-renderizar
          
          addEvaluationForm.reset();
        });
      }
    }
  } else {
    console.error("Error Crítico: El elemento '#app' no existe en el DOM.");
  }
}

// Ejecutamos la aplicación
initializeDashboard();
