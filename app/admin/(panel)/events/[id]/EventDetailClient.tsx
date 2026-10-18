'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DbEventDetail } from '@/lib/admin-data';

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] text-sm transition-colors';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5';

export default function EventDetailClient({ event: initial }: { event: DbEventDetail }) {
  const router = useRouter();
  const [event, setEvent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const displayDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const isError = (s: string) => s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(event.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameFr: event.nameFr,
          nameEn: event.nameEn,
          descriptionFr: event.descriptionFr,
          descriptionEn: event.descriptionEn,
          shortDescFr: event.shortDescFr,
          shortDescEn: event.shortDescEn,
        }),
      });
      setStatus(res.ok ? 'Saved!' : 'Error saving.');
    } catch {
      setStatus('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhotos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploading(true);
    setStatus('');
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(event.id)}/images`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(`${data.added} photo(s) added!`);
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || 'Error uploading photos.');
      }
    } catch {
      setStatus('Connection error.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Remove this photo from the event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(event.id)}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });
      if (res.ok) {
        setEvent(prev => ({ ...prev, images: prev.images.filter(i => i.id !== imageId) }));
        setStatus('Photo removed.');
        if (lightbox && event.images.find(i => i.id === imageId)?.url === lightbox) {
          setLightbox(null);
        }
      } else {
        setStatus('Error removing photo.');
      }
    } catch {
      setStatus('Connection error.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm(`Delete event "${event.nameFr}" and all its photos? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(event.id)}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/events');
      } else {
        setStatus('Error deleting event.');
      }
    } catch {
      setStatus('Connection error.');
    }
  };

  return (
    <main id="main-content" className="px-8 py-8">
      {/* Back + header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#dc2626] transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Events
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">Gallery</p>
          <h1 className="text-2xl font-black text-gray-900">{event.nameFr}</h1>
          <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
          <p className="text-gray-400 text-xs mt-2">{displayDate} · {event.images.length} photo{event.images.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={handleDeleteEvent}
            className="border border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-600 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Delete Event
          </button>
        </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: edit fields */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-4">Details</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="det-nameFr">Name (French)</label>
                <input id="det-nameFr" value={event.nameFr} onChange={e => setEvent(p => ({ ...p, nameFr: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="det-nameEn">Name (English)</label>
                <input id="det-nameEn" value={event.nameEn} onChange={e => setEvent(p => ({ ...p, nameEn: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="det-descFr">Description (French)</label>
                <textarea id="det-descFr" rows={4} value={event.descriptionFr} onChange={e => setEvent(p => ({ ...p, descriptionFr: e.target.value }))} className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label className={labelCls} htmlFor="det-descEn">Description (English)</label>
                <textarea id="det-descEn" rows={4} value={event.descriptionEn} onChange={e => setEvent(p => ({ ...p, descriptionEn: e.target.value }))} className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Add photos */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-4">Add Photos</p>
            <form onSubmit={handleAddPhotos} className="space-y-3">
              <label htmlFor="upload-images" className="sr-only">Select photos to upload</label>
              <input
                id="upload-images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                required
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
              />
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-100 disabled:text-gray-400 text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
              >
                {uploading ? 'Uploading…' : 'Upload Photos'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: photo grid */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-4">
              Photos <span className="text-gray-400 normal-case tracking-normal font-normal text-xs">({event.images.length})</span>
            </p>
            {event.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No photos yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {event.images.map((img, idx) => (
                  <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setLightbox(img.url)}
                      className="w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-inset"
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <Image
                        src={img.url}
                        alt={`${event.nameFr} — photo ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      aria-label={`Remove photo ${idx + 1}`}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            aria-label="Close photo viewer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox}
              alt="Full size photo"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </main>
  );
}
