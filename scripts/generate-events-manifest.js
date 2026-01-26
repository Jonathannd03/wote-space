const fs = require('fs');
const path = require('path');

/**
 * Generate events manifest at build time
 * This allows us to exclude event images from serverless bundles
 * while still knowing what events exist
 */

const eventsDir = path.join(process.cwd(), 'public', 'events');
const outputPath = path.join(process.cwd(), 'public', 'events-manifest.json');

function getImageFiles(eventFolder) {
  const eventPath = path.join(eventsDir, eventFolder);

  try {
    const files = fs.readdirSync(eventPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
  } catch (error) {
    console.error(`Error reading event folder ${eventFolder}:`, error);
    return [];
  }
}

function parseEventFolder(folderName) {
  const parts = folderName.split('_');

  if (parts.length < 4) {
    return null;
  }

  const year = parts[parts.length - 1];
  const month = parts[parts.length - 2];
  const day = parts[parts.length - 3];
  const name = parts.slice(0, parts.length - 3).join(' ');

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);

  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    return null;
  }

  return {
    name,
    year: yearNum,
    month: monthNum,
    day: dayNum,
  };
}

function generateManifest() {
  console.log('Generating events manifest...');

  if (!fs.existsSync(eventsDir)) {
    console.log('No events directory found, creating empty manifest');
    fs.writeFileSync(outputPath, JSON.stringify({ events: [] }, null, 2));
    return;
  }

  const folders = fs.readdirSync(eventsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const events = [];

  for (const folder of folders) {
    const parsed = parseEventFolder(folder);

    if (!parsed) {
      console.warn(`Could not parse event folder: ${folder}`);
      continue;
    }

    const images = getImageFiles(folder);

    events.push({
      folder,
      name: parsed.name,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      imageCount: images.length,
      // Store just the image filenames, paths will be constructed at runtime
      imageFiles: images,
    });
  }

  // Sort by date, most recent first
  events.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1, a.day);
    const dateB = new Date(b.year, b.month - 1, b.day);
    return dateB.getTime() - dateA.getTime();
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    events,
  };

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Generated manifest with ${events.length} events at ${outputPath}`);
}

generateManifest();
