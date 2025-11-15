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
    const melodyTrack = midi.addTrack();
    const bassTrack = midi.addTrack();
    const padTrack = midi.addTrack();

    // Escalas musicales para mapear contribuciones
    const scales = {
        melody: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76], // C major extendida
        bass: [36, 38, 40, 41, 43, 45, 47, 48], // C major bajo
        chords: [
            [60, 64, 67], // C major
            [62, 65, 69], // Dm
            [64, 67, 71], // Em
            [65, 69, 72], // F major
            [67, 71, 74], // G major
            [69, 72, 76]  // Am
        ]
    };

    let time = 0;
    const noteDuration = 0.15; // Duración más corta para más fluidez
    let currentChordIndex = 0;

    contributions.forEach((day, index) => {
        // SIEMPRE generar sonido, nunca silencio
        
        // 1. MELODÍA PRINCIPAL - varía según contribuciones
        let noteIndex;
        let velocity;
        
        if (day.count > 0) {
            // Con contribuciones: notas más altas y fuertes
            noteIndex = Math.min(3 + Math.floor(day.count / 2), scales.melody.length - 1);
            velocity = Math.min(0.5 + (day.count / 15) * 0.5, 1);
        } else {
            // Sin contribuciones: notas más bajas y suaves (pero siempre presentes)
            noteIndex = Math.floor(Math.random() * 3); // Notas bajas
            velocity = 0.3;
        }
        
        const note = scales.melody[noteIndex];
        
        melodyTrack.addNote({
            midi: note,
            time: time,
            duration: noteDuration * 1.5,
            velocity: velocity
        });

        // 2. ARMONÍA - siempre presente
        const harmonyNote = scales.melody[Math.min(noteIndex + 2, scales.melody.length - 1)];
        melodyTrack.addNote({
            midi: harmonyNote,
            time: time,
            duration: noteDuration * 1.5,
            velocity: velocity * 0.5
        });

        // 3. BAJO - pulso constante cada 4 notas
        if (index % 4 === 0) {
            const bassNote = scales.bass[Math.floor(index / 4) % scales.bass.length];
            bassTrack.addNote({
                midi: bassNote,
                time: time,
                duration: noteDuration * 4,
                velocity: 0.6
            });
        }

        // 4. PAD/ACORDES - cambia cada 8 notas para crear progresión
        if (index % 8 === 0) {
            const chord = scales.chords[currentChordIndex % scales.chords.length];
            chord.forEach(chordNote => {
                padTrack.addNote({
                    midi: chordNote,
                    time: time,
                    duration: noteDuration * 8,
                    velocity: 0.3
                });
            });
            currentChordIndex++;
        }

        // 5. VARIACIÓN EXTRA para días con muchas contribuciones
        if (day.count > 10) {
            // Agregar nota de acento
            const accentNote = scales.melody[Math.min(noteIndex + 4, scales.melody.length - 1)];
            melodyTrack.addNote({
                midi: accentNote,
                time: time + noteDuration * 0.5,
                duration: noteDuration * 0.5,
                velocity: velocity * 0.8
            });
        }

        time += noteDuration;
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
 * Reproduce una nota usando Web Audio API con diferentes timbres
 */
function playNote(frequency, duration, velocity, startTime, waveType = 'sine') {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = waveType;
    oscillator.frequency.value = frequency;
    
    // Filtro para suavizar el sonido
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    // Envelope ADSR
    const now = audioContext.currentTime + startTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.1, now + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

/**
 * Reproduce el MIDI generado con múltiples tracks
 */
export function playMIDI(midi, onProgress, onComplete) {
    if (isPlaying) {
        stopMIDI();
    }

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    isPlaying = true;
    const tempo = 120; // BPM
    const beatDuration = 60 / tempo; // segundos por beat

    // Configuración de timbres por track
    const trackConfigs = [
        { waveType: 'sine', name: 'melody' },      // Melodía - suave
        { waveType: 'triangle', name: 'bass' },    // Bajo - cálido
        { waveType: 'sine', name: 'pad' }          // Pad - ambiente
    ];

    let totalNotes = 0;
    let playedNotes = 0;

    // Contar total de notas
    midi.tracks.forEach(track => {
        totalNotes += track.notes.length;
    });

    // Reproducir cada track
    midi.tracks.forEach((track, trackIndex) => {
        const config = trackConfigs[trackIndex] || trackConfigs[0];
        
        track.notes.forEach((note, noteIndex) => {
            const startTime = note.time * beatDuration;
            const duration = note.duration * beatDuration;
            const frequency = midiToFrequency(note.midi);

            setTimeout(() => {
                if (isPlaying) {
                    playNote(frequency, duration, note.velocity, 0, config.waveType);
                    playedNotes++;
                    
                    if (onProgress) {
                        onProgress(playedNotes / totalNotes);
                    }
                    
                    if (playedNotes === totalNotes && onComplete) {
                        setTimeout(() => {
                            isPlaying = false;
                            onComplete();
                        }, duration * 1000);
                    }
                }
            }, startTime * 1000);
        });
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
 * Genera y descarga el audio como archivo WAV con múltiples tracks
 */
export async function downloadAudio(midi, username) {
    const tempo = 120; // BPM
    const beatDuration = 60 / tempo;
    
    // Calcular duración total de todos los tracks
    let maxDuration = 0;
    midi.tracks.forEach(track => {
        if (track.notes.length > 0) {
            const lastNote = track.notes[track.notes.length - 1];
            const trackDuration = (lastNote.time + lastNote.duration) * beatDuration;
            maxDuration = Math.max(maxDuration, trackDuration);
        }
    });
    
    // Crear un buffer offline para renderizar el audio
    const sampleRate = 44100;
    const offlineContext = new OfflineAudioContext(2, sampleRate * maxDuration, sampleRate);
    
    // Configuración de timbres por track
    const trackConfigs = [
        { waveType: 'sine', name: 'melody' },
        { waveType: 'triangle', name: 'bass' },
        { waveType: 'sine', name: 'pad' }
    ];
    
    // Renderizar todas las notas de todos los tracks
    midi.tracks.forEach((track, trackIndex) => {
        const config = trackConfigs[trackIndex] || trackConfigs[0];
        
        track.notes.forEach(note => {
            const startTime = note.time * beatDuration;
            const duration = note.duration * beatDuration;
            const frequency = midiToFrequency(note.midi);
            
            // Crear oscilador
            const oscillator = offlineContext.createOscillator();
            const gainNode = offlineContext.createGain();
            const filter = offlineContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(offlineContext.destination);
            
            oscillator.type = config.waveType;
            oscillator.frequency.value = frequency;
            
            // Filtro
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            filter.Q.value = 1;
            
            // Envelope
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(note.velocity * 0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(note.velocity * 0.1, startTime + duration - 0.05);
            gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
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
