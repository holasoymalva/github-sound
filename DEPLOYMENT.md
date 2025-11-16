# 🚀 Guía de Deployment a GitHub Pages

## Configuración Inicial

### 1. Habilitar GitHub Pages en tu repositorio

1. Ve a tu repositorio en GitHub: https://github.com/holasoymalva/github-sound
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**

### 2. Push del código

```bash
# Asegúrate de estar en la rama main
git checkout main

# Agregar todos los archivos
git add .

# Commit
git commit -m "Setup GitHub Pages deployment"

# Push
git push origin main
```

### 3. Deployment Automático

El workflow de GitHub Actions se ejecutará automáticamente cuando hagas push a la rama `main`.

Puedes ver el progreso en:
- https://github.com/holasoymalva/github-sound/actions

### 4. Acceder a tu sitio

Una vez completado el deployment, tu sitio estará disponible en:
- **https://holasoymalva.github.io/github-sound/**

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build local (para probar antes de deploy)
npm run build

# Preview del build
npm run preview
```

## Troubleshooting

### El sitio no carga correctamente

1. Verifica que el `base` en `vite.config.js` coincida con el nombre de tu repo
2. Asegúrate de que GitHub Pages esté configurado para usar GitHub Actions
3. Revisa los logs del workflow en la pestaña Actions

### Los assets no cargan

- Verifica que todas las rutas en el código sean relativas
- El `base: '/github-sound/'` en `vite.config.js` debe coincidir con el nombre del repo

### El workflow falla

1. Verifica que tengas los permisos correctos en Settings > Actions > General
2. Asegúrate de que "Read and write permissions" esté habilitado
3. Revisa los logs del workflow para ver el error específico

## Actualizar el Sitio

Cada vez que hagas push a `main`, el sitio se actualizará automáticamente:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

El deployment toma aproximadamente 1-2 minutos.
