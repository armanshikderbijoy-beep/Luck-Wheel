import React, { useState } from 'react';
import { WheelEntry, WheelThemeId } from '../types';
import { WHEEL_THEMES, PRESET_OPTIONS } from '../data/themes';
import { Plus, Trash2, Shuffle, RotateCcw, Edit2, Check, X, AlertCircle, Sparkles } from 'lucide-react';

interface EntriesManagerProps {
  entries: WheelEntry[];
  themeId: WheelThemeId;
  onAddEntry: (text: string) => void;
  onUpdateEntry: (id: string, newText: string) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onShuffle: () => void;
  onLoadPreset: (items: string[]) => void;
  disabled?: boolean;
}

export const EntriesManager: React.FC<EntriesManagerProps> = ({
  entries,
  themeId,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onClearAll,
  onShuffle,
  onLoadPreset,
  disabled = false,
}) => {
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const currentTheme = WHEEL_THEMES[themeId] || WHEEL_THEMES.vibrant;

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) return;
    onAddEntry(trimmed);
    setNewText('');
  };

  const startEdit = (entry: WheelEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      onUpdateEntry(id, trimmed);
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div id="entries-manager-card" className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Entries
          </h2>
          <span
            id="entries-count-badge"
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              entries.length >= 2
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {entries.length} {entries.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Action buttons: Shuffle & Clear */}
        <div className="flex items-center gap-1.5">
          <button
            id="shuffle-entries-btn"
            type="button"
            onClick={onShuffle}
            disabled={disabled || entries.length < 2}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Shuffle entries randomly"
            aria-label="Shuffle entries"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {confirmClear ? (
            <div className="flex items-center gap-1">
              <button
                id="confirm-clear-btn"
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium"
              >
                Clear all?
              </button>
              <button
                id="cancel-clear-btn"
                type="button"
                onClick={() => setConfirmClear(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
                aria-label="Cancel clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="clear-all-entries-btn"
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={disabled || entries.length === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Clear all entries"
              aria-label="Clear all entries"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Add Entry Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <label htmlFor="new-entry-input" className="sr-only">
          Add new entry
        </label>
        <input
          id="new-entry-input"
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter choice (e.g. Pizza, Blue, Team A)..."
          disabled={disabled}
          maxLength={60}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-50"
        />
        <button
          id="add-entry-submit-btn"
          type="submit"
          disabled={disabled || !newText.trim()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Warning/Status banner if < 2 entries */}
      {entries.length === 0 ? (
        <div id="empty-entries-alert" className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center my-auto py-8">
          <AlertCircle className="w-7 h-7 text-indigo-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            No entries on the wheel
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Type an item above to add it, or click one of the quick presets below to test.
          </p>
        </div>
      ) : entries.length === 1 ? (
        <div id="single-entry-alert" className="p-3 mb-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>At least <strong>2 entries</strong> are required to spin the wheel. Add 1 more item.</span>
        </div>
      ) : null}

      {/* Entries List */}
      {entries.length > 0 && (
        <div
          id="entries-scroll-list"
          className="flex-1 overflow-y-auto max-h-[320px] sm:max-h-[360px] space-y-2 pr-1 custom-scrollbar mb-4"
          role="list"
          aria-label="Wheel Entries List"
        >
          {entries.map((entry, index) => {
            const segmentColor = currentTheme.colors[index % currentTheme.colors.length];
            const isEditing = editingId === entry.id;

            return (
              <div
                key={entry.id}
                id={`entry-item-${entry.id}`}
                role="listitem"
                className="group flex items-center justify-between gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Segment Color Pill */}
                <span
                  className="w-3.5 h-7 rounded-md shrink-0 shadow-sm"
                  style={{ backgroundColor: segmentColor }}
                  title={`Color: ${segmentColor}`}
                />

                {/* Entry content (Editable) */}
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      id={`edit-input-${entry.id}`}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(entry.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 text-sm rounded-lg border border-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      id={`save-edit-${entry.id}`}
                      type="button"
                      onClick={() => saveEdit(entry.id)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                      aria-label="Save item"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      id={`cancel-edit-${entry.id}`}
                      type="button"
                      onClick={cancelEdit}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      aria-label="Cancel editing"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {entry.text}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`edit-btn-${entry.id}`}
                        type="button"
                        onClick={() => startEdit(entry)}
                        disabled={disabled}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={`Edit ${entry.text}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-btn-${entry.id}`}
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        disabled={disabled}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={`Delete ${entry.text}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick presets footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Presets:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.name}
              id={`preset-btn-${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => onLoadPreset(preset.items)}
              disabled={disabled}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-40"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
