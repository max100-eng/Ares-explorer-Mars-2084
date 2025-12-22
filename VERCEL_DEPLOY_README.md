# Despliegue de Ares Explorer en Vercel

## Estado Actual
✅ **La aplicación está lista para desplegarse en Vercel**

### Cambios Realizados
1. ✅ Corregido error de sintaxis en `public/manifest.json` (faltaba una coma entre objetos de iconos)
2. ✅ Actualizado `.gitignore` para excluir archivos de Terraform innecesarios
3. ✅ Build verificado exitosamente
4. ✅ Manifest.json validado como JSON válido

## Desplegar en Vercel

### Opción 1: Deploy Automático desde GitHub (Recomendado)

1. **Conecta este repositorio a Vercel:**
   - Ve a https://vercel.com/new
   - Selecciona "Import Git Repository"
   - Conecta tu cuenta de GitHub
   - Busca `Ares-explorer-Mars-2084`
   - Click **Import**

2. **Configuración de Vercel** (auto-detectada):
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Variables de Entorno** (opcional):
   - Si quieres usar la funcionalidad de Google Gemini AI:
     - Ve a Project Settings → Environment Variables
     - Añade: `VITE_GEMINI_API_KEY` = tu API key de Google Gemini
   
4. Click **Deploy** 🚀

**Resultado:** Cada push a la rama principal desplegará automáticamente.

### Opción 2: Deploy Manual desde CLI

```bash
# 1. Instalar Vercel CLI (primera vez)
npm install -g vercel

# 2. Login
vercel login

# 3. Desplegar
npm run build
vercel --prod
```

## Verificación Post-Despliegue

Una vez desplegado, verifica:

1. ✅ La app carga correctamente
2. ✅ El manifest.json está accesible: `https://tu-url.vercel.app/manifest.json`
3. ✅ El service worker se registra (DevTools → Application → Service Workers)
4. ✅ La app es instalable como PWA

## URL Esperada

Tu app estará disponible en:
```
https://ares-explorer-mars-2084.vercel.app
```
(O el nombre que Vercel asigne automáticamente)

## Dominio Personalizado (Opcional)

1. Ve a Project Settings → Domains
2. Añade tu dominio personalizado
3. Sigue las instrucciones de DNS

## Problemas Comunes

| Problema                     | Solución                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| Build falla                  | Verifica que `npm run build` funcione localmente             |
| Manifest no carga            | Debe estar en `/public/manifest.json` (✅ ya está)           |
| Service Worker no registra   | Vercel automáticamente provee HTTPS (requerido para SW)     |

## Notas Importantes

- ⚠️ **API Key de Gemini**: Sin la variable de entorno `VITE_GEMINI_API_KEY`, la funcionalidad de AI estará offline
- ✅ **PWA Ready**: La app incluye manifest.json y service worker
- ✅ **Optimizado**: Build con tree-shaking y minificación automática
- ✅ **Cache Headers**: Configurados en `vercel.json` para assets estáticos

---

**¡Tu app está lista para producción!** 🎉
