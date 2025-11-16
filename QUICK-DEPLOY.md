# 🚀 Deploy Rápido (Método Alternativo)

Si GitHub Actions no funciona, usa este método manual que es 100% confiable:

## Pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Deploy con un solo comando
```bash
npm run deploy
```

Este comando:
- Hace build del proyecto
- Crea una rama `gh-pages`
- Sube los archivos a esa rama
- ¡Listo!

### 3. Configurar GitHub Pages

1. Ve a: https://github.com/holasoymalva/github-sound/settings/pages
2. En **Source**, selecciona: **Deploy from a branch**
3. En **Branch**, selecciona: **gh-pages** y **/root**
4. Click en **Save**

### 4. Espera 1-2 minutos

Tu sitio estará en: https://holasoymalva.github.io/github-sound/

## Actualizar el sitio

Cada vez que quieras actualizar:

```bash
# Hacer cambios en el código...
git add .
git commit -m "Update"
git push origin main

# Deploy
npm run deploy
```

## Ventajas de este método

- ✅ Más simple
- ✅ Más confiable
- ✅ No depende de GitHub Actions
- ✅ Deploy instantáneo

## Nota

Este método crea una rama `gh-pages` separada solo para los archivos compilados.
Tu código fuente sigue en la rama `main`.
