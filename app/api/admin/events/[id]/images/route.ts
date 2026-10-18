import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const folderName = decodeURIComponent(id);
  const folderPath = path.join(EVENTS_DIR, folderName);

  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  const formData = await request.formData();
  const files = formData.getAll('images') as File[];

  // Find next available index
  const existing = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  const maxIndex = existing.reduce((max, f) => {
    const n = parseInt(f.match(/\d+/)?.[0] || '0');
    return n > max ? n : max;
  }, 0);

  let index = maxIndex + 1;
  for (const file of files) {
    if (file.size === 0) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(folderPath, `img_${index}.${ext}`), buffer);
    index++;
  }

  regenerateManifest();
  return NextResponse.json({ ok: true, added: index - maxIndex - 1 });
}
