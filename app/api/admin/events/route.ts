import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync, writeFileSync } from 'fs';
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
        .sort((a, b) => {
          const na = parseInt(a.match(/\d+/)?.[0] || '0');
          const nb = parseInt(b.match(/\d+/)?.[0] || '0');
          return na - nb;
        });
      return { folder, name, year, month, day, imageCount: imageFiles.length, imageFiles };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const da = new Date(a!.year, a!.month - 1, a!.day);
      const db = new Date(b!.year, b!.month - 1, b!.day);
      return db.getTime() - da.getTime();
    });

  writeFileSync(MANIFEST_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    events,
  }, null, 2));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const nameFr = formData.get('nameFr') as string;
  const nameEn = formData.get('nameEn') as string;
  const date = formData.get('date') as string; // YYYY-MM-DD
  const descriptionFr = (formData.get('descriptionFr') as string) || '';
  const descriptionEn = (formData.get('descriptionEn') as string) || '';
  const files = formData.getAll('images') as File[];

  if (!nameFr || !date) {
    return NextResponse.json({ error: 'French name and date are required' }, { status: 400 });
  }

  const [year, month, day] = date.split('-');
  const folderName = `${nameFr}_${day}_${month}_${year}`;
  const folderPath = path.join(EVENTS_DIR, folderName);

  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  // Save uploaded images
  let index = 1;
  for (const file of files) {
    if (file.size === 0) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(folderPath, `img_${index}.${ext}`), buffer);
    index++;
  }

  // Save descriptions
  const eventId = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const descriptions = getEventDescriptions();
  descriptions[eventId] = {
    nameEn: nameEn || nameFr,
    nameFr,
    descriptionEn: descriptionEn || '',
    descriptionFr: descriptionFr || '',
    shortDescriptionEn: descriptionEn?.slice(0, 200) || '',
    shortDescriptionFr: descriptionFr?.slice(0, 200) || '',
  };
  saveEventDescriptions(descriptions);

  regenerateManifest();
  return NextResponse.json({ ok: true, folder: folderName });
}
