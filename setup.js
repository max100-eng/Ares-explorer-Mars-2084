import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 ARES EXPLORER SETUP AUTOMATION 🚀\n');
console.log('Vamos a configurar tu API Key de Google Gemini automáticamente.');

rl.question('\n👉 Por favor, pega tu API KEY (empieza por AIza...): ', (apiKey) => {
  if (!apiKey || apiKey.length < 10) {
    console.error('\n❌ Error: La clave parece inválida o está vacía.');
    rl.close();
    process.exit(1);
  }

  // Se utiliza VITE_API_KEY porque tu proyecto es un proyecto Vite y
  // las variables de entorno para el navegador deben ser prefijadas con VITE_
  const envContent = `VITE_API_KEY=${apiKey.trim()}\n`;

  try {
    // Crear archivo .env
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Archivo .env creado exitosamente.');
    
    // Crear archivo .env.local (Vite lee esto)
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Archivo .env.local creado exitosamente de respaldo.');

    console.log('\n🎉 ¡Configuración completa!');
    console.log('Ahora ejecuta: npm run dev');
  } catch (err) {
    console.error('\n❌ Error escribiendo los archivos:', err);
  }

  rl.close();
});