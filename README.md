# 🎵 GitHub Sound

Convierte tus contribuciones de GitHub en música. Una experiencia audiovisual única que transforma tu actividad de código en composiciones musicales.

## 🌐 Demo

**[Ver Demo en Vivo](https://holasoymalva.github.io/github-sound/)**

## ✨ Características

- 🎼 **Generación musical en tiempo real** basada en tus contribuciones
- 🎨 **Fondo animado con ASCII art** que crea ondulaciones de colores
- 🎵 **Múltiples capas de audio**: melodía, armonía, bajo y acordes
- 📊 **Visualización de contribuciones** estilo GitHub
- 💾 **Descarga el audio generado** en formato WAV
- 🎹 **Reproducción directa** en el navegador con Web Audio API

## 🚀 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/holasoymalva/github-sound.git
cd github-sound

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`

## 📦 Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## 🎼 Cómo Funciona

La aplicación convierte tus contribuciones de GitHub en música usando las siguientes reglas:

- **Melodía Principal**: Varía según la cantidad de contribuciones
  - Más contribuciones = notas más altas y fuertes
  - Sin contribuciones = notas bajas y suaves
- **Armonía**: Siempre acompaña a la melodía
- **Bajo**: Pulso constante cada 4 notas para dar ritmo
- **Acordes**: Progresión armónica que cambia cada 8 notas
- **Variaciones**: Días con muchas contribuciones (>10) agregan notas de acento

**Nunca hay silencio** - la música fluye continuamente, creando una experiencia inmersiva.

## 🛠️ Tecnologías

- **Vite** - Build tool y dev server
- **Vanilla JavaScript** - Sin frameworks, puro JS
- **@tonejs/midi** - Generación de archivos MIDI
- **Web Audio API** - Síntesis y reproducción de audio
- **Canvas API** - Animaciones de fondo con ASCII
- **GitHub Contributions API** - Datos de contribuciones

## 📝 API Utilizada

Esta app usa la [GitHub Contributions API](https://github-contributions-api.jogruber.de) que obtiene los datos reales del gráfico de contribuciones sin necesidad de autenticación.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - siéntete libre de usar este proyecto como quieras.

## 👨‍💻 Autor

**[@holasoymalva](https://github.com/holasoymalva)**

---

⭐ Si te gustó este proyecto, dale una estrella en GitHub!
