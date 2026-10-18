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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-gray-500 hover:text-white text-sm mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">Events & Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage events added via this panel. Static events (pre-launch) are managed through the codebase.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-sm font-semibold text-sm transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {status && (
        <div className={`mb-6 px-4 py-3 rounded-sm text-sm ${status.includes('Error') || status.includes('error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
          {status}
        </div>
      )}

      {showForm && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-5">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name (French) *</label>
                <input name="nameFr" required className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm" placeholder="e.g. Formation en leadership" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name (English)</label>
                <input name="nameEn" className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm" placeholder="e.g. Leadership Training" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date *</label>
              <input name="date" type="date" required className="px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description (French)</label>
                <textarea name="descriptionFr" rows={3} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm" placeholder="Brief description of the event..." />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description (English)</label>
                <textarea name="descriptionEn" rows={3} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626] text-sm" placeholder="Brief description of the event..." />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Photos</label>
              <input name="images" type="file" multiple accept="image/*" className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-sm file:cursor-pointer hover:file:bg-[#b91c1c]" />
              <p className="text-xs text-gray-500 mt-1">You can add more photos later</p>
            </div>
            <button type="submit" disabled={saving} className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white px-6 py-2 rounded-sm font-semibold text-sm transition-colors">
              {saving ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {events.length === 0 && (
          <p className="text-gray-500 text-center py-12">No events yet. Create your first one above.</p>
        )}
        {events.map(event => {
          const date = new Date(event.date);
          const displayDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const coverImage = event.images[0] ?? null;

          return (
            <div key={event.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                {coverImage && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={coverImage}
                      alt={event.nameFr}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{event.nameFr}</h3>
                  {event.nameEn && event.nameEn !== event.nameFr && (
                    <p className="text-gray-400 text-xs truncate">{event.nameEn}</p>
                  )}
                  <p className="text-gray-500 text-sm">{displayDate} · {event.images.length} photo{event.images.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAddingPhotosTo(addingPhotosTo === event.id ? null : event.id)}
                    className="text-xs px-3 py-1.5 border border-[#2a2a2a] hover:border-[#dc2626] text-gray-300 hover:text-white rounded-sm transition-colors"
                  >
                    + Photos
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.nameFr)}
                    className="text-xs px-3 py-1.5 border border-[#2a2a2a] hover:border-red-800 text-gray-500 hover:text-red-400 rounded-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {addingPhotosTo === event.id && (
                <div className="border-t border-[#2a2a2a] px-5 py-4 bg-[#0f0f0f]">
                  <form onSubmit={e => handleAddPhotos(e, event.id)} className="flex items-center gap4">
                    <input name="images" type="file" multiple accept="image/*" required className="flex-1 text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-[#dc2626] file:text-white file:text-xs file:cursor-pointer" />
                    <button type="submit" disabled={saving} className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] text-white px-4 py-1.5 rounded-sm text-xs font-semibold transition-colors flex-shrink-0">
                      {saving ? 'Uploading...' : 'Upload'}
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
