'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminLang } from '../AdminLangProvider';

export interface DbEvent {
  id: string;
  nameFr: string;
  nameEn: string;
  date: string;
  descriptionFr: string;
  descriptionEn: string;
  shortDescFr: string;
  shortDescEn: string;
  images: string[];
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] text-sm transition-colors';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5';

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-[#dc2626] ml-0.5">*</span>
      <span className="sr-only">(required)</span>
    </>
  );
}

export default function EventsClient({ events: initial }: { events: DbEvent[] }) {
  const router = useRouter();
  const { t, lang } = useAdminLang();
  const tr = t.events;

  const [events, setEvents] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [addingPhotosTo, setAddingPhotosTo] = useState<string | null>(null);

  const isError = (s: string) => s.toLowerCase().includes('erreur') || s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/events', { method: 'POST', body: formData });
      if (res.ok) {
        setStatus(tr.successCreate);
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || tr.errorCreate);
      }
    } catch {
      setStatus(tr.errorConnection);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhotos = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}/images`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setStatus(`${data.added} photo(s) ajoutée(s) !`);
        setAddingPhotosTo(null);
        router.refresh();
      } else {
        setStatus(tr.errorUpload);
      }
    } catch {
      setStatus(tr.errorConnection);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${lang === 'fr' ? `Supprimer l'événement « ${name} » et toutes ses photos ? Cette action est irréversible.` : `Delete event "${name}" and all its photos? This cannot be undone.`}`)) return;
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        setStatus(tr.successDelete);
      } else {
        setStatus(tr.errorDelete);
      }
    } catch {
      setStatus(tr.errorConnection);
    }
  };

  return (
    <main id="main-content" className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">{tr.eyebrow}</p>
          <h1 className="text-2xl font-black text-gray-900">{tr.title}</h1>
          <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
        >
          {showForm ? tr.cancel : tr.addButton}
        </button>
      </div>

      {status && (
        <div role="alert" aria-live="polite" className={`mb-6 px-4 py-3 rounded-sm text-sm border ${isError(status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {status}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-4">{tr.formTitle}</p>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nameFr" className={labelCls}>{tr.nameFr}<RequiredMark /></label>
                <input id="nameFr" name="nameFr" required aria-required="true" className={inputCls} placeholder="e.g. Formation en leadership" />
              </div>
              <div>
                <label htmlFor="nameEn" className={labelCls}>{tr.nameEn}</label>
                <input id="nameEn" name="nameEn" className={inputCls} placeholder="e.g. Leadership Training" />
              </div>
            </div>
            <div className="max-w-xs">
              <label htmlFor="eventDate" className={labelCls}>{tr.date}<RequiredMark /></label>
              <input id="eventDate" name="date" type="date" required aria-required="true" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="descriptionFr" className={labelCls}>{tr.descFr}</label>
                <textarea id="descriptionFr" name="descriptionFr" rows={3} className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label htmlFor="descriptionEn" className={labelCls}>{tr.descEn}</label>
                <textarea id="descriptionEn" name="descriptionEn" rows={3} className={inputCls + ' resize-none'} />
              </div>
            </div>
            <div>
              <label htmlFor="eventImages" className={labelCls}>{tr.photos}</label>
              <input id="eventImages" name="images" type="file" multiple accept="image/*" className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm" />
              <p className="text-xs text-gray-400 mt-1">{tr.photosHint}</p>
            </div>
            <div className="pt-1">
              <button type="submit" disabled={saving} className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2">
                {saving ? tr.creating : tr.createButton}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2" role="list" aria-label={tr.title}>
        {events.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
            <p className="text-gray-400 text-sm">{tr.empty}</p>
          </div>
        )}
        {events.map(event => {
          const displayDate = new Date(event.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const coverImage = event.images[0] ?? null;

          return (
            <div key={event.id} role="listitem" className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-[#dc2626] transition-colors">
              <div className="p-4 flex items-center gap-4">
                <Link href={`/admin/events/${event.id}`} className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm">
                  {coverImage ? (
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-gray-100">
                      <Image src={coverImage} alt="" role="presentation" fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-sm bg-gray-100 flex items-center justify-center" aria-hidden="true">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/events/${event.id}`} className="group focus-visible:outline-none">
                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#dc2626] transition-colors">{event.nameFr}</h3>
                    {event.nameEn && event.nameEn !== event.nameFr && (
                      <p className="text-gray-400 text-xs truncate">{event.nameEn}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-0.5">
                      {displayDate}<span className="text-gray-300 mx-1.5">·</span>{tr.photo(event.images.length)}
                    </p>
                  </Link>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAddingPhotosTo(addingPhotosTo === event.id ? null : event.id)}
                    aria-label={`${tr.addPhotos} — ${event.nameFr}`}
                    aria-expanded={addingPhotosTo === event.id}
                    className="text-xs font-bold uppercase tracking-wider px-3 py-2 border border-gray-200 hover:border-[#dc2626] text-gray-500 hover:text-[#dc2626] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                  >
                    {tr.addPhotos}
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.nameFr)}
                    aria-label={`${tr.deleteButton} — ${event.nameFr}`}
                    className="text-xs font-bold uppercase tracking-wider px-3 py-2 border border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-600 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                  >
                    {tr.deleteButton}
                  </button>
                </div>
              </div>

              {addingPhotosTo === event.id && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <form onSubmit={e => handleAddPhotos(e, event.id)} className="flex items-center gap-3">
                    <label htmlFor={`photos-${event.id}`} className="sr-only">
                      {tr.photos} — {event.nameFr}
                    </label>
                    <input id={`photos-${event.id}`} name="images" type="file" multiple accept="image/*" required className="flex-1 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-xs file:font-bold file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-[#b91c1c]" />
                    <button type="submit" disabled={saving} className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-200 text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2">
                      {saving ? tr.uploading : tr.uploadButton}
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
