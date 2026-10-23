import { FC, useState, useEffect, useMemo } from 'react';
import {
  CalendarEvent,
  CalendarEventOccurrence,
  DEFAULT_TAGS,
  PRESET_EVENT_STYLES,
  RecurrenceType,
} from '../models/Calendar/CalendarModels';
import { CalendarDataAccess } from '../dataAccess/CalendarDataAccess';
import './InteractiveCalendar.scss';

export const InteractiveCalendar: FC = () => {
  // Calendar always displays the current month as requested
  const [currentDate] = useState<Date>(() => new Date(2026, 9, 23)); // Octubre 2026 (or new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string>('Sincronizando con Firebase...');

  // Modals state
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showFollowModal, setShowFollowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');
  const [formTime, setFormTime] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('PAC');
  const [formCategory, setFormCategory] = useState<string>('CAMPAÑA');
  const [formStyleId, setFormStyleId] = useState<string>('elixir_gradient');
  const [formCustomColor, setFormCustomColor] = useState<string>('');
  const [formRecurrence, setFormRecurrence] = useState<RecurrenceType>('NONE');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Subscribe to Firebase RTDB on mount
  useEffect(() => {
    setIsSyncing(true);
    const unsubscribe = CalendarDataAccess.SubscribeEvents(
      (loadedEvents) => {
        setEvents(loadedEvents);
        setIsSyncing(false);
        setSyncStatus('Sincronizado en tiempo real');
      },
      (errorMsg) => {
        setIsSyncing(false);
        setSyncStatus(`Offline (${errorMsg})`);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed: 9 = Octubre

  // Month name formatting in Spanish (e.g. "Octubre 2026")
  const monthTitle = useMemo(() => {
    const rawMonth = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(currentDate);
    const capitalized = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    return `${capitalized} ${currentYear}`;
  }, [currentDate, currentYear]);

  // Compute calendar grid days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDayIndex = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: Array<{
      dayNumber: number | null;
      dateString: string | null;
      isCurrentMonth: boolean;
    }> = [];

    // Empty padding slots before 1st day of month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push({ dayNumber: null, dateString: null, isCurrentMonth: false });
    }

    // Days of current month (1..31)
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({ dayNumber: d, dateString, isCurrentMonth: true });
    }

    // Padding at end to complete full rows of 7
    while (days.length % 7 !== 0) {
      days.push({ dayNumber: null, dateString: null, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Expand recurring events across the month
  const occurrencesByDate = useMemo(() => {
    const map = new Map<string, CalendarEventOccurrence[]>();

    events.forEach((evt) => {
      const baseParts = evt.date.split('-');
      if (baseParts.length !== 3) return;
      const baseYear = parseInt(baseParts[0], 10);
      const baseMonth = parseInt(baseParts[1], 10) - 1;
      const baseDay = parseInt(baseParts[2], 10);
      const baseEventDate = new Date(baseYear, baseMonth, baseDay);
      const baseWeekday = baseEventDate.getDay();

      if (evt.recurrence === 'NONE') {
        // Single occurrence
        const list = map.get(evt.date) || [];
        list.push({ event: evt, instanceDate: evt.date, isRecurringInstance: false });
        map.set(evt.date, list);
        return;
      }

      // Compute occurrences for all days of this month
      const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      for (let d = 1; d <= totalDaysInMonth; d++) {
        const checkDate = new Date(currentYear, currentMonth, d);
        if (checkDate < baseEventDate) continue; // Do not expand before event creation start date

        const checkWeekday = checkDate.getDay();
        if (checkWeekday !== baseWeekday) continue;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        if (evt.recurrence === 'WEEKLY') {
          const list = map.get(dateStr) || [];
          list.push({ event: evt, instanceDate: dateStr, isRecurringInstance: dateStr !== evt.date });
          map.set(dateStr, list);
        } else if (evt.recurrence === 'BIWEEKLY') {
          // Difference in days must be divisible by 14
          const diffMs = checkDate.getTime() - baseEventDate.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays % 14 === 0) {
            const list = map.get(dateStr) || [];
            list.push({ event: evt, instanceDate: dateStr, isRecurringInstance: dateStr !== evt.date });
            map.set(dateStr, list);
          }
        } else if (evt.recurrence === 'MONTHLY') {
          if (d === baseDay) {
            const list = map.get(dateStr) || [];
            list.push({ event: evt, instanceDate: dateStr, isRecurringInstance: dateStr !== evt.date });
            map.set(dateStr, list);
          }
        }
      }
    });

    return map;
  }, [events, currentYear, currentMonth]);

  // Open modal to create a new event
  const handleOpenCreateModal = (targetDate?: string) => {
    setSelectedEvent(null);
    setFormTitle('');
    const defaultDate =
      targetDate ||
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    setFormDate(defaultDate);
    setFormTime('20:00');
    setFormAuthor('PAC');
    setFormCategory('CAMPAÑA');
    setFormStyleId('elixir_gradient');
    setFormCustomColor('');
    setFormRecurrence('NONE');
    setFormDesc('');
    setFormError('');
    setShowEventModal(true);
  };

  // Open modal to edit an existing event
  const handleOpenEditModal = (occurrence: CalendarEventOccurrence) => {
    const evt = occurrence.event;
    setSelectedEvent(evt);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormTime(evt.time || '20:00');
    setFormAuthor(evt.authorTag || 'LUISMI');
    setFormCategory(evt.categoryTag || 'CAMPAÑA');

    // Match style preset or custom
    const matchedPreset = PRESET_EVENT_STYLES.find((p) => p.background === evt.colorVariant);
    if (matchedPreset) {
      setFormStyleId(matchedPreset.id);
      setFormCustomColor('');
    } else {
      setFormStyleId('custom');
      setFormCustomColor(evt.colorVariant);
    }

    setFormRecurrence(evt.recurrence);
    setFormDesc(evt.description || '');
    setFormError('');
    setShowEventModal(true);
  };

  // Save (Create or Update) event
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('El título del evento es obligatorio.');
      return;
    }
    if (!formDate.trim()) {
      setFormError('La fecha del evento es obligatoria.');
      return;
    }
    if (!formTime.trim()) {
      setFormError('La hora del evento es estrictamente obligatoria.');
      return;
    }

    // Determine color
    let colorVariant = '#38b6ff';
    let textColor = '#000000';
    if (formStyleId === 'custom' && formCustomColor) {
      colorVariant = formCustomColor;
      textColor = '#ffffff';
    } else {
      const preset = PRESET_EVENT_STYLES.find((p) => p.id === formStyleId);
      if (preset) {
        colorVariant = preset.background;
        textColor = preset.textColor;
      }
    }

    setIsSubmitting(true);
    setFormError('');

    const eventPayload: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      date: formDate,
      time: formTime.trim(),
      authorTag: formAuthor,
      categoryTag: formCategory,
      colorVariant,
      textColor,
      recurrence: formRecurrence,
      description: formDesc.trim(),
    };

    const res = await CalendarDataAccess.SaveEvent(eventPayload);
    setIsSubmitting(false);

    if (res.CodeNumber === 200) {
      setShowEventModal(false);
    } else {
      setFormError(res.Message || 'Error al guardar el evento');
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el evento "${selectedEvent.title}"?`);
    if (!confirmDelete) return;

    setIsSubmitting(true);
    const res = await CalendarDataAccess.DeleteEvent(selectedEvent.id);
    setIsSubmitting(false);

    if (res.CodeNumber === 200) {
      setShowEventModal(false);
    } else {
      setFormError(res.Message || 'Error al eliminar el evento');
    }
  };

  // Download .ICS calendar file for Google Calendar import
  const handleDownloadIcs = () => {
    const icsContent = CalendarDataAccess.GenerateIcsCalendar(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `multiverse-calendario-${currentYear}-${currentMonth + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const weekdays = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

  return (
    <div className="interactive-calendar-wrapper">
      {/* ---------------- 1. HEADER & LEGEND BAR ---------------- */}
      <div className="calendar-top-section">
        <div className="title-and-sync">
          <h2 className="calendar-month-heading">{monthTitle}</h2>
          <div className="calendar-sync-indicator" title="Estado de conexión con Firebase">
            <span className={`sync-dot ${isSyncing ? 'pulse' : 'online'}`} />
            <span className="sync-text">{syncStatus}</span>
          </div>
        </div>

        {/* Legend pills matching the user's manual design */}
        <div className="calendar-legend-container">
          <div className="legend-row types-row">
            {DEFAULT_TAGS.filter((t) => t.category === 'TYPE').map((tag) => (
              <span
                key={tag.id}
                className="legend-pill"
                style={{ background: tag.color, color: tag.textColor }}
              >
                {tag.label}
              </span>
            ))}
          </div>
          <div className="legend-row authors-row">
            {DEFAULT_TAGS.filter((t) => t.category === 'AUTHOR').map((tag) => (
              <span
                key={tag.id}
                className="legend-pill"
                style={{ background: tag.color, color: tag.textColor }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Actions bar */}
        <div className="calendar-action-toolbar">
          <button
            type="button"
            className="btn-calendar-add"
            onClick={() => handleOpenCreateModal()}
            title="Añadir nueva sesión o evento al calendario compartido"
          >
            <i className="fas fa-plus-circle me-1" />
            + Nuevo Evento
          </button>

          <button
            type="button"
            className="btn-calendar-google"
            onClick={() => setShowFollowModal(true)}
            title="Sincronizar y seguir este calendario en Google Calendar"
          >
            <i className="fab fa-google me-1" />
            Seguir calendario
          </button>
        </div>
      </div>

      {/* ---------------- 2. CALENDAR MONTH GRID ---------------- */}
      <div className="calendar-grid-card">
        {/* Days of the week header */}
        <div className="calendar-weekdays-row">
          {weekdays.map((day) => (
            <div key={day} className="calendar-weekday-header">
              {day}
            </div>
          ))}
        </div>

        {/* Month days cells */}
        <div className="calendar-days-grid">
          {calendarDays.map((cell, index) => {
            if (!cell.isCurrentMonth || !cell.dateString) {
              return <div key={`empty-${index}`} className="calendar-cell cell-empty" />;
            }

            const dayOccurrences = occurrencesByDate.get(cell.dateString) || [];
            const isToday =
              cell.dayNumber === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear();

            return (
              <div
                key={cell.dateString}
                className={`calendar-cell cell-active ${isToday ? 'cell-today' : ''}`}
                onClick={(e) => {
                  // Only open if clicked directly on cell background
                  if (e.target === e.currentTarget) {
                    handleOpenCreateModal(cell.dateString!);
                  }
                }}
              >
                <div className="cell-top-bar">
                  <span className="day-number">{cell.dayNumber}</span>
                  <button
                    type="button"
                    className="btn-cell-quick-add"
                    title={`Añadir evento el ${cell.dayNumber} de ${monthTitle}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCreateModal(cell.dateString!);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Event pills on this day */}
                <div className="cell-events-list">
                  {dayOccurrences.map((occ, occIdx) => {
                    const evt = occ.event;
                    return (
                      <div
                        key={`${evt.id}-${occIdx}`}
                        className="calendar-event-pill"
                        style={{
                          background: evt.colorVariant,
                          color: evt.textColor || '#000000',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(occ);
                        }}
                        title={`${evt.title} (${evt.time}) - Organiza: ${evt.authorTag}${
                          evt.recurrence !== 'NONE' ? ' [Recurrente]' : ''
                        }`}
                      >
                        <span className="pill-time-badge">{evt.time}</span>
                        <span className="pill-title-text">{evt.title}</span>
                        {evt.recurrence !== 'NONE' && (
                          <i className="fas fa-redo-alt pill-recurring-icon ms-1" title="Evento recurrente" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- 3. CREATE / EDIT EVENT MODAL ---------------- */}
      {showEventModal && (
        <div className="calendar-modal-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="calendar-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-cyber">
              <h3>
                <i className={selectedEvent ? 'fas fa-edit me-2' : 'fas fa-calendar-plus me-2'} />
                {selectedEvent ? 'Modificar Evento' : 'Crear Evento en el Calendario'}
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowEventModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="modal-form-cyber">
              {formError && (
                <div className="form-error-alert" role="alert">
                  <i className="fas fa-exclamation-circle me-1" />
                  {formError}
                </div>
              )}

              {/* Event Title */}
              <div className="form-row">
                <label>
                  Título del Evento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ELIXIR, RE:VEIL, Pokémon: Neo Frontier..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              {/* Date and Mandatory Time */}
              <div className="form-grid-2">
                <div className="form-row">
                  <label>
                    Fecha <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>
                    Hora de Inicio / Duración <span className="text-danger">* (Obligatorio)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 19:30 o 20:00 - 23:30"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Author & Category Selection */}
              <div className="form-grid-2">
                <div className="form-row">
                  <label>Organizador / Etiqueta de Autor</label>
                  <select value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)}>
                    {DEFAULT_TAGS.filter((t) => t.category === 'AUTHOR').map((tag) => (
                      <option key={tag.id} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label>Categoría</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                    <option value="CAMPAÑA">CAMPAÑA</option>
                    <option value="EVENTOS">EVENTOS</option>
                    <option value="WEAS CORTAS">WEAS CORTAS</option>
                  </select>
                </div>
              </div>

              {/* Recurrence (Google Calendar style) */}
              <div className="form-row">
                <label>
                  <i className="fas fa-sync-alt me-1 text-info" />
                  Repetición del Evento (Estilo Google Calendar)
                </label>
                <select
                  value={formRecurrence}
                  onChange={(e) => setFormRecurrence(e.target.value as RecurrenceType)}
                >
                  <option value="NONE">No se repite</option>
                  <option value="WEEKLY">Cada semana en este día</option>
                  <option value="BIWEEKLY">Cada 2 semanas (Quincenal)</option>
                  <option value="MONTHLY">Cada mes</option>
                </select>
                <small className="form-help-text">
                  Los eventos recurrentes se multiplicarán automáticamente en todos los días aplicables del mes.
                </small>
              </div>

              {/* Visual Style Selection */}
              <div className="form-row">
                <label>Estilo Visual del Pill</label>
                <div className="style-preset-selector">
                  {PRESET_EVENT_STYLES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`preset-style-btn ${formStyleId === preset.id ? 'active' : ''}`}
                      style={{ background: preset.background, color: preset.textColor }}
                      onClick={() => setFormStyleId(preset.id)}
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Description */}
              <div className="form-row">
                <label>Descripción / Detalles de la Sesión</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el arco narrativo, canal de voz o requerimientos..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-actions-bar">
                {selectedEvent && (
                  <div className="modal-left-actions">
                    <button
                      type="button"
                      className="btn-danger-cyber"
                      onClick={handleDeleteEvent}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-trash me-1" />
                      Eliminar
                    </button>
                    <a
                      href={CalendarDataAccess.GetGoogleCalendarDirectUrl(selectedEvent, formDate)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gcal-direct"
                      title="Abrir y guardar este evento en mi Google Calendar"
                    >
                      <i className="fab fa-google me-1" />
                      Añadir a Google Calendar
                    </a>
                  </div>
                )}

                <div className="modal-right-actions">
                  <button
                    type="button"
                    className="btn-cancel-cyber"
                    onClick={() => setShowEventModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit-cyber" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-1" />
                    ) : (
                      <i className="fas fa-save me-1" />
                    )}
                    {selectedEvent ? 'Guardar Cambios' : 'Registrar en Firebase'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 4. "SEGUIR CALENDARIO" GOOGLE CALENDAR MODAL ---------------- */}
      {showFollowModal && (
        <div className="calendar-modal-backdrop" onClick={() => setShowFollowModal(false)}>
          <div className="calendar-modal-container follow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-cyber">
              <h3>
                <i className="fab fa-google me-2 text-info" />
                Seguir Calendario en Google Calendar
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowFollowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="follow-modal-body">
              <p className="follow-intro">
                Mantente al día con todas las sesiones y eventos de <strong>Multiverse of Madness</strong> sincronizándolos
                directamente en tu Google Calendar en tu PC o dispositivo móvil.
              </p>

              <div className="follow-options-grid">
                {/* Option A: Download ICS */}
                <div className="follow-card">
                  <div className="card-icon-box">
                    <i className="fas fa-file-download" />
                  </div>
                  <h4>Descargar Archivo .ICS</h4>
                  <p>
                    Exporta instantáneamente todas las partidas actuales y recurrentes para importarlas en Google Calendar,
                    Apple Calendar u Outlook.
                  </p>
                  <button type="button" className="btn-action-primary" onClick={handleDownloadIcs}>
                    <i className="fas fa-download me-1" />
                    Descargar .ICS Actualizado
                  </button>
                </div>

                {/* Option B: Open Google Calendar Import */}
                <div className="follow-card">
                  <div className="card-icon-box">
                    <i className="fab fa-google" />
                  </div>
                  <h4>Abrir en Google Calendar</h4>
                  <p>
                    Abre la consola de Google Calendar para añadir el archivo descargado o suscribirte a calendarios externos.
                  </p>
                  <a
                    href="https://calendar.google.com/calendar/u/0/r/settings/export"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-action-secondary"
                  >
                    <i className="fas fa-external-link-alt me-1" />
                    Ir a Google Calendar Import
                  </a>
                </div>
              </div>

              <div className="follow-instructions-box">
                <h5>
                  <i className="fas fa-info-circle me-1 text-cyan" />
                  ¿Cómo mantenerlo sincronizado en Google Calendar?
                </h5>
                <ol>
                  <li>Descarga el archivo <code>.ics</code> con el botón de arriba.</li>
                  <li>Ve a Google Calendar &gt; Ajustes &gt; <strong>Importar y exportar</strong>.</li>
                  <li>Selecciona el archivo descargado y haz clic en <strong>Importar</strong>.</li>
                  <li>¡Listo! Todas las partidas y recordatorios con su hora obligatoria aparecerán en tu calendario.</li>
                </ol>
              </div>
            </div>

            <div className="modal-actions-bar justify-content-end">
              <button
                type="button"
                className="btn-cancel-cyber"
                onClick={() => setShowFollowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
