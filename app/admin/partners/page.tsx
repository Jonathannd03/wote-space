'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-500 hover:text-white text-sm mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-sm font-semibold text-sm transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Partner'}
        </button>
      </div>

      {status && (
        <div className={`mb-6 px-4 py-3 rounded-sm text-sm ${status.includes('Error') || status.includes('error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
          {status}
        </div>
      )}

      {showForm && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-5">Add New Partner</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Organisation Name *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm"
                placeholder="e.g. UNHCR Goma"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-sm file:cursor-pointer hover:file:bg-[#b91c1c]"
              />
              {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
            </div>
            <button type="submit" disabled={saving || !name} className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white px-6 py-2 rounded-sm font-semibold text-sm transition-colors">
              {saving ? 'Adding...' : 'Add Partner'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {partners.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-12">No partners yet.</p>
          )}
          {partners.map(partner => (
            <div key={partner.id} className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-sm p-4 flex flex-col items-center gap-3">
              {partner.logo ? (
                <div className="relative w-full h-20 bg-[#0a0a0a] rounded-sm overflow-hidden">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain p-2" sizes="200px" />
                </div>
              ) : (
                <div className="w-full h-20 bg-[#0a0a0a] rounded-sm flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">🏢</span>
                </div>
              )}
              <p className="text-white text-sm text-center font-medium leading-tight">{partner.name}</p>
              <button
                onClick={() => handleDelete(partner.id, partner.name)}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
