# Desplegar Ares Explorer en Vercel

## Opción A: Desde Terminal (recomendado)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Conectar y desplegar
```bash
vercel login
vercel
```

**Responde las preguntas:**
- `? Set up and deploy ...? [Y/n]` → **Y**
- `? Which scope do you want to deploy to?` → Elige tu cuenta
- `? Link to existing project? [y/N]` → **N** (primera vez)
- `? What's your project's name?` → `ares-explorer`
- `? In which directory is your code located?` → `.`
- `? Want to modify these settings? [y/N]` → **N**

### 3. Deploy automático
```bash
# Vercel compilará y desplegará automáticamente
# URL asignada: https://ares-explorer-XXXXX.vercel.app
```

---

## Opción B: GitHub + Vercel (CI/CD automático)

### 1. Push a GitHub
```bash
git remote add origin https://github.com/TU_USER/ares-explorer.git
git branch -M main
git push -u origin main
```

### 2. Conectar Vercel a GitHub
1. Ve a https://vercel.com/new
2. Selecciona **Import Git Repository**
3. Conecta tu cuenta de GitHub
4. Busca `ares-explorer`
5. Click **Import**

### 3. Configuración de Vercel
- **Framework:** Vite
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `dist` (automático)
- Click **Deploy**

**Resultado:** Cada push a `main` despliega automáticamente 🚀

---

## Opción C: Desde UI de Vercel (más fácil)

1. Ve a https://vercel.com/new
2. Arrastra la carpeta `dist` (después de `npm run build`)
3. O conecta tu GitHub/GitLab
4. Click **Deploy**

---

## Después de desplegar

### 1. Verificar PWA
```bash
# URL desplegada (ejemplo):
# https://ares-explorer-xyz.vercel.app

# En navegador:
# - DevTools → Application → Manifest ✓
# - DevTools → Application → Service Workers ✓
# - "Install app" button visible en navegador ✓
```

### 2. Dominio personalizado (opcional)
1. Ve a **Project Settings → Domains**
2. Click **Add**
3. Ingresa tu dominio (ej: `ares-explorer.com`)
4. Sigue instrucciones para DNS

### 3. Variables de entorno (si usas APIs)
1. Ve a **Project Settings → Environment Variables**
2. Añade `VITE_GEMINI_KEY` (si usas Google Gemini)
3. Redeploy

---

## Verificación antes de Google Play Console

```bash
# 1. Build local
npm run build

# 2. Preview
npm run preview
# Abre http://localhost:4173

# 3. Checklist:
# ✓ Manifest.json accesible: /manifest.json
# ✓ Service Worker registrado
# ✓ Funciona offline
# ✓ Responsive en móvil
# ✓ HTTPS habilitado (Vercel lo hace automático)
```

---

## URL final para Google Play Console

Una vez desplegada en Vercel, tendrás una URL como:
```
https://ares-explorer-xyz.vercel.app
```

**Usa esta URL en Google Play Console → App URL (Web)**

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Build falsa | `npm install` → `npm run build` → `vercel` |
| Manifest no carga | Asegúrate que `/public/manifest.json` existe |
| SW no registra | Verifica HTTPS en la URL (Vercel lo hace automático) |
| Assets no cargan | Assets en `/public/assets/` → son estáticos automáticamente |

---

## Comando rápido para todo

```bash
# 1. Generar assets
npm run generate-assets

# 2. Build
npm run build

# 3. Preview local
npm run preview

# 4. Deploy a Vercel
vercel --prod
```

**Listo en 2-3 minutos** ✅
