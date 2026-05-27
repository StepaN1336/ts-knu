import { useState } from 'react';
import { X } from 'lucide-react';
import type { Activity, ActivityCategory } from '../models';
import { CATEGORY_LABELS } from '../utils/helpers';

interface AddActivityModalProps {
  dayNumber: number;
  date: string;
  onAdd: (activity: Activity) => void;
  onClose: () => void;
}

const CATEGORIES: ActivityCategory[] = [
  'landmark', 'museum', 'restaurant', 'park',
  'shopping', 'entertainment', 'transport', 'accommodation', 'other',
];

export default function AddActivityModal({ dayNumber, date, onAdd, onClose }: AddActivityModalProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ActivityCategory>('landmark');
  const [time, setTime] = useState<string>('10:00');
  const [duration, setDuration] = useState<number>(60);
  const [error, setError] = useState<string>('');

  function handleSubmit(): void {
    if (!name.trim()) {
      setError('Введіть назву активності');
      return;
    }
    const activity: Activity = {
      id: `act-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      time,
      duration,
    };
    onAdd(activity);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-900/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ocean-100">
          <div>
            <h2 className="font-display text-lg font-bold text-ocean-900">Нова активність</h2>
            <p className="text-xs text-ocean-400 font-body mt-0.5">День {dayNumber} · {date}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ocean-50 text-ocean-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-ocean-600 mb-1 font-body uppercase tracking-wide">
              Назва *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="напр. Фонтан Треві"
              className="w-full px-3 py-2 rounded-lg border border-ocean-200 focus:border-ocean-400 focus:outline-none text-sm font-body text-ocean-900 placeholder:text-ocean-300"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ocean-600 mb-1 font-body uppercase tracking-wide">
              Опис
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Короткий опис місця або нотатки…"
              className="w-full px-3 py-2 rounded-lg border border-ocean-200 focus:border-ocean-400 focus:outline-none text-sm font-body text-ocean-900 placeholder:text-ocean-300 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ocean-600 mb-1.5 font-body uppercase tracking-wide">
              Категорія
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    category === cat
                      ? 'bg-ocean-700 text-white'
                      : 'bg-ocean-50 text-ocean-600 hover:bg-ocean-100'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ocean-600 mb-1 font-body uppercase tracking-wide">
                Час
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-ocean-200 focus:border-ocean-400 focus:outline-none text-sm font-body text-ocean-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ocean-600 mb-1 font-body uppercase tracking-wide">
                Тривалість (хв)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-ocean-200 focus:border-ocean-400 focus:outline-none text-sm font-body text-ocean-900"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-ocean-200 text-sm font-body font-medium text-ocean-600 hover:bg-ocean-50 transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-600 text-white text-sm font-body font-semibold transition-colors"
          >
            Додати
          </button>
        </div>
      </div>
    </div>
  );
}
