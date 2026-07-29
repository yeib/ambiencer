import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const logoA = path.join(rootDir, 'store-assets', 'logoA.png');
const logoPublic = path.join(rootDir, 'public', 'logo.png');

if (!fs.existsSync(logoA) && !fs.existsSync(logoPublic)) {
  console.log(`\n⚠️ No se encontró 'store-assets/logoA.png' ni 'public/logo.png'.`);
  console.log(`📌 Coloca tu imagen de logo oficial en 'store-assets/logoA.png' y vuelve a ejecutar.`);
  process.exit(0);
}

try {
  console.log(`\n🎨 Generando paquete completo de iconos y tiles para Ambiencer...`);
  if (process.platform === 'win32') {
    execSync('powershell -ExecutionPolicy Bypass -File scripts/gen-store-icons.ps1', { stdio: 'inherit', cwd: rootDir });
  } else {
    execSync('python3 scripts/gen-icons.py', { stdio: 'inherit', cwd: rootDir });
  }
  console.log(`\n✅ ¡Generación de iconos completada exitosamente!`);
} catch (error) {
  console.error(`\n❌ Error al ejecutar el generador de iconos:`, error);
}
