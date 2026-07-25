import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawDir = path.join(rootDir, 'store-assets', 'raw-audios');
const outDir = path.join(rootDir, 'public', 'sounds');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(rawDir)) {
  console.error(`❌ No existe el directorio de audios originales: ${rawDir}`);
  process.exit(1);
}

const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.m4a'));

console.log(`\n🎧 Procesando ${files.length} audios para Ambiencer Pro...`);

files.forEach((file) => {
  const srcPath = path.join(rawDir, file);
  const baseName = path.basename(file, path.extname(file));
  const destWebm = path.join(outDir, `${baseName}.webm`);

  console.log(`  🎵 Convirtiendo: ${file} -> ${baseName}.webm (Opus 64kbps)`);
  try {
    // Convierte a WebM / Opus 64kbps para compresión HD con mínimo tamaño de archivo
    execSync(`ffmpeg -y -i "${srcPath}" -c:a libopus -b:a 64k -vbr on "${destWebm}"`, { stdio: 'pipe' });
    const stat = fs.statSync(destWebm);
    console.log(`     ✅ Generado: ${baseName}.webm (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`     ❌ Error al convertir ${file}:`, err.message);
  }
});

console.log(`\n🚀 ¡Todos los audios fueron procesados exitosamente en public/sounds/!`);
