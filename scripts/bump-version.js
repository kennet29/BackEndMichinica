// scripts/bump-version.js
import fs from "fs";
import semver from "semver";

const type = process.argv[2]; // patch | minor | major

if (!["patch", "minor", "major"].includes(type)) {
  console.error("❌ Debes indicar el tipo de versión: patch, minor o major");
  process.exit(1);
}

try {
  // Leer el archivo package.json
  const pkgPath = new URL("../package.json", import.meta.url);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  // Calcular la nueva versión
  const nuevaVersion = semver.inc(pkg.version, type);

  if (!nuevaVersion) {
    console.error("❌ Error al incrementar la versión");
    process.exit(1);
  }

  pkg.version = nuevaVersion;

  // Guardar el archivo actualizado
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  console.log(`✅ Versión actualizada a ${nuevaVersion}`);
} catch (error) {
  console.error("❌ Error al actualizar la versión:", error.message);
  process.exit(1);
}
