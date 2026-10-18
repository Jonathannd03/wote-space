import { NextResponse } from 'next/server';
import { rmSync, existsSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { getEventDescriptions, saveEventDescriptions } from '@/lib/admin-data';

const EVENTS_DIR = path.join(process.cwd(), 'public', 'events');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'events-manifest.json');

function regenerateManifest() {
  if (!existsSync(EVENTS_DIR)) return;
  const folders = readdirSync(EVENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const events = folders
    .map(folder => {
      const parts = folder.split('_');
      if (parts.length < 4) return null;
      const year = parseInt(parts[parts.length - 1]);
      const month = parseInt(parts[parts.length - 2]);
      const day = parseInt(parts[parts.length - 3]);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      const name = parts.slice(0, parts.length - 3).join(' ');
      const eventPath = path.join(EVENTS_DIR, folder);
      const imageFiles = readdirSync(eventPath)
        .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
        .sort((a, b) => parseInt(a.match(/\d+/)?.[0] || '0') - parseInt(b.match(/\d+/)?.[0] || '0'));
      return { folder, name, year, month, day, imageCount: imageFiles.length, imageFiles };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.year, b!.month - 1, b!.day).getTime() - new Date(a!.year, a!.month - 1, a!.day).getTime());

  writeFileSync(MANIFEST_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), events }, null, 2));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // id is the folder name (URL-encoded)
  const folderName = decodeURIComponent(id);
  const folderPath = path.join(EVENTS_DIR, folderName);

  if (existsSync(folderPath)) {
    rmSync(folderPath, { recursive: true, force: true });
  }

  // Remove descriptions
  const eventId = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const descriptions = getEventDescriptions();
  delete descriptions[eventId];
  saveEventDescriptions(descriptions);

  regenerateManifest();
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = decodeURIComponent(id);
  const body = await request.json();
  const descriptions = getEventDescriptions();
  descriptions[eventId] = { ...descriptions[eventId], ...body };
  saveEventDescriptions(descriptions);
  return NextResponse.json({ ok: true });
}
