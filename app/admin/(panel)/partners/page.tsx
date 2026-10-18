'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] text-sm transition-colors';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/admin/partners').then(r => r.json()).then(setPartners).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    setStatus('');
    const formData = new FormData();
    formData.append('name', name);
    if (file) formData.append('logo', file);
    try {
      const res = await fetch('/api/admin/partners', { method: 'POST', body: formData });
      if (res.ok) {
        const updated = await fetch('/api/admin/partners').then(r => r.json());
        setPartners(updated);
        setName('');
        setFile(null);
        setShowForm(false);
        setStatus('Partner added!');
      } else {
        setStatus('Error adding partner.');
      }
    } catch {
      setStatus('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, partnerName: string) => {
    if (!confirm(`Remove "${partnerName}" from the partners list?`)) return;
    const res = await fetch('/api/admin/partners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPartners(prev => prev.filter(p => p.id !== id));
      setStatus('Partner removed.');
    }
  };

  const isError = (s: string) => s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  return (
    <main id="main-content" className="px-8 py-8 max-w-4xl">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">Organisations</p>
          <h1 className="text-2xl font-black text-gray-900">Partners</h1>
          <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
        >
          {showForm ? 'Cancel' : '+ Add Partner'}
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

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-4">New Partner</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="partnerName" className={labelCls}>
                Organisation Name{' '}
                <span aria-hidden="true" className="text-[#dc2626]">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="partnerName"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                aria-required="true"
                className={inputCls}
                placeholder="e.g. UNHCR Goma"
              />
            </div>
            <div>
              <label htmlFor="partnerLogo" className={labelCls}>Logo Image</label>
              <input
                id="partnerLogo"
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
              />
              {file && <p className="text-xs text-gray-400 mt-1">{file.name}</p>}
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={saving || !name}
                className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
              >
                {saving ? 'Adding…' : 'Add Partner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p role="status" className="text-gray-400 text-center py-12 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="list" aria-label="Partners">
          {partners.length === 0 && (
            <p className="text-gray-400 col-span-3 text-center py-12 text-sm">No partners yet.</p>
          )}
          {partners.map(partner => (
            <div key={partner.id} role="listitem" className="group bg-white border border-gray-200 hover:border-[#dc2626] rounded-sm p-4 flex flex-col items-center gap-3 transition-all">
              {partner.logo ? (
                <div className="relative w-full h-20 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain p-2" sizes="200px" />
                </div>
              ) : (
                <div className="w-full h-20 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              <p className="text-gray-800 text-sm text-center font-medium leading-tight">{partner.name}</p>
              <button
                onClick={() => handleDelete(partner.id, partner.name)}
                aria-label={`Remove ${partner.name}`}
                className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#dc2626] transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
