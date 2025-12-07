# ⚡ Desplegar en Vercel en 30 segundos

## Opción 1: Desplegar directamente (recomendado)

```bash
# 1. Instalar Vercel CLI (solo primera vez)
npm install -g vercel

# 2. Build local (ya hecho)
npm run build

# 3. Desplegar el contenido de /dist
vercel --prod
```

**Vercel te preguntará:**
- `? Set up and deploy? [Y/n]` → **Y**
- `? Which scope? ...` → Elige tu cuenta (o crea una nueva)
- `? Found project settings? [y/N]` → **N** (primera vez)
- `? Project name?` → `ares-explorer`
- `? In which directory is your code located?` → **dist** (importante!)
- `? Want to modify these settings? [y/N]` → **N**

**Resultado:** 🚀 URL desplegada en ~1 minuto

```
> deployment complete
Your deployment is ready at: https://ares-explorer-xyz.vercel.app
```

---

## Opción 2: Desde GitHub (CI/CD)

### A) Push a GitHub
```bash
# Si no tienes repo local:
git init
git add .
git commit -m "Initial commit: Ares Explorer PWA"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ares-explorer.git
git push -u origin main
```

### B) Conectar GitHub a Vercel
1. Ve a https://vercel.com/new
2. Click **Import Git Repository**
3. Selecciona `ares-explorer`
4. Vercel auto-detectará Vite
5. Click **Deploy**

**Ventaja:** Cada `git push` despliega automáticamente ✅

---

## Verificar que funciona

```bash
# URL asignada (ejemplo):
# https://ares-explorer-abc123.vercel.app

# Test en navegador:
# ✓ Carga itinerario en /itinerario
# ✓ Mapa visible
# ✓ Service Worker registrado (DevTools → Application)
# ✓ Manifest.json accesible
```

---

## Usar esta URL en Google Play Console

1. Ve a https://play.google.com/console
2. Crea app nueva
3. En **App URL**, ingresa tu URL de Vercel:
   ```
   https://ares-explorer-xyz.vercel.app
   ```
4. Sube assets (ya generados en `/public/assets/`)
5. ¡Publicar! 🎉

---

## Troubleshooting

| Error | Solución |
|-------|----------|
| `DEPLOYMENT_NOT_FOUND` | Asegúrate de desplegar la carpeta `dist` con `vercel --prod` |
| `No se puede conectar` | Verifica que `dist/` existe: `ls dist/` |
| Manifest no carga | Debe estar en `dist/manifest.json` (se copia automáticamente) |

---

**Comandos rápidos:**

```bash
# Build + Deploy en 1 línea
npm run build && vercel --prod

# O con GitHub (automático):
git push origin main
```

**¡Listo! Tu app estará en Vercel en segundos.** ✨
