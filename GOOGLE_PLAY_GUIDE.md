# Guía: Publicar Ares Explorer en Google Play Console

## 1. Requisitos previos
- ✅ Cuenta de Google/Google Play Developer ($25 USD, pago único)
- ✅ App PWA funcional (ya lista en este proyecto)
- ✅ Assets (iconos, screenshots) en `/public/assets/`
- ✅ Manifest.json configurado (`/public/manifest.json`)
- ✅ Service Worker activo (`/public/service-worker.js`)

## 2. Estructura de archivos requerida
El proyecto ya tiene:
- `/public/manifest.json` — Descripción de la app (PWA)
- `/public/service-worker.js` — Caching offline
- `/index.html` — Registra el SW y carga el manifest

## 3. Generar iconos y assets
**Necesitas crear estas imágenes en `/public/assets/`:**

```
/public/assets/
  ├── icon-192x192.png
  ├── icon-256x256.png
  ├── icon-512x512.png
  ├── icon-maskable-192x192.png     (logo sin fondo para recorte)
  ├── icon-maskable-512x512.png
  ├── screenshot-1-192x192.png      (pantalla móvil)
  ├── screenshot-1-512x512.png
  ├── screenshot-wide-1280x720.png  (pantalla tablet)
  ├── icon-shortcut-192x192.png
  └── og-image.png                  (preview en redes)
```

**Generador rápido en línea:**
- https://www.favicon-generator.org/ → carga el logo Ares + descarga PNG
- https://www.pwa-asset-generator.com/ → genera iconos PWA automáticamente

**Comando local (si tienes ImageMagick):**
```bash
convert logo.png -define icon:auto-resize=192,256,512 icon.ico
```

## 4. Pasos en Google Play Console

### A) Crear un nuevo proyecto
1. Ve a https://play.google.com/console
2. Click en "**Create App**"
3. Nombre: "Ares Explorer"
4. Categoría: **Travel** o **Entertainment**
5. Tipo: PWA (Web app)

### B) Información de la app
1. **Title:** "Ares Explorer: Mars 2084"
2. **Description:** "Planifica tu viaje futurista a Marte en 2084 con itinerarios generados por IA, visualización de colonias y mapas interactivos."
3. **Short description:** "Explora Marte con Ares Explorer"
4. **Category:** Travel
5. **Content Rating Questionnaire:** Completa (toma 5-10 min)

### C) Artwork & Screenshots
- **App icon:** Carga `/public/assets/icon-512x512.png` (512x512)
- **Feature graphic:** 1024x500 px
- **Screenshots (móvil):** 3-5 screenshots de 540x720 px
- **Screenshots (tablet):** 3-5 screenshots de 1280x720 px

### D) URL de la app
1. Ve a **Release > Test Release** o **Production**
2. **App URL (URL Web):** `https://ares-explorer.vercel.app` (o tu dominio)
   - **Nota:** Tu app debe estar desplegada (ver paso 5)
3. **Scope:** `/` (raíz)
4. Asegúrate de que el `manifest.json` sea accesible en esa URL

### E) Privacy Policy
- Ve a **Policies**
- **Privacy Policy:** Carga/vincula tu política de privacidad
  - Ejemplo mínimo: `https://ares-explorer.vercel.app/privacy` 

### F) Content Rating
1. Click en **Content rating questionnaire**
2. Responde preguntas (toma ~5 min)
3. Genera reporte automático

### G) Información de contacto & precios
- **Email de contacto:** Tu email
- **Precio:** Free (sin costo)
- **Contenido:** Selecciona "No contiene publicidad"

### H) Enviar a revisión
1. Ve a **Release > Production**
2. Click **Create new release**
3. Sube los archivos necesarios (ya están en manifest.json)
4. **Review & publish**
5. Espera 1-4 horas para aprobación (generalmente rápido para PWA)

## 5. Desplegar la app (CRÍTICO)

### Opción A: Vercel (recomendado)
```bash
npm install -g vercel
vercel login
vercel
```
- Copia la URL asignada (ej: `https://ares-explorer-xyz.vercel.app`)
- Úsala en Google Play Console

### Opción B: Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Opción C: GitHub Pages
1. Push a `main` en GitHub
2. Ve a **Settings > Pages > Deploy from a branch**
3. Rama: `main`, carpeta: `/`
4. GitHub asigna URL automática

## 6. Verificación antes de enviar

### Checklist técnico:
- ✅ `manifest.json` → accesible en `https://tuapp.com/manifest.json`
- ✅ `service-worker.js` → registrado en `index.html`
- ✅ Iconos en `/public/assets/` → tamaños corretos (192, 256, 512, maskable)
- ✅ HTTPS habilitado (Vercel/Netlify lo hace automático)
- ✅ Responsive en móvil (test en DevTools)
- ✅ Funciona offline (SW cachea app shell)

### Test local:
```bash
npm run build
npm run preview
```
- Abre `http://localhost:4173`
- DevTools → "Installable" ✅
- Test en móvil: `npm run dev -- --host`

## 7. Después de publicar

### Monitoreo:
- Google Play Console mostrará descargas/ratings en 24-48 horas
- Usuarios pueden instalar como app nativa en Android

### Updates:
1. Modifica el código
2. Corre `npm run build && vercel`
3. **Incrementa versión en `manifest.json`** (opcional pero recomendado)
4. Google Play detectará cambios automáticamente

## 8. Notas importantes

- **PWA vs App nativa:** Google Play permite PWAs desde 2021 (no necesitas código Java/Kotlin)
- **Instalación:** Los usuarios verán "Instalar" en Play Store como una app normal
- **Actualizaciones:** El service worker + manifest.json maneja updates automáticos
- **Datos:** La app funciona offline (localStorage + IndexedDB)
- **APIs:** Acceso a cámara/ubicación requiere HTTPS + permisos en manifest.json

## Preguntas frecuentes

**¿Qué es un "maskable icon"?**
- Logo sin fondo que se adapta a formas redondeadas/cuadradas del dispositivo
- Generador: https://maskable.app/

**¿La app necesita backend?**
- No para MVP. Usas APIs externas (Google Gemini para IA, Leaflet para mapas)
- Todo funciona desde navegador

**¿Puedo usar otra ruta que no sea raíz?**
- Sí, cambia `"scope": "/"` en manifest.json al path que necesites
- Google Play Console también permite configurarlo

**¿Cuánto tarda la aprobación?**
- PWAs: 1-4 horas (rápido, menos requisitos que apps nativas)
- Apps nativas: 24-48 horas

---

**Próximos pasos:**
1. Genera los iconos/assets
2. Despliega en Vercel: `vercel`
3. Abre https://play.google.com/console
4. Sigue los pasos A-H arriba
5. ¡Listo! Tu app estará en Play Store en horas
