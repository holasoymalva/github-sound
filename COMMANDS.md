# 📝 Comandos para Deployment

## Setup Inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Probar localmente
npm run dev
```

## Preparar para GitHub Pages

```bash
# 1. Asegúrate de estar en la rama main
git checkout main

# 2. Agregar todos los archivos
git add .

# 3. Commit con mensaje descriptivo
git commit -m "Initial commit - GitHub Sound project"

# 4. Agregar el remote (si no lo has hecho)
git remote add origin https://github.com/holasoymalva/github-sound.git

# 5. Push a GitHub
git push -u origin main
```

## Habilitar GitHub Pages

1. Ve a: https://github.com/holasoymalva/github-sound/settings/pages
2. En **Source**, selecciona: **GitHub Actions**
3. Guarda los cambios

## Verificar Deployment

```bash
# Ver el estado del workflow
# Ve a: https://github.com/holasoymalva/github-sound/actions

# Una vez completado, tu sitio estará en:
# https://holasoymalva.github.io/github-sound/
```

## Comandos de Desarrollo

```bash
# Desarrollo local con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

## Actualizar el Sitio

```bash
# Hacer cambios en el código...

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Push (esto triggerea el deployment automático)
git push origin main
```

## Troubleshooting

```bash
# Si hay problemas con node_modules
rm -rf node_modules package-lock.json
npm install

# Si el build falla localmente
npm run build
# Revisa los errores en la consola

# Limpiar caché de Vite
rm -rf node_modules/.vite
npm run dev
```
