'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactInfo {
  phone: string;
  email: string;
  addressFr: string;
  addressEn: string;
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

const fields: { label: string; key: keyof ContactInfo; id: string; type?: string; rows?: number }[] = [
  { label: 'Phone number', key: 'phone', id: 'contact-phone', type: 'tel' },
  { label: 'Email address', key: 'email', id: 'contact-email', type: 'email' },
  { label: 'Address (French)', key: 'addressFr', id: 'contact-addressFr', rows: 3 },
  { label: 'Address (English)', key: 'addressEn', id: 'contact-addressEn', rows: 3 },
];

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

  const isError = (s: string) => s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  return (
    <main id="main-content" className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm mb-2 inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Contact Info</h1>
        <p className="text-gray-500 text-sm mt-1">Shown on the contact page and in the footer</p>
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

      {loading ? (
        <p role="status" className="text-gray-400 text-center py-12 text-sm">Loading…</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-5">
          {fields.map(({ label, key, id, type, rows }) => (
            <div key={key}>
              <label htmlFor={id} className={labelCls}>{label}</label>
              {rows ? (
                <textarea
                  id={id}
                  value={info[key]}
                  onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))}
                  rows={rows}
                  className={inputCls + ' resize-none'}
                />
              ) : (
                <input
                  id={id}
                  type={type || 'text'}
                  value={info[key]}
                  onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-500 text-white py-2.5 rounded-md font-semibold text-sm transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </main>
  );
}
