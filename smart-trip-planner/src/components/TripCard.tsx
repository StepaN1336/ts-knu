import { useNavigate } from 'react-router-dom';
import { Calendar, Edit2, Trash2, MapPin } from 'lucide-react';
import type { Trip } from '../models';
import { tripDurationDays, formatDate } from '../utils/helpers';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const navigate = useNavigate();
  const duration = tripDurationDays(trip);

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/trip/${trip.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-ocean-100">
        <img
          src={trip.imageUrl}
          alt={`${trip.city}, ${trip.country}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://source.unsplash.com/800x400/?${trip.city},travel`;
          }}
        />
        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-ocean-900/80 backdrop-blur-sm text-white text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {duration} {duration === 1 ? 'день' : duration < 5 ? 'дні' : 'днів'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold text-ocean-900 leading-tight">
              {trip.city}
            </h3>
            <p className="flex items-center gap-1 text-sm text-ocean-500 font-body mt-0.5">
              <MapPin size={12} />
              {trip.country}
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => navigate(`/edit/${trip.id}`)}
              className="p-1.5 rounded-lg hover:bg-ocean-50 text-ocean-400 hover:text-ocean-700 transition-colors"
              title="Редагувати"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={() => {
                if (confirm(`Видалити подорож до ${trip.city}?`)) onDelete(trip.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-ocean-400 hover:text-red-600 transition-colors"
              title="Видалити"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-ocean-400 font-body">
          <Calendar size={12} />
          <span>
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
        </div>
      </div>
    </article>
  );
}
