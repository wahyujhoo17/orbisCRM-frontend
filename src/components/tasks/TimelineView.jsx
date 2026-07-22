import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MoreVertical, Clock, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/* ─────── Priority colours ─────── */
const priorityBar = {
  Urgent: 'bg-rose-500',
  High:   'bg-orange-400',
  Normal: 'bg-indigo-500',
  Low:    'bg-emerald-500',
};

/* ─────── Base column widths per zoom level ─────── */
const BASE_COL = { Hours: 48, Days: 64, Months: 120 };
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 3.0;
const ZOOM_STEP = 0.15;

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function TimelineView({ tasks, setTasks }) {
  const [viewMode, setViewMode] = useState('Days');
  const [zoomLevel, setZoomLevel] = useState(1);       // multiplier
  const bodyRef  = useRef(null);
  const headRef  = useRef(null);

  // Interaction refs
  const dragRef = useRef({ type: null, taskId: null, startX: 0, origStart: 0, origDur: 0 });

  const colPx = Math.round(BASE_COL[viewMode] * zoomLevel);

  /* ── Zoom helpers ── */
  const zoomIn  = () => setZoomLevel(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoomLevel(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const zoomReset = () => setZoomLevel(1);

  /* ── Mouse-wheel zoom (Ctrl/Cmd + scroll) ── */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  /* ── Sync header scroll with body ── */
  const onBodyScroll = useCallback(() => {
    if (headRef.current && bodyRef.current) {
      headRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  }, []);

  /* ── Drag-to-pan state ── */
  const pan = useRef({ active: false, startX: 0, scrollL: 0 });
  const onPanDown = (e) => {
    if (e.target.closest('[data-card]')) return;
    pan.current = { active: true, startX: e.pageX, scrollL: bodyRef.current.scrollLeft };
  };
  const onPanMove = (e) => {
    if (!pan.current.active) return;
    e.preventDefault();
    bodyRef.current.scrollLeft = pan.current.scrollL - (e.pageX - pan.current.startX) * 1.4;
  };
  const onPanUp = () => { pan.current.active = false; };

  /* ═══════ TIMELINE DATA GENERATION ═══════ */
  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate(), hour: d.getHours(), min: d.getMinutes() };
  }, []);

  const { groups, totalCols, todayColIndex } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let groups = [];
    let todayColIndex = 0;
    let runningCols = 0;

    if (viewMode === 'Hours') {
      for (let d = -1; d <= 5; d++) {
        const date = new Date(now);
        date.setDate(now.getDate() + d);
        const isToday = d === 0;
        const dayLabel = `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`;
        const subCols = [];
        for (let h = 0; h < 24; h++) {
          if (isToday && h === today.hour) todayColIndex = runningCols;
          subCols.push({
            label: `${h.toString().padStart(2, '0')}:00`,
            isToday: isToday && h === today.hour,
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
          });
          runningCols++;
        }
        groups.push({ label: dayLabel, colSpan: 24, subCols, isToday });
      }
    } else if (viewMode === 'Days') {
      let currentGroup = null;
      for (let d = -14; d <= 45; d++) {
        const date = new Date(now);
        date.setDate(now.getDate() + d);
        const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const isToday = d === 0;
        const sub = {
          label: date.getDate().toString(),
          subLabel: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
          isToday,
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
        };
        if (isToday) todayColIndex = runningCols;
        if (!currentGroup || currentGroup.label !== monthLabel) {
          if (currentGroup) groups.push(currentGroup);
          currentGroup = { label: monthLabel, colSpan: 0, subCols: [], isToday: false };
        }
        currentGroup.subCols.push(sub);
        currentGroup.colSpan++;
        if (isToday) currentGroup.isToday = true;
        runningCols++;
      }
      if (currentGroup) groups.push(currentGroup);
    } else {
      for (let y = -1; y <= 1; y++) {
        const year = today.year + y;
        const subCols = [];
        for (let m = 0; m < 12; m++) {
          const isToday = year === today.year && m === today.month;
          if (isToday) todayColIndex = runningCols;
          subCols.push({
            label: new Date(year, m, 1).toLocaleDateString('en-US', { month: 'short' }),
            isToday,
            isWeekend: false,
          });
          runningCols++;
        }
        groups.push({ label: year.toString(), colSpan: 12, subCols, isToday: year === today.year });
      }
    }

    return { groups, totalCols: runningCols, todayColIndex };
  }, [viewMode, today]);

  const totalWidth = totalCols * colPx;

  /* ═══════ TASK POSITION MAPPING (pixel-based for smooth dragging) ═══════ */
  const [taskMeta, setTaskMeta] = useState({});

  // Recompute pixel positions when viewMode or colPx changes
  useEffect(() => {
    setTaskMeta(
      tasks.reduce((acc, task, i) => {
        let startCols, durCols;
        if (viewMode === 'Hours') {
          startCols = 24 + (i * 19) % 100;
          durCols   = [6, 10, 18, 24, 36][i % 5];
        } else if (viewMode === 'Days') {
          startCols = 5 + (i * 7) % 35;
          durCols   = [3, 5, 7, 10, 14][i % 5];
        } else {
          startCols = 6 + (i * 3) % 18;
          durCols   = [2, 3, 4, 6, 8][i % 5];
        }
        // Store as pixel values for free-form positioning
        acc[task.id] = { startPx: startCols * colPx, durPx: durCols * colPx };
        return acc;
      }, {})
    );
  }, [viewMode, colPx, tasks]);

  const taskRows = useMemo(() => {
    return tasks.map((task, i) => ({
      ...task,
      ...(taskMeta[task.id] || { startPx: 0, durPx: colPx * 4 }),
      row: i,
      isGradient: i === 2,
    }));
  }, [tasks, taskMeta, colPx]);

  /* ═══════ TASK DRAG / RESIZE HANDLERS (pixel-precise) ═══════ */
  const MIN_WIDTH_PX = 60; // minimum task width in pixels

  const onTaskDragStart = (e, taskId, type) => {
    e.stopPropagation();
    e.preventDefault();
    const meta = taskMeta[taskId];
    dragRef.current = { type, taskId, startX: e.clientX, origStartPx: meta.startPx, origDurPx: meta.durPx };
    document.addEventListener('mousemove', onTaskDragMove);
    document.addEventListener('mouseup', onTaskDragEnd);
  };

  const onTaskDragMove = useCallback((e) => {
    const { type, taskId, startX, origStartPx, origDurPx } = dragRef.current;
    if (!type) return;
    const dx = e.clientX - startX; // raw pixel delta — no rounding!

    setTaskMeta(prev => {
      const meta = { ...prev[taskId] };
      if (type === 'move') {
        meta.startPx = Math.max(0, origStartPx + dx);
      } else if (type === 'resize-right') {
        meta.durPx = Math.max(MIN_WIDTH_PX, origDurPx + dx);
      } else if (type === 'resize-left') {
        const newStart = origStartPx + dx;
        const newDur   = origDurPx - dx;
        if (newDur >= MIN_WIDTH_PX && newStart >= 0) {
          meta.startPx = newStart;
          meta.durPx   = newDur;
        }
      }
      return { ...prev, [taskId]: meta };
    });
  }, []);

  const onTaskDragEnd = useCallback(() => {
    dragRef.current = { type: null, taskId: null, startX: 0, origStartPx: 0, origDurPx: 0 };
    document.removeEventListener('mousemove', onTaskDragMove);
    document.removeEventListener('mouseup', onTaskDragEnd);
  }, [onTaskDragMove]);

  /* ═══════ SCROLL TO TODAY on mount / mode switch ═══════ */
  useEffect(() => {
    if (!bodyRef.current) return;
    const target = todayColIndex * colPx - bodyRef.current.clientWidth / 3;
    bodyRef.current.scrollLeft = Math.max(0, target);
    if (headRef.current) headRef.current.scrollLeft = bodyRef.current.scrollLeft;
  }, [viewMode, todayColIndex, colPx]);

  /* ═══════ RENDER ═══════ */
  const contentHeight = Math.max(taskRows.length * 72 + 80, 500);

  const nowLinePx = useMemo(() => {
    if (viewMode === 'Hours') return (todayColIndex + today.min / 60) * colPx;
    if (viewMode === 'Days')  return (todayColIndex + today.hour / 24) * colPx;
    return (todayColIndex + today.date / 30) * colPx;
  }, [viewMode, todayColIndex, today, colPx]);

  const zoomPct = Math.round(zoomLevel * 100);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">

      {/* ─── TOOLBAR ─── */}
      <div className="shrink-0 px-5 py-3 flex items-center justify-between border-b border-stone-200/70 bg-white z-30">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-stone-900">Project Timeline</h2>
          <button
            onClick={() => {
              if (!bodyRef.current) return;
              const t = todayColIndex * colPx - bodyRef.current.clientWidth / 3;
              bodyRef.current.scrollTo({ left: Math.max(0, t), behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
          >
            <Clock className="w-3 h-3" />
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
            <button onClick={zoomOut} className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={zoomReset} className="px-2 py-1 text-[10px] font-bold text-stone-600 hover:bg-white rounded-md transition-all min-w-[42px] text-center" title="Reset Zoom">
              {zoomPct}%
            </button>
            <button onClick={zoomIn} className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View-mode switcher */}
          <div className="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded-lg">
            {['Hours', 'Days', 'Months'].map((mode) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setZoomLevel(1); }}
                className={`px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                  viewMode === mode
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STICKY HEADER (synced scroll) ─── */}
      <div className="shrink-0 bg-white z-20 border-b border-stone-200/60 overflow-hidden">
        <div ref={headRef} className="overflow-hidden" style={{ width: '100%' }}>
          <div style={{ width: totalWidth }} className="flex flex-col">
            {/* Row 1 – group labels */}
            <div className="flex">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className={`shrink-0 border-r border-stone-200/50 px-3 py-2 ${g.isToday ? 'bg-indigo-50/40' : 'bg-stone-50/30'}`}
                  style={{ width: g.colSpan * colPx }}
                >
                  <span className={`text-[13px] font-bold ${g.isToday ? 'text-indigo-700' : 'text-stone-800'}`}>
                    {g.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Row 2 – sub-column labels */}
            <div className="flex border-t border-stone-100">
              {groups.map((g, gi) =>
                g.subCols.map((s, si) => (
                  <div
                    key={`${gi}-${si}`}
                    className={`shrink-0 flex flex-col items-center justify-center border-r border-stone-100/60 py-1 ${
                      viewMode === 'Days' ? 'h-10' : 'h-7'
                    } ${s.isToday ? 'bg-indigo-50/60' : s.isWeekend ? 'bg-stone-50/40' : ''}`}
                    style={{ width: colPx }}
                  >
                    {s.subLabel && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${s.isToday ? 'text-indigo-600' : 'text-stone-400'}`}>
                        {s.subLabel}
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold leading-tight mt-0.5 ${s.isToday ? 'text-indigo-600' : 'text-stone-500'}`}>
                      {s.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE BODY ─── */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-auto cursor-grab active:cursor-grabbing"
        onScroll={onBodyScroll}
        onMouseDown={onPanDown}
        onMouseMove={onPanMove}
        onMouseUp={onPanUp}
        onMouseLeave={onPanUp}
      >
        <div className="relative" style={{ width: totalWidth, height: contentHeight }}>

          {/* Background grid columns */}
          <div className="absolute inset-0 flex pointer-events-none">
            {groups.map((g, gi) =>
              g.subCols.map((s, si) => (
                <div
                  key={`bg-${gi}-${si}`}
                  className={`shrink-0 border-r h-full ${
                    s.isWeekend ? 'border-stone-100/60 bg-stone-50/30' : 'border-stone-100/40'
                  }`}
                  style={{ width: colPx }}
                />
              ))
            )}
          </div>

          {/* "Now" indicator line */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ left: nowLinePx }}
          >
            <div className="absolute -top-px -translate-x-1/2 w-2.5 h-2.5 bg-indigo-500 rotate-45 rounded-[1px]" />
            <div className="absolute top-2 bottom-0 -translate-x-[0.5px] w-px bg-indigo-500/70" />
            <div className="absolute top-4 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>

          {/* Task bars */}
          <div className="relative z-10 pointer-events-none pt-4">
            {taskRows.map((task) => {
              const left   = task.startPx;
              const width  = task.durPx - 8;
              const top    = task.row * 72 + 16;

              return (
                <div
                  key={task.id}
                  data-card
                  className="absolute pointer-events-auto group/card"
                  style={{ left, width: Math.max(width, 80), top, height: 52 }}
                >
                  {/* ── LEFT RESIZE HANDLE ── */}
                  <div
                    className="absolute -left-1 top-0 bottom-0 w-3 cursor-ew-resize z-20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity"
                    onMouseDown={(e) => onTaskDragStart(e, task.id, 'resize-left')}
                  >
                    <div className="w-1 h-6 rounded-full bg-stone-400/60" />
                  </div>

                  {/* ── RIGHT RESIZE HANDLE ── */}
                  <div
                    className="absolute -right-1 top-0 bottom-0 w-3 cursor-ew-resize z-20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity"
                    onMouseDown={(e) => onTaskDragStart(e, task.id, 'resize-right')}
                  >
                    <div className="w-1 h-6 rounded-full bg-stone-400/60" />
                  </div>

                  {task.isGradient ? (
                    /* ── Gradient (feature) card ── */
                    <div
                      className="w-full h-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-300 shadow-sm hover:shadow-md transition-shadow flex items-center px-3 gap-3 overflow-hidden cursor-move"
                      onMouseDown={(e) => onTaskDragStart(e, task.id, 'move')}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-white truncate">{task.title}</span>
                        <span className="text-[10px] font-medium text-white/80 truncate">{task.projectIcon} {task.project}</span>
                      </div>
                      <div className="ml-auto shrink-0 flex items-center gap-1.5">
                        {task.users && (
                          <div className="flex -space-x-1.5">
                            {task.users.slice(0, 3).map((u, idx) => (
                              <div key={idx} className="w-5 h-5 rounded-full border-[1.5px] border-white/50 bg-white/20 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden">
                                {typeof u === 'string' && u.startsWith('+') ? u : <img src={`https://i.pravatar.cc/40?img=${task.id.charCodeAt(5) + idx}`} className="w-full h-full object-cover" alt="" />}
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          className="opacity-0 group-hover/card:opacity-100 text-white/60 hover:text-white transition-all p-0.5"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Standard card ── */
                    <div
                      className="w-full h-full rounded-lg bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex items-center overflow-hidden cursor-move relative"
                      onMouseDown={(e) => onTaskDragStart(e, task.id, 'move')}
                    >
                      <div className={`absolute left-0 top-[14px] bottom-[14px] w-[3px] rounded-r-full ${priorityBar[task.priority] || 'bg-stone-300'}`} />
                      <div className="flex-1 flex items-center justify-between pl-3.5 pr-2.5 gap-2 overflow-hidden">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-stone-900 truncate">{task.title}</span>
                          <span className="text-[10px] font-medium text-stone-500 truncate">{task.projectIcon} {task.project}</span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          {task.users && (
                            <div className="flex -space-x-1.5">
                              {task.users.slice(0, 3).map((u, idx) => (
                                <div key={idx} className="w-5 h-5 rounded-full border-[1.5px] border-white bg-stone-100 flex items-center justify-center text-[8px] font-bold text-stone-500 overflow-hidden">
                                  {typeof u === 'string' && u.startsWith('+') ? u : <img src={`https://i.pravatar.cc/40?img=${task.id.charCodeAt(5) + idx}`} className="w-full h-full object-cover" alt="" />}
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            className="opacity-0 group-hover/card:opacity-100 text-stone-400 hover:text-stone-700 transition-all p-0.5"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
