import type { Evaluation, EvaluationStatus } from "./models/Evaluation";
import { renderEvaluationList } from "./components/EvaluationCard";
import './style.css';
import './styles/page.css';

/**
 * @fileoverview Punto de entrada principal (Entry Point) para la aplicación Frontend.
 * Maneja el estado global simulado, el ciclo de vida de la UI, la inyección del HTML base,
 * y la delegación de eventos del DOM utilizando TypeScript estricto.
 */

// ============================================================================
// 1. SERVICIOS DE DATOS (FETCH API)
// ============================================================================
/**
 * Realiza una petición HTTP GET asíncrona para obtener las evaluaciones
 * desde el archivo estático JSON servido por Vite.
 * @returns {Promise<Evaluation[]>} Promesa que resuelve a un arreglo de Evaluaciones.
 */
async function fetchEvaluations(): Promise<Evaluation[]> {
  try {
    console.info("[API] Obteniendo evaluaciones desde /api/evaluations.json...");
    
    // Simulación de latencia de red para apreciar el estado de carga (opcional)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = await fetch('/api/evaluations.json');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data: Evaluation[] = await response.json();
    return data;
  } catch (error) {
    console.error("[API Error] Fallo en la conexión con el servidor:", error);
    return [];
  }
}

// ============================================================================
// 3. INICIALIZACIÓN Y RENDERIZADO DEL DASHBOARD
// ============================================================================
/**
 * Función principal asíncrona que orquesta el montaje de la interfaz.
 * Construye el layout base, inyecta componentes, establece listeners y
 * gestiona el flujo de datos.
 */
async function initializeDashboard(): Promise<void> {
  const appContainer = document.getElementById("app");

  // Validación de seguridad (Null-check) para el contenedor raíz
  if (!appContainer) {
    console.error("Error Crítico: El elemento '#app' no existe en el DOM.");
    return;
  }

  // 3.1. Inyección de Layout Base (Glassmorphism & Modern UI)
  appContainer.innerHTML = `
    <div class="app-container glass-container fade-in">
      <header class="dashboard-header">
        <div class="header-title">
          <h1>Gestión de Evaluaciones</h1>
          <p>Control unificado de pruebas académicas e instrumentos de medición</p>
        </div>
        
        <!-- Panel de Filtrado y Búsqueda -->
        <div class="filters-container glass-panel">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="search-input" 
              class="search-input"
              placeholder="Buscar por asignatura..." 
              autocomplete="off"
            />
          </div>
          <select id="status-filter" class="status-filter custom-select">
            <option value="TODAS">Todos los Estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Publicada">Publicadas</option>
            <option value="Completa">Completas</option>
          </select>
        </div>
      </header>

      <div class="dashboard-grid">
        <!-- Panel Lateral: Formulario de Registro -->
        <aside class="sidebar-section slide-in-left">
          <section class="form-section glass-panel">
            <h2>Nueva Evaluación</h2>
            <p class="section-desc">Ingresa los datos para registrar un nuevo instrumento.</p>
            <form id="add-evaluation-form" class="academic-form" novalidate>
              <div class="form-group">
                <label for="subject">Asignatura</label>
                <input type="text" id="subject" name="subject" placeholder="Ej. Cálculo Avanzado" required />
              </div>
              <div class="form-group">
                <label for="copies">Número de Copias</label>
                <input type="number" id="copies" name="copies" min="1" placeholder="Ej. 40" required />
              </div>
              <div class="form-group">
                <label for="examDate">Fecha del Examen</label>
                <input type="date" id="examDate" name="examDate" required />
              </div>
              <div class="form-group">
                <label for="status">Estado Inicial</label>
                <select id="status" name="status" class="custom-select">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Publicada">Publicada</option>
                  <option value="Completa">Completa</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">
                <span>Registrar Evaluación</span>
                <span class="btn-icon">→</span>
              </button>
              <div id="form-error" class="form-error"></div>
            </form>
          </section>
        </aside>

        <!-- Área Principal: Lista de Evaluaciones -->
        <main class="main-content slide-in-right">
          <div id="evaluations-list" class="evaluations-list"></div>
        </main>
      </div>
    </div>
  `;

  // 3.2. Extracción de Referencias a Elementos del DOM
  const listContainer = document.getElementById("evaluations-list");
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  const statusFilter = document.getElementById("status-filter") as HTMLSelectElement | null;
  const addEvaluationForm = document.getElementById("add-evaluation-form") as HTMLFormElement | null;
  const formError = document.getElementById("form-error") as HTMLDivElement | null;

  if (!listContainer) return;

  // 3.3. Manejo de Estado de Carga (Loading UI)
  listContainer.innerHTML = `
    <div class="loading-state glass-panel">
      <div class="spinner"></div>
      <p>Sincronizando con el servidor...</p>
    </div>
  `;

  // 3.4. Petición Asíncrona de Datos
  const data = await fetchEvaluations();

  // 3.5. Renderizado Inicial
  renderEvaluationList(listContainer, data);

  // ============================================================================
  // 4. LÓGICA DE FILTRADO REACTIVO
  // ============================================================================
  const updateFilteredList = () => {
    const searchTerm = searchInput?.value.toLowerCase().trim() || "";
    const selectedStatus = statusFilter?.value || "TODAS";

    const filtered = data.filter((item) => {
      const matchesSearch = item.subject.toLowerCase().includes(searchTerm);
      const matchesStatus = selectedStatus === "TODAS" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    renderEvaluationList(listContainer, filtered);
  };

  // Asignación de Listeners para filtrado dinámico
  searchInput?.addEventListener("input", updateFilteredList);
  statusFilter?.addEventListener("change", updateFilteredList);

  // ============================================================================
  // 5. MANEJO DEL FORMULARIO Y VALIDACIONES (DOM Seguro)
  // ============================================================================
  if (addEvaluationForm) {
    addEvaluationForm.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault(); // Previene recarga de página

      if (formError) formError.textContent = "";

      // Extracción estructurada y segura de valores
      const subjectInput = document.getElementById("subject") as HTMLInputElement;
      const copiesInput = document.getElementById("copies") as HTMLInputElement;
      const dateInput = document.getElementById("examDate") as HTMLInputElement;
      const statusSelect = document.getElementById("status") as HTMLSelectElement;

      const subject = subjectInput.value.trim();
      const copies = parseInt(copiesInput.value, 10);
      const examDate = dateInput.value;
      const status = statusSelect.value as EvaluationStatus;

      // Validación estricta de reglas de negocio
      if (!subject || !examDate) {
        if (formError) {
          formError.textContent = "⚠️ Error: Asignatura y Fecha son campos obligatorios.";
          formError.classList.add("visible");
        }
        return;
      }

      if (isNaN(copies) || copies <= 0) {
        if (formError) {
          formError.textContent = "⚠️ Error: El número de copias debe ser un entero positivo.";
          formError.classList.add("visible");
        }
        return;
      }
      
      if (formError) formError.classList.remove("visible");

      // Construcción del objeto modelo tipado
      const newEvaluation: Evaluation = {
        id: data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1,
        subject,
        copies,
        examDate,
        status
      };

      // Mutación controlada del estado y re-renderizado
      data.unshift(newEvaluation); // Añadimos al principio para visibilidad inmediata
      updateFilteredList(); 
      
      // Limpieza de inputs
      addEvaluationForm.reset();
      
      // Feedback visual opcional: podríamos agregar un toast aquí en el futuro.
    });
  }
}

// Invocación del punto de entrada
document.addEventListener("DOMContentLoaded", initializeDashboard);
