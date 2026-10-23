// The live previews in site/media (poster .webp + short .mp4 loop per project) are captured by hand and
// committed, so CI keeps them as they are. This step stays in the workflow as a no-op and never fails.
import { readdirSync } from 'node:fs';
try {
  const files = readdirSync('site/media');
  console.log(`shoot: keeping ${files.length} committed media files (${files.join(', ')})`);
} catch (e) {
  console.log('shoot: no site/media folder, nothing to keep', String(e).slice(0, 80));
}
process.exit(0);
