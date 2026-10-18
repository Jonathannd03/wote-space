'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

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
    <main id="main-content" className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm mb-2 inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-500 text-sm mt-1">Partner organisations shown on the website.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          {showForm ? 'Cancel' : '+ Add Partner'}
        </button>
      </div>

      {status && (
        <div
          role="alert"
          aria-live="polite"
          className={`mb-6 px-4 py-3 rounded-md text-sm border ${isError(status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}
        >
          {status}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Add New Partner</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="partnerName" className={labelCls}>
                Organisation Name <span aria-hidden="true" className="text-red-500">*</span>
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
                className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              />
              {file && <p className="text-xs text-gray-400 mt-1">{file.name}</p>}
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={saving || !name}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-500 text-white px-5 py-2 rounded-md font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="list" aria-label="Partners">
          {partners.length === 0 && (
            <p className="text-gray-400 col-span-3 text-center py-12 text-sm">No partners yet.</p>
          )}
          {partners.map(partner => (
            <div key={partner.id} role="listitem" className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 flex flex-col items-center gap-3 transition-all">
              {partner.logo ? (
                <div className="relative w-full h-20 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain p-2" sizes="200px" />
                </div>
              ) : (
                <div className="w-full h-20 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center" aria-hidden="true">
                  <span className="text-gray-300 text-2xl">🏢</span>
                </div>
              )}
              <p className="text-gray-800 text-sm text-center font-medium leading-tight">{partner.name}</p>
              <button
                onClick={() => handleDelete(partner.id, partner.name)}
                aria-label={`Remove ${partner.name}`}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
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
