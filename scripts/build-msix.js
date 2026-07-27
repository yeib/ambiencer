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

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function patchTauriWindowsBundle() {
  const targetFiles = [
    path.join(rootDir, 'node_modules', '@choochmeque', 'tauri-windows-bundle', 'dist', 'cli.js'),
    path.join(rootDir, 'node_modules', '@choochmeque/tauri-windows-bundle', 'dist', 'index.js')
  ];
  for (const filePath of targetFiles) {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      if (!content.includes("'Wide310x150Logo.png': 'Wide310x150Logo.png'")) {
        content = content.replace(
          "'Square150x150Logo.png': 'Square150x150Logo.png',",
          "'Square150x150Logo.png': 'Square150x150Logo.png',\n    'Wide310x150Logo.png': 'Wide310x150Logo.png',\n    'Square310x310Logo.png': 'Square310x310Logo.png',\n    'Square71x71Logo.png': 'Square71x71Logo.png',"
        );
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`🩹 Auto-aplicado parche de íconos en ${path.basename(filePath)}`);
      }
    }
  }
}
patchTauriWindowsBundle();

try {
  console.log(`\n🚀 Preparando compilación MSIX para Ambiencer Pro...`);

  // 1. Compilar frontend de producción
  console.log(`📦 Compilando bundle frontend Vite...`);
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // 2. Compilar binario nativo con Tauri
  console.log(`🔨 Compilando binario con tauri build...`);
  execSync('npx tauri build', { stdio: 'inherit', cwd: rootDir });

  // 3. Copiar assets reales directamente a gen/windows/Assets antes de empaquetar
  const iconsPath = path.join(rootDir, 'src-tauri', 'icons');
  const genAssetsDir = path.join(rootDir, 'src-tauri', 'gen', 'windows', 'Assets');
  if (fs.existsSync(iconsPath)) {
    copyDir(iconsPath, genAssetsDir);
    console.log(`🖼️ Iconos de Ambiencer Pro copiados a gen/windows/Assets`);
  }

  // 4. Generar paquete MSIX usando @choochmeque/tauri-windows-bundle
  console.log(`⚡ Empaquetando paquete MSIX oficial con tauri-windows-bundle...`);
  execSync('npx tauri-windows-bundle build --runner npm --regenerate-assets', { stdio: 'inherit', cwd: rootDir });

  // Verificación de integridad de assets
  const wideLogoPath = path.join(genAssetsDir, 'Wide310x150Logo.png');
  if (fs.existsSync(wideLogoPath)) {
    const stat = fs.statSync(wideLogoPath);
    console.log(`🔍 Verificación de Wide310x150Logo.png: ${stat.size} bytes`);
    if (stat.size < 1000) {
      console.warn(`⚠️ ALERTA: Wide310x150Logo.png parece ser un placeholder genérico (${stat.size} bytes)!`);
    } else {
      console.log(`✅ Asset Wide310x150Logo.png verificado como icono real único (${stat.size} bytes).`);
    }
  }

  console.log(`\n✅ Paquete MSIX compilado con éxito para Ambiencer Pro!`);
} catch (error) {
  console.error(`\n❌ Error durante la compilación MSIX de Ambiencer Pro:`, error);
  process.exitCode = 1;
}
