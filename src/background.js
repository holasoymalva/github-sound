/**
 * Genera un fondo animado con ondulaciones ASCII
 */

let animationFrame = null;
let time = 0;

const ASCII_CHARS = ['·', '∴', '∵', ':', '∷', '░', '▒', '▓', '█', '●', '◐', '◑', '◒', '◓', '◉', '◎'];
const COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'
];

export function initBackground() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuración
    const cols = Math.floor(canvas.width / 20);
    const rows = Math.floor(canvas.height / 20);
    
    function draw() {
        // Fondo oscuro con fade suave
        ctx.fillStyle = 'rgba(15, 15, 35, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 18px monospace';
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * 20;
                const y = j * 20;
                
                // Múltiples ondas para crear patrones complejos
                const wave1 = Math.sin((i * 0.08) + (time * 0.015)) * Math.cos((j * 0.08) + (time * 0.02));
                const wave2 = Math.cos((i * 0.12) - (time * 0.018)) * Math.sin((j * 0.1) + (time * 0.015));
                const wave3 = Math.sin((i * 0.06) + (j * 0.06) + (time * 0.012));
                const wave4 = Math.cos((i * 0.1) - (j * 0.1) + (time * 0.01));
                
                const combined = (wave1 + wave2 + wave3 + wave4) / 4;
                
                // Seleccionar carácter basado en la onda
                const charIndex = Math.floor(((combined + 1) / 2) * (ASCII_CHARS.length - 1));
                const char = ASCII_CHARS[charIndex];
                
                // Seleccionar color con transición suave
                const colorValue = ((combined + 1) / 2) + (Math.sin(time * 0.01) * 0.2);
                const colorIndex = Math.floor(colorValue * (COLORS.length - 1)) % COLORS.length;
                const color = COLORS[colorIndex];
                
                // Opacidad dinámica
                const opacity = 0.2 + ((combined + 1) / 2) * 0.6;
                
                // Agregar brillo a algunos caracteres
                const glow = Math.abs(combined) > 0.7;
                
                if (glow) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillStyle = color;
                ctx.globalAlpha = opacity;
                ctx.fillText(char, x, y);
            }
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        time += 1;
        animationFrame = requestAnimationFrame(draw);
    }
    
    draw();
}

export function stopBackground() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}
