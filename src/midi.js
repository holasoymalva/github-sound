import { Midi } from '@tonejs/midi';

// Audio Context para reproducción
let audioContext = null;
let isPlaying = false;
let currentTimeout = null;

/**
 * Genera un archivo MIDI basado en las contribuciones de GitHub
 */
export function generateMIDI(contributions) {
    const midi = new Midi();
    const track = midi.addTrack();

    // Escalas musicales para mapear contribuciones
    const scales = {
        minor: [60, 62, 63, 65, 67, 68, 70, 72], // C minor
        major: [60, 62, 64, 65, 67, 69, 71, 72], // C major
        pentatonic: [60, 62, 65, 67, 69, 72]     // C pentatonic
    };

    const scale = scales.pentatonic;
    let time = 0;
    const noteDuration = 0.25; // Duración de cada nota en beats

    contributions.forEach((day, index) => {
        if (day.count > 0) {
            // Mapear contribuciones a notas musicales
            const noteIndex = Math.min(day.count, scale.length - 1);
            const note = scale[noteIndex];
            
            // Velocidad basada en cantidad de contribuciones
            const velocity = Math.min(0.3 + (day.count / 20) * 0.7, 1);
            
            track.addNote({
                midi: note,
                time: time,
                duration: noteDuration,
                velocity: velocity
            });

            // Agregar armonía para días con muchas contribuciones
            if (day.count > 5) {
                const harmonyNote = scale[Math.min(noteIndex + 2, scale.length - 1)];
                track.addNote({
                    midi: harmonyNote,
                    time: time,
                    duration: noteDuration,
                    velocity: velocity * 0.6
                });
            }

            time += noteDuration;
        } else {
            // Silencio para días sin contribuciones
            time += noteDuration * 0.5;
        }
    });

    return midi;
}

/**
 * Convierte número MIDI a frecuencia en Hz
 */
function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Reproduce una nota usando Web Audio API
 */
function playNote(frequency, duration, velocity, startTime) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Envelope ADSR simple
    const now = audioContext.currentTime + startTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.1, now + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

/**
 * Reproduce el MIDI generado
 */
export function playMIDI(midi, onProgress, onComplete) {
    if (isPlaying) {
        stopMIDI();
    }

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    isPlaying = true;
    const track = midi.tracks[0];
    const tempo = 120; // BPM
    const beatDuration = 60 / tempo; // segundos por beat

    let currentTime = 0;
    let noteIndex = 0;

    track.notes.forEach((note, index) => {
        const startTime = note.time * beatDuration;
        const duration = note.duration * beatDuration;
        const frequency = midiToFrequency(note.midi);

        setTimeout(() => {
            if (isPlaying) {
                playNote(frequency, duration, note.velocity, 0);
                if (onProgress) {
                    onProgress((index + 1) / track.notes.length);
                }
                if (index === track.notes.length - 1 && onComplete) {
                    setTimeout(() => {
                        isPlaying = false;
                        onComplete();
                    }, duration * 1000);
                }
            }
        }, startTime * 1000);
    });
}

/**
 * Detiene la reproducción
 */
export function stopMIDI() {
    isPlaying = false;
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}

/**
 * Descarga el archivo MIDI
 */
export function downloadMIDI(midi, username) {
    const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-github-music.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Genera y descarga el audio como archivo WAV
 */
export async function downloadAudio(midi, username) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const track = midi.tracks[0];
    const tempo = 120; // BPM
    const beatDuration = 60 / tempo;
    
    // Calcular duración total
    const lastNote = track.notes[track.notes.length - 1];
    const totalDuration = (lastNote.time + lastNote.duration) * beatDuration;
    
    // Crear un buffer offline para renderizar el audio
    const sampleRate = 44100;
    const offlineContext = new OfflineAudioContext(2, sampleRate * totalDuration, sampleRate);
    
    // Renderizar todas las notas
    track.notes.forEach(note => {
        const startTime = note.time * beatDuration;
        const duration = note.duration * beatDuration;
        const frequency = midiToFrequency(note.midi);
        
        // Crear oscilador
        const oscillator = offlineContext.createOscillator();
        const gainNode = offlineContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(note.velocity * 0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(note.velocity * 0.1, startTime + duration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });
    
    // Renderizar el audio
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convertir a WAV
    const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
    
    // Descargar
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-github-music.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Convierte AudioBuffer a formato WAV
 */
function bufferToWave(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // Write WAV header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (let i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
        }
        offset++; // next source sample
    }

    return new Blob([buffer], { type: 'audio/wav' });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

/**
 * Visualiza las contribuciones en un canvas
 */
export function visualizeContributions(canvas, contributions) {
    const ctx = canvas.getContext('2d');
    const weeks = Math.ceil(contributions.length / 7);
    const cellSize = 10;
    const gap = 2;
    
    canvas.width = weeks * (cellSize + gap);
    canvas.height = 7 * (cellSize + gap);

    contributions.forEach((day, index) => {
        const week = Math.floor(index / 7);
        const dayOfWeek = index % 7;
        
        const x = week * (cellSize + gap);
        const y = dayOfWeek * (cellSize + gap);
        
        // Color basado en cantidad de contribuciones
        const intensity = Math.min(day.count / 10, 1);
        const color = getContributionColor(intensity);
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
    });
}

function getContributionColor(intensity) {
    if (intensity === 0) return '#ebedf0';
    if (intensity < 0.25) return '#9be9a8';
    if (intensity < 0.5) return '#40c463';
    if (intensity < 0.75) return '#30a14e';
    return '#216e39';
}
