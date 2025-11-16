# 🔧 Troubleshooting GitHub Pages

## Problema: La página no carga

### Solución 1: Verificar configuración de GitHub Pages

1. Ve a: https://github.com/holasoymalva/github-sound/settings/pages
2. Asegúrate que **Source** esté en **GitHub Actions** (NO en "Deploy from a branch")
3. Guarda los cambios

### Solución 2: Verificar permisos del workflow

1. Ve a: https://github.com/holasoymalva/github-sound/settings/actions
2. En **Workflow permissions**, selecciona:
   - ✅ **Read and write permissions**
3. Guarda los cambios

### Solución 3: Ejecutar workflow manualmente

1. Ve a: https://github.com/holasoymalva/github-sound/actions
2. Selecciona el workflow "Deploy static content to Pages"
3. Click en **Run workflow** > **Run workflow**
4. Espera 1-2 minutos

### Solución 4: Verificar que el build funciona localmente

```bash
# Limpiar todo
rm -rf node_modules dist package-lock.json

# Reinstalar
npm install

# Build
npm run build

# Verificar que la carpeta dist/ se creó
ls -la dist/
```

Si el build local funciona, el problema es de configuración de GitHub.

### Solución 5: Verificar logs del workflow

1. Ve a: https://github.com/holasoymalva/github-sound/actions
2. Click en el último workflow run
3. Revisa los logs de cada step
4. Busca errores en rojo

## Problema: La página carga pero los assets no

### Solución: Verificar el base path

El `vite.config.js` debe tener:
```javascript
base: '/github-sound/'
```

Si cambiaste el nombre del repo, actualiza este valor.

## Problema: Error 404

### Causa común:
El nombre del repo en `vite.config.js` no coincide con el nombre real.

### Solución:
```javascript
// vite.config.js
export default defineConfig({
  base: '/NOMBRE-EXACTO-DEL-REPO/',
  // ...
});
```

## Comandos útiles para debugging

```bash
# Ver el build localmente
npm run build
npm run preview
# Abre http://localhost:4173/github-sound/

# Si funciona aquí, debería funcionar en GitHub Pages
```

## Checklist completo

- [ ] GitHub Pages configurado en "GitHub Actions"
- [ ] Workflow permissions en "Read and write"
- [ ] `vite.config.js` tiene el base path correcto
- [ ] El build local funciona (`npm run build`)
- [ ] El workflow se ejecutó sin errores
- [ ] Esperaste 2-3 minutos después del deployment

## Alternativa: Deploy manual

Si nada funciona, puedes hacer deploy manual:

```bash
# 1. Build local
npm run build

# 2. Instalar gh-pages
npm install -D gh-pages

# 3. Agregar script en package.json
# "deploy": "gh-pages -d dist"

# 4. Deploy
npm run deploy
```

Luego en GitHub Settings > Pages, selecciona la rama `gh-pages`.

## Contacto

Si sigues teniendo problemas, abre un issue en:
https://github.com/holasoymalva/github-sound/issues
