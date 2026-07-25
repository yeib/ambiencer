import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const shouldBump = process.argv.includes('--bump');
const targetConfPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');

if (shouldBump && fs.existsSync(targetConfPath)) {
  try {
    const json = JSON.parse(fs.readFileSync(targetConfPath, 'utf-8'));
    if (json.version) {
      const parts = json.version.split('.');
      if (parts.length >= 3) {
        const patch = parseInt(parts[2], 10) + 1;
        const oldVer = json.version;
        json.version = `${parts[0]}.${parts[1]}.${patch}`;
        fs.writeFileSync(targetConfPath, JSON.stringify(json, null, 2), 'utf-8');
        console.log(`🔢 Auto-incrementando versión: ${oldVer} -> ${json.version}`);
      }
    }
  } catch (err) {
    console.error(`⚠️ No se pudo auto-incrementar la versión:`, err);
  }
}

try {
  console.log(`\n🚀 Preparando compilación MSIX para Ambiencer Pro...`);

  // 1. Compilar frontend de producción
  console.log(`📦 Compilando bundle frontend Vite...`);
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // 2. Compilar binario nativo con Tauri
  console.log(`🔨 Compilando binario con tauri build...`);
  execSync('npx tauri build', { stdio: 'inherit', cwd: rootDir });

  // 3. Generar paquete MSIX usando @choochmeque/tauri-windows-bundle
  console.log(`⚡ Empaquetando paquete MSIX oficial con tauri-windows-bundle...`);
  execSync('npx tauri-windows-bundle build --runner npm --regenerate-assets', { stdio: 'inherit', cwd: rootDir });

  console.log(`\n✅ Paquete MSIX compilado con éxito para Ambiencer Pro!`);
} catch (error) {
  console.error(`\n❌ Error durante la compilación MSIX de Ambiencer Pro:`, error);
  process.exitCode = 1;
}
