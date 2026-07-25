import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const logoPath = path.join(rootDir, 'public', 'logo.png');

if (!fs.existsSync(logoPath)) {
  console.log(`\n⚠️ No se encontró la imagen maestra 'public/logo.png'.`);
  console.log(`📌 Coloca tu imagen de logo oficial en 'public/logo.png' (mínimo 512x512 PNG) y vuelve a ejecutar este comando.`);
  process.exit(0);
}

try {
  console.log(`\n🎨 Generando paquete completo de iconos y tiles para Microsoft Store...`);
  execSync('powershell -ExecutionPolicy Bypass -File scripts/gen-store-icons.ps1', { stdio: 'inherit', cwd: rootDir });
  console.log(`\n✅ ¡Generación de iconos completada exitosamente!`);
} catch (error) {
  console.error(`\n❌ Error al ejecutar el generador de iconos:`, error);
}
