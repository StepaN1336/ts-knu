import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, CalendarDays, MapPin, Clock } from 'lucide-react';
import type { Trip, DayPlan, Activity } from '../models';
import {
  getTripById,
  getDayPlansForTrip,
  addActivityToDayPlan,
  deleteActivity,
} from '../services/storageService';
import { tripDurationDays, formatDate, generateDayDates } from '../utils/helpers';
import ActivityCard from '../components/ActivityCard';
import AddActivityModal from '../components/AddActivityModal';

interface ModalState {
  dayNumber: number;
  date: string;
}

export default function TripDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    if (!id) return;
    const t = getTripById(id);
    if (!t) { navigate('/'); return; }
    setTrip(t);
    setDayPlans(getDayPlansForTrip(id));
  }, [id, navigate]);

  if (!trip) return null;

  const duration = tripDurationDays(trip);
  const allDates = generateDayDates(trip.startDate, duration);

  function getDayPlan(dayNumber: number): DayPlan | undefined {
    return dayPlans.find((dp) => dp.dayNumber === dayNumber);
  }

  function handleAddActivity(activity: Activity): void {
    if (!modal || !id) return;
    const updated = addActivityToDayPlan(id, modal.dayNumber, modal.date, activity);
    setDayPlans((prev) => {
      const exists = prev.find((dp) => dp.id === updated.id);
      if (exists) return prev.map((dp) => dp.id === updated.id ? updated : dp);
      return [...prev, updated];
    });
    setModal(null);
  }

  function handleDeleteActivity(dayPlanId: string, activityId: string): void {
    if (!id) return;
    deleteActivity(id, dayPlanId, activityId);
    setDayPlans(getDayPlansForTrip(id));
  }

  const totalActivities = dayPlans.reduce((acc, dp) => acc + dp.activities.length, 0);

  return (
    <main className="min-h-screen bg-sand-50 pt-16 pb-16">
      {/* Hero banner */}
      <div className="relative h-56 sm:h-72 bg-ocean-900 overflow-hidden">
        <img
          src={trip.imageUrl}
          alt={trip.city}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 sm:left-6 flex items-center gap-1.5 text-sm text-white/80 hover:text-white bg-ocean-900/40 hover:bg-ocean-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft size={14} />
          Назад
        </button>

        {/* Edit button */}
        <button
          onClick={() => navigate(`/edit/${trip.id}`)}
          className="absolute top-4 right-4 sm:right-6 flex items-center gap-1.5 text-sm text-white bg-ocean-900/40 hover:bg-ocean-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
        >
          <Edit2 size={13} />
          Редагувати
        </button>

        {/* Trip info overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-5">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{trip.city}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-ocean-200 text-sm font-body">
              <MapPin size={13} /> {trip.country}
            </span>
            <span className="flex items-center gap-1 text-ocean-200 text-sm font-body">
              <CalendarDays size={13} />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
            <span className="flex items-center gap-1 text-sand-300 text-sm font-body font-semibold">
              <Clock size={13} />
              {duration} {duration === 1 ? 'день' : duration < 5 ? 'дні' : 'днів'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-ocean-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6 text-sm font-body">
          <span className="text-ocean-500">
            <span className="font-bold text-ocean-800">{totalActivities}</span>{' '}
            {totalActivities === 1 ? 'активність' : 'активностей'}
          </span>
          <span className="text-ocean-500">
            <span className="font-bold text-ocean-800">{duration}</span> днів маршруту
          </span>
        </div>
      </div>

      {/* Day plans */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {allDates.map((date, idx) => {
          const dayNumber = idx + 1;
          const dayPlan = getDayPlan(dayNumber);
          const activities = dayPlan?.activities ?? [];

          return (
            <section
              key={date}
              className="bg-white rounded-2xl shadow-sm border border-ocean-100 overflow-hidden"
            >
              {/* Day header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-ocean-100 bg-ocean-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ocean-700 rounded-lg flex items-center justify-center text-white text-sm font-bold font-mono">
                    {dayNumber}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-ocean-900 text-sm">
                      День {dayNumber}
                    </p>
                    <p className="text-xs text-ocean-400 font-body">{formatDate(date)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModal({ dayNumber, date })}
                  className="flex items-center gap-1 text-xs font-body font-semibold text-ocean-600 hover:text-ocean-900 bg-ocean-100 hover:bg-ocean-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={13} />
                  Активність
                </button>
              </div>

              {/* Activities */}
              <div className="p-4">
                {activities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-ocean-300 font-body italic">
                      Активностей ще немає — додайте першу!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...activities]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((act) => (
                        <ActivityCard
                          key={act.id}
                          activity={act}
                          onDelete={
                            dayPlan
                              ? () => handleDeleteActivity(dayPlan.id, act.id)
                              : undefined
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Add day note */}
        <p className="text-center text-xs text-ocean-300 font-body pb-4">
          Кількість днів визначається датами подорожі
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <AddActivityModal
          dayNumber={modal.dayNumber}
          date={modal.date}
          onAdd={handleAddActivity}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
