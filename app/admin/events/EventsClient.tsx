'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function EventsClient({ events: initial }: { events: DbEvent[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [addingPhotosTo, setAddingPhotosTo] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/events', { method: 'POST', body: formData });
      if (res.ok) {
        setStatus('Event created successfully!');
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || 'Error creating event. Please try again.');
      }
    } catch {
      setStatus('Connection error.');
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
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}/images`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(`${data.added} photo(s) added!`);
        setAddingPhotosTo(null);
        router.refresh();
      } else {
        setStatus('Error uploading photos.');
      }
    } catch {
      setStatus('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete event "${name}" and all its photos? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        setStatus('Event deleted.');
      } else {
        setStatus('Error deleting event.');
      }
    } catch {
      setStatus('Connection error.');
    }
  };

  const isError = (s: string) => s.toLowerCase().includes('error') || s.toLowerCase().includes('connection');

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-400 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1 transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Events & Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Create events and manage their photo galleries.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {status && (
        <div className={`mb-6 px-4 py-3 rounded-md text-sm border ${isError(status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {status}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name (French) <span className="text-red-500">*</span></label>
                <input name="nameFr" required className={inputCls} placeholder="e.g. Formation en leadership" />
              </div>
              <div>
                <label className={labelCls}>Name (English)</label>
                <input name="nameEn" className={inputCls} placeholder="e.g. Leadership Training" />
              </div>
            </div>
            <div className="max-w-xs">
              <label className={labelCls}>Date <span className="text-red-500">*</span></label>
              <input name="date" type="date" required className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Description (French)</label>
                <textarea name="descriptionFr" rows={3} className={inputCls + ' resize-none'} placeholder="Brief description of the event…" />
              </div>
              <div>
                <label className={labelCls}>Description (English)</label>
                <textarea name="descriptionEn" rows={3} className={inputCls + ' resize-none'} placeholder="Brief description of the event…" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Photos</label>
              <input
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-red-700"
              />
              <p className="text-xs text-gray-400 mt-1">You can add more photos later</p>
            </div>
            <div className="pt-1">
              <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-100 disabled:text-gray-400 text-white px-5 py-2 rounded-md font-semibold text-sm transition-colors">
                {saving ? 'Creating…' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {events.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-sm">No events yet. Create your first one above.</p>
          </div>
        )}
        {events.map(event => {
          const displayDate = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const coverImage = event.images[0] ?? null;

          return (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                {coverImage ? (
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image src={coverImage} alt={event.nameFr} fill className="object-cover" sizes="56px" />
                  </div>
                ) : (
                  <div className="w-14 h-14 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center text-gray-300 text-xl">🖼️</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{event.nameFr}</h3>
                  {event.nameEn && event.nameEn !== event.nameFr && (
                    <p className="text-gray-400 text-xs truncate">{event.nameEn}</p>
                  )}
                  <p className="text-gray-400 text-sm mt-0.5">{displayDate} · {event.images.length} photo{event.images.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAddingPhotosTo(addingPhotosTo === event.id ? null : event.id)}
                    className="text-xs px-3 py-1.5 border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 rounded-md transition-colors"
                  >
                    + Photos
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.nameFr)}
                    className="text-xs px-3 py-1.5 border border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {addingPhotosTo === event.id && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <form onSubmit={e => handleAddPhotos(e, event.id)} className="flex items-center gap-3">
                    <input
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      required
                      className="flex-1 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-medium file:cursor-pointer hover:file:bg-red-700"
                    />
                    <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-100 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex-shrink-0">
                      {saving ? 'Uploading…' : 'Upload'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
