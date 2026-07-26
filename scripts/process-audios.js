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

console.log(`\n🎧 Procesando y eliminando silencios de encoder para ${files.length} audios...`);

files.forEach((file) => {
  const srcPath = path.join(rawDir, file);
  const baseName = path.basename(file, path.extname(file));
  const destWebm = path.join(outDir, `${baseName}.webm`);

  console.log(`  🎵 Recortando silencio y convirtiendo: ${file} -> ${baseName}.webm (Opus 64kbps)`);
  try {
    // Filtro ffmpeg silenceremove para eliminar rellenos de silencio al inicio y final del MP3 encoder
    const ffmpegCmd = `ffmpeg -y -i "${srcPath}" -af "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_duration=0.02:start_threshold=-55dB,areverse" -c:a libopus -b:a 64k -vbr on "${destWebm}"`;
    execSync(ffmpegCmd, { stdio: 'pipe' });
    const stat = fs.statSync(destWebm);
    console.log(`     ✅ Bucle perfecto generado: ${baseName}.webm (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`     ❌ Error al procesar ${file}:`, err.message);
  }
});

console.log(`\n🚀 ¡Procesamiento de audios sin huecos de silencio finalizado en public/sounds/!`);
