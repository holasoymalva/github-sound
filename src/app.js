import { getGitHubContributions } from './github.js';
import { generateMIDI, downloadAudio, visualizeContributions, playMIDI, stopMIDI } from './midi.js';

// Elementos del DOM
const usernameInput = document.getElementById('username');
const generateBtn = document.getElementById('generate');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');
const totalContributionsSpan = document.getElementById('totalContributions');
const activeDaysSpan = document.getElementById('activeDays');
const canvas = document.getElementById('contributionsCanvas');
const downloadBtn = document.getElementById('download');
const playBtn = document.getElementById('playPreview');

let currentMidi = null;
let currentUsername = null;
let isPlaying = false;

// Event listeners
generateBtn.addEventListener('click', handleGenerate);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGenerate();
});
downloadBtn.addEventListener('click', handleDownload);
playBtn.addEventListener('click', handlePlay);

async function handleGenerate() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Por favor ingresa un usuario de GitHub');
        return;
    }

    currentUsername = username;
    showLoading();
    hideError();
    hideResults();

    try {
        const data = await getGitHubContributions(username);
        
        // Generar MIDI
        currentMidi = generateMIDI(data.contributions);
        
        // Mostrar resultados
        totalContributionsSpan.textContent = data.total;
        activeDaysSpan.textContent = data.activeDays;
        
        // Visualizar contribuciones
        visualizeContributions(canvas, data.contributions);
        
        hideLoading();
        showResults();
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

async function handleDownload() {
    if (currentMidi && currentUsername) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⏳ Generando audio...';
        
        try {
            await downloadAudio(currentMidi, currentUsername);
            downloadBtn.textContent = '✅ Descargado';
            setTimeout(() => {
                downloadBtn.textContent = '⬇️ Descargar Audio';
                downloadBtn.disabled = false;
            }, 2000);
        } catch (error) {
            showError('Error al generar el audio');
            downloadBtn.textContent = '⬇️ Descargar Audio';
            downloadBtn.disabled = false;
        }
    }
}

function handlePlay() {
    if (!currentMidi) return;

    if (isPlaying) {
        // Detener reproducción
        stopMIDI();
        isPlaying = false;
        playBtn.textContent = '▶️ Reproducir';
        playBtn.style.background = '#667eea';
    } else {
        // Iniciar reproducción
        isPlaying = true;
        playBtn.textContent = '⏸️ Detener';
        playBtn.style.background = '#e74c3c';
        
        playMIDI(
            currentMidi,
            (progress) => {
                // Actualizar progreso
                const percentage = Math.round(progress * 100);
                playBtn.textContent = `⏸️ ${percentage}%`;
            },
            () => {
                // Completado
                isPlaying = false;
                playBtn.textContent = '▶️ Reproducir';
                playBtn.style.background = '#667eea';
            }
        );
    }
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function showResults() {
    resultsDiv.classList.remove('hidden');
}

function hideResults() {
    resultsDiv.classList.add('hidden');
}
