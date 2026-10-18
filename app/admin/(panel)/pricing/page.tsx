'use client';

import { useState, useEffect } from 'react';

interface SpacePrice {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  capacity: number;
  priceHalfDay: number;
  priceFullDay: number;
  priceBundle5: number;
  priceBundle10: number;
  amenities: string[];
}

const priceFields: { label: string; field: keyof SpacePrice }[] = [
  { label: 'Half-day', field: 'priceHalfDay' },
  { label: 'Full day', field: 'priceFullDay' },
  { label: 'Pack 5 sessions', field: 'priceBundle5' },
  { label: 'Pack 10 sessions', field: 'priceBundle10' },
];

export default function AdminPricingPage() {
  const [spaces, setSpaces] = useState<SpacePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/pricing').then(r => r.json()).then(setSpaces).finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof SpacePrice, value: string) => {
    setSpaces(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: field.startsWith('price') ? parseFloat(value) || 0 : value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaces),
      });
      setStatus(res.ok ? 'Prices saved!' : 'Error saving prices.');
    } catch {
      setStatus('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  const isError = (s: string) => s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  return (
    <main id="main-content" className="px-8 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">USD</p>
          <h1 className="text-2xl font-black text-gray-900">Pricing</h1>
          <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {status && (
        <div
          role="alert"
          aria-live="polite"
          className={`mb-6 px-4 py-3 rounded-sm text-sm border ${isError(status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}
        >
          {status}
        </div>
      )}

      {loading ? (
        <p role="status" className="text-gray-400 text-center py-12 text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {spaces.map(space => (
            <div key={space.id} className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-black text-gray-900">{space.nameEn}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
                  up to {space.capacity} people
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {priceFields.map(({ label, field }) => {
                  const inputId = `${space.id}-${field}`;
                  return (
                    <div key={field}>
                      <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                        {label}
                      </label>
                      <div className="relative">
                        <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">$</span>
                        <input
                          id={inputId}
                          type="number"
                          min="0"
                          step="0.5"
                          value={space[field] as number}
                          onChange={e => update(space.id, field, e.target.value)}
                          aria-label={`${space.nameEn} ${label} price in USD`}
                          className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-900 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] text-sm transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
