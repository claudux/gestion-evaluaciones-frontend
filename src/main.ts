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
          <select id="sort-date" class="sort-date custom-select" style="margin-left: 10px;">
            <option value="ASC">Más recientes primero</option>
            <option value="DESC">Más antiguas primero</option>
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
                <input type="number" id="copies" name="copies" min="1" max="50" placeholder="Ej. 40" required />
              </div>
              <div class="form-group">
                <label for="examDate">Fecha del Examen</label>
                <input type="date" id="examDate" name="examDate" required />
              </div>
              <div class="form-group">
                <label>Estado Inicial</label>
                <div style="margin-top: 0.5rem;">
                  <span class="badge badge-pending">Pendiente</span>
                </div>
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


  // ============================================================================
  // 4. LÓGICA DE FILTRADO REACTIVO
  // ============================================================================
  const updateFilteredList = () => {
    const searchTerm = searchInput?.value.toLowerCase().trim() || "";
    const selectedStatus = statusFilter?.value || "TODAS";
    const sortDateSelect = document.getElementById("sort-date") as HTMLSelectElement | null;
    const sortDate = sortDateSelect?.value || "ASC";

    const filtered = data.filter((item) => {
      const matchesSearch = item.subject.toLowerCase().includes(searchTerm);
      const matchesStatus = selectedStatus === "TODAS" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.examDate).getTime();
      const dateB = new Date(b.examDate).getTime();
      return sortDate === "ASC" ? dateA - dateB : dateB - dateA;
    });

    renderEvaluationList(listContainer, filtered);
  };

  // Asignación de Listeners para filtrado dinámico
  searchInput?.addEventListener("input", updateFilteredList);
  statusFilter?.addEventListener("change", updateFilteredList);
  const sortDateSelect = document.getElementById("sort-date") as HTMLSelectElement | null;
  sortDateSelect?.addEventListener("change", updateFilteredList);

  // Delegación de eventos para la acción de impresión en las tarjetas
  listContainer.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.classList.contains("btn-print-active")) {
      const id = Number(target.getAttribute("data-id"));
      const evaluation = data.find((item) => item.id === id);
      if (evaluation) {
        evaluation.status = "Completa";
        updateFilteredList();
      }
    }
  });

  // 3.5. Renderizado Inicial con filtros aplicados
  updateFilteredList();

  // ============================================================================
  // 5. MANEJO DEL FORMULARIO Y VALIDACIONES (DOM Seguro)
  // ============================================================================
  if (addEvaluationForm) {
    const subjectInput = document.getElementById("subject") as HTMLInputElement;
    const copiesInput = document.getElementById("copies") as HTMLInputElement;
    const dateInput = document.getElementById("examDate") as HTMLInputElement;

    // Escuchar interacciones para limpiar estilos de error individualmente
    const setupInputErrorClear = (input: HTMLInputElement) => {
      const clearError = () => {
        input.classList.remove("input-error-blink");
        const hasRemainingErrors = [subjectInput, copiesInput, dateInput].some(el =>
          el.classList.contains("input-error-blink")
        );
        if (!hasRemainingErrors && formError) {
          formError.classList.remove("visible");
        }
      };
      input.addEventListener("input", clearError);
      input.addEventListener("change", clearError);
    };

    if (subjectInput && copiesInput && dateInput) {
      setupInputErrorClear(subjectInput);
      setupInputErrorClear(copiesInput);
      setupInputErrorClear(dateInput);
    }

    addEvaluationForm.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault(); // Previene recarga de página

      // Limpieza inicial de estados de error visuales
      subjectInput.classList.remove("input-error-blink");
      copiesInput.classList.remove("input-error-blink");
      dateInput.classList.remove("input-error-blink");
      if (formError) {
        formError.textContent = "";
        formError.classList.remove("visible");
      }

      // Extracción estructurada y limpia de valores
      const subject = subjectInput.value.trim();
      const copiesRaw = copiesInput.value.trim();
      const copies = parseInt(copiesRaw, 10);
      const examDate = dateInput.value;
      const status = "Pendiente" as EvaluationStatus;

      const invalidInputs: HTMLInputElement[] = [];
      const errorMessages: string[] = [];

      // 1. Validación de Asignatura (Prioridad 1)
      if (!subject) {
        invalidInputs.push(subjectInput);
        subjectInput.classList.add("input-error-blink");
        errorMessages.push("La Asignatura es requerida");
      }

      // 2. Validación del Número de Copias (Rango 1 a 50) (Prioridad 2)
      if (!copiesRaw || isNaN(copies) || copies < 1 || copies > 50) {
        invalidInputs.push(copiesInput);
        copiesInput.classList.add("input-error-blink");
        errorMessages.push("El número de copias debe estar entre 1 y 50");
      }

      // 3. Validación de Fecha del Examen (Prioridad 3)
      if (!examDate) {
        invalidInputs.push(dateInput);
        dateInput.classList.add("input-error-blink");
        errorMessages.push("La fecha del examen es requerida");
      }

      // Si se encontraron errores
      if (invalidInputs.length > 0) {
        // Enfoque automático al PRIMER campo con error
        invalidInputs[0].focus();

        if (formError) {
          formError.textContent = `⚠️ Error: ${errorMessages.join(". ")}.`;
          formError.classList.add("visible");
        }
        return;
      }

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

      // Limpieza de inputs y estados
      addEvaluationForm.reset();
    });
  }
}

// Invocación del punto de entrada
document.addEventListener("DOMContentLoaded", initializeDashboard);
