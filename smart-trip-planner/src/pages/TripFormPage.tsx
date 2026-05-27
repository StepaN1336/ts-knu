import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import type { Trip } from '../models';
import { createTrip, updateTrip, getTripById } from '../services/storageService';

interface FormState {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

const EMPTY_FORM: FormState = {
  city: '',
  country: '',
  startDate: '',
  endDate: '',
  imageUrl: '',
};

export default function TripFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const trip = getTripById(id);
      if (trip) {
        setForm({
          city: trip.city,
          country: trip.country,
          startDate: trip.startDate,
          endDate: trip.endDate,
          imageUrl: trip.imageUrl,
        });
      }
    }
  }, [id]);

  function update(field: keyof FormState, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.city.trim()) e.city = "Введіть місто";
    if (!form.country.trim()) e.country = "Введіть країну";
    if (!form.startDate) e.startDate = "Вкажіть дату початку";
    if (!form.endDate) e.endDate = "Вкажіть дату завершення";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "Дата завершення раніше початку";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(): void {
    if (!validate()) return;

    const fallbackImage = `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80`;

    if (isEdit && id) {
      updateTrip(id, {
        city: form.city.trim(),
        country: form.country.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        imageUrl: form.imageUrl.trim() || fallbackImage,
      });
      navigate(`/trip/${id}`);
    } else {
      const trip: Trip = createTrip({
        city: form.city.trim(),
        country: form.country.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        imageUrl: form.imageUrl.trim() || fallbackImage,
      });
      navigate(`/trip/${trip.id}`);
    }
  }

  const previewUrl = form.imageUrl.trim() || '';

  return (
    <main className="min-h-screen bg-sand-50 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-ocean-500 hover:text-ocean-700 font-body mt-6 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Назад
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-ocean-900 px-6 py-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {isEdit ? 'Редагувати подорож' : 'Нова подорож'}
            </h1>
            <p className="text-ocean-300 text-sm font-body mt-1">
              {isEdit ? 'Змініть деталі поїздки' : 'Розкажіть, куди вирушаєте'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* City + Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Місто *" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="напр. Токіо"
                  className={inputClass(!!errors.city)}
                />
              </Field>
              <Field label="Країна *" error={errors.country}>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  placeholder="напр. Японія"
                  className={inputClass(!!errors.country)}
                />
              </Field>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Дата початку *" error={errors.startDate}>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  className={inputClass(!!errors.startDate)}
                />
              </Field>
              <Field label="Дата завершення *" error={errors.endDate}>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => update('endDate', e.target.value)}
                  className={inputClass(!!errors.endDate)}
                />
              </Field>
            </div>

            {/* Image URL */}
            <Field label="Посилання на зображення" error={undefined}>
              <div className="relative">
                <ImageIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => { update('imageUrl', e.target.value); setImgError(false); }}
                  placeholder="https://…"
                  className={`${inputClass(false)} pl-9`}
                />
              </div>
              {previewUrl && !imgError && (
                <div className="mt-2 rounded-lg overflow-hidden h-32 bg-ocean-50">
                  <img
                    src={previewUrl}
                    alt="Попередній перегляд"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              )}
              {imgError && (
                <p className="text-xs text-orange-500 mt-1">Не вдалося завантажити зображення</p>
              )}
              <p className="text-xs text-ocean-400 mt-1 font-body">
                Залиште порожнім для автоматичного зображення.
              </p>
            </Field>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-ocean-200 text-sm font-body font-medium text-ocean-600 hover:bg-ocean-50 transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-ocean-700 hover:bg-ocean-600 text-white text-sm font-body font-semibold transition-colors shadow-sm"
            >
              {isEdit ? 'Зберегти зміни' : 'Створити подорож'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Helpers ────────────────────────────────────────────────────────

function inputClass(hasError: boolean): string {
  return `w-full px-3 py-2.5 rounded-lg border ${
    hasError ? 'border-red-300 focus:border-red-500' : 'border-ocean-200 focus:border-ocean-400'
  } focus:outline-none text-sm font-body text-ocean-900 placeholder:text-ocean-300 bg-white`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ocean-600 mb-1 font-body uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
