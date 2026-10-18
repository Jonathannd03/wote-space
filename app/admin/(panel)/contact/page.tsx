'use client';

import { useState, useEffect } from 'react';
import { useAdminLang } from '../AdminLangProvider';

interface ContactInfo {
  phone: string;
  email: string;
  addressFr: string;
  addressEn: string;
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] text-sm transition-colors';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5';

export default function AdminContactPage() {
  const { t } = useAdminLang();
  const tr = t.contact;

  const fields: { label: string; key: keyof ContactInfo; id: string; type?: string; rows?: number }[] = [
    { label: tr.phoneLabel, key: 'phone', id: 'contact-phone', type: 'tel' },
    { label: tr.emailLabel, key: 'email', id: 'contact-email', type: 'email' },
    { label: tr.addressFrLabel, key: 'addressFr', id: 'contact-addressFr', rows: 3 },
    { label: tr.addressEnLabel, key: 'addressEn', id: 'contact-addressEn', rows: 3 },
  ];

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
      setStatus(res.ok ? tr.successSave : tr.errorSave);
    } catch {
      setStatus(tr.errorConnection);
    } finally {
      setSaving(false);
    }
  };

  const isError = (s: string) => s.toLowerCase().includes('erreur') || s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  return (
    <main id="main-content" className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">{tr.eyebrow}</p>
        <h1 className="text-2xl font-black text-gray-900">{tr.title}</h1>
        <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
      </div>

      {status && (
        <div role="alert" aria-live="polite" className={`mb-6 px-4 py-3 rounded-sm text-sm border ${isError(status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {status}
        </div>
      )}

      {loading ? (
        <p role="status" className="text-gray-400 text-center py-12 text-sm">{tr.loading}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5 max-w-xl">
          {fields.map(({ label, key, id, type, rows }) => (
            <div key={key}>
              <label htmlFor={id} className={labelCls}>{label}</label>
              {rows ? (
                <textarea id={id} value={info[key]} onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))} rows={rows} className={inputCls + ' resize-none'} />
              ) : (
                <input id={id} type={type || 'text'} value={info[key]} onChange={e => setInfo(prev => ({ ...prev, [key]: e.target.value }))} className={inputCls} />
              )}
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
          >
            {saving ? tr.saving : tr.saveButton}
          </button>
        </div>
      )}
    </main>
  );
}
