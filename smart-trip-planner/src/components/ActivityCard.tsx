import { Trash2 } from 'lucide-react';
import type { Activity } from '../models';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/helpers';

interface ActivityCardProps {
  activity: Activity;
  onDelete?: () => void;
}

export default function ActivityCard({ activity, onDelete }: ActivityCardProps) {
  return (
    <div className="group flex gap-3 bg-white rounded-xl border border-ocean-100 p-3 hover:border-ocean-200 hover:shadow-sm transition-all">
      {/* Time column */}
      <div className="flex-shrink-0 w-14 text-center">
        <span className="block text-sm font-mono font-bold text-ocean-700">{activity.time}</span>
        <span className="block text-xs text-ocean-300 mt-0.5">{activity.duration}хв</span>
      </div>

      {/* Vertical line */}
      <div className="w-px bg-sand-200 self-stretch" />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-body font-semibold text-ocean-900 text-sm leading-snug">
            {activity.name}
          </h4>
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-ocean-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-ocean-500 mt-1 line-clamp-2">{activity.description}</p>
        )}
        <span
          className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[activity.category]}`}
        >
          {CATEGORY_LABELS[activity.category]}
        </span>
      </div>
    </div>
  );
}
