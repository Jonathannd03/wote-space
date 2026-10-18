'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactInfo {
  phone: string;
  email: string;
  addressFr: string;
  addressEn: string;
}

export default function AdminContactPage() {
  const [info, setInfo] = useState<ContactInfo>({ phone: '', email: '', addressFr: '', addressEn: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/contact').then(r => r.json()).then(setInfo).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      setStatus(res.ok ? 'Contact info saved!' : 'Error saving.');
    } catch {
      setStatus('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  const fields: { label: string; key: keyof ContactInfo; type?: string; rows?: number }[] = [
    { label: 'Phone number', key: 'phone', type: 'tel' },
    { label: 'Email address', key: 'email', type: 'email' },
    { label: 'Address (French)', key: 'addressFr', rows: 3 },
    { label: 'Address (English)', key: 'addressEn', rows: 3 },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-500 hover:text-white text-sm mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">Contact Info</h1>
          <p className="text-gray-400 text-sm mt-1">Shown on the contact page and in the footer</p>
        </div>
      </div>

      {status && (
        <div className={`mb-6 px-4 py-3 rounded-sm text-sm ${status.includes('Error') || status.includes('error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
          {status}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6 space-y-5">
          {fields.map(({ label, key, type, rows }) => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1">{label}</label>
              {rows ? (
                <textarea
                  value={info[key]}
                  onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))}
                  rows={rows}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm resize-none"
                />
              ) : (
                <input
                  type={type || 'text'}
                  value={info[key]}
                  onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm"
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white py-3 rounded-sm font-semibold text-sm transition-colors mt-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
