import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass } from 'lucide-react';
import type { Trip } from '../models';
import { fetchTrips, deleteTrip } from '../services/storageService';
import TripCard from '../components/TripCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id: string): void {
    deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main className="min-h-screen bg-sand-50 pt-20 pb-16">
      {/* Hero */}
      <section className="relative bg-ocean-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1600&q=60")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-sand-300/20 border border-sand-300/30 rounded-full px-4 py-1.5 mb-5">
            <Compass size={14} className="text-sand-300" />
            <span className="text-sand-200 text-xs font-body font-medium tracking-wider uppercase">
              Плануй. Подорожуй. Відкривай.
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Smart Trip Planner
          </h1>
          <p className="font-body text-ocean-200 text-lg max-w-xl mx-auto">
            Організуй свої подорожі, плануй маршрути по днях та насолоджуйся кожною пригодою.
          </p>
        </div>
      </section>

      {/* Trips section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-ocean-900">Мої подорожі</h2>
            <p className="text-sm text-ocean-400 font-body mt-0.5">
              {trips.length === 0 ? 'Ще немає подорожей' : `${trips.length} подорож${trips.length === 1 ? '' : trips.length < 5 ? 'і' : 'ей'}`}
            </p>
          </div>
          <button
            onClick={() => navigate('/new')}
            className="flex items-center gap-2 bg-ocean-700 hover:bg-ocean-600 text-white px-4 py-2.5 rounded-xl text-sm font-body font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Нова подорож
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-ocean-100" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-ocean-100 rounded w-2/3" />
                  <div className="h-3 bg-ocean-50 rounded w-1/3" />
                  <div className="h-3 bg-ocean-50 rounded w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass size={36} className="text-ocean-300" />
            </div>
            <h3 className="font-display text-xl font-bold text-ocean-700 mb-2">
              Час планувати!
            </h3>
            <p className="text-ocean-400 font-body mb-6">
              Створи свою першу подорож та почни планувати маршрут.
            </p>
            <button
              onClick={() => navigate('/new')}
              className="inline-flex items-center gap-2 bg-ocean-700 hover:bg-ocean-600 text-white px-6 py-3 rounded-xl font-body font-semibold transition-colors"
            >
              <Plus size={18} />
              Створити подорож
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
