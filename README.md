# 🎵 GitHub Music Generator

Aplicación web que convierte las contribuciones de GitHub del último año en composiciones musicales MIDI.

## 🚀 Instalación

```bash
npm install
```

## 💻 Uso

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`

## ⚠️ Nota Importante

Esta app usa la API pública de GitHub Contributions (https://github-contributions-api.jogruber.de) que obtiene los datos reales del gráfico de contribuciones de GitHub sin necesidad de autenticación.

Los datos son exactamente los mismos que ves en tu perfil de GitHub.

## 🎼 Cómo Funciona

- Cada día con contribuciones genera una nota musical
- Más contribuciones = notas más altas y más intensas
- Días con muchas contribuciones agregan armonías
- Días sin contribuciones crean silencios

## 🛠️ Tecnologías

- Vanilla JavaScript/TypeScript
- Vite
- @tonejs/midi
- GitHub API
