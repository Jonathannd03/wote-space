'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-500 hover:text-white text-sm mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">Pricing</h1>
          <p className="text-gray-400 text-sm mt-1">All prices in USD ($)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white px-5 py-2 rounded-sm font-semibold text-sm transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status && (
        <div className={`mb-6 px-4 py-3 rounded-sm text-sm ${status.includes('Error') || status.includes('error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
          {status}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="space-y-4">
          {spaces.map(space => (
            <div key={space.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-white">{space.nameEn}</h2>
                <span className="text-xs text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded-sm">up to {space.capacity} people</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Half-day', field: 'priceHalfDay' as keyof SpacePrice },
                  { label: 'Full day', field: 'priceFullDay' as keyof SpacePrice },
                  { label: 'Pack 5 sessions', field: 'priceBundle5' as keyof SpacePrice },
                  { label: 'Pack 10 sessions', field: 'priceBundle10' as keyof SpacePrice },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={space[field] as number}
                        onChange={e => update(space.id, field, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
