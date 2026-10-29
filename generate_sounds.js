const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

function writeWav(filename, sampleRate, samples) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  fs.writeFileSync(path.join(audioDir, filename), buffer);
  console.log(`Generated: ${filename} (${samples.length} samples)`);
}

const SR = 44100;

// 1. Pop sound (0.12s)
{
  const duration = 0.12;
  const len = Math.floor(SR * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 40);
    const freq = 600 - t * 3500;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env;
  }
  writeWav('pop.wav', SR, samples);
}

// 2. Star sound (0.4s) - Sparkly arpeggio
{
  const duration = 0.45;
  const len = Math.floor(SR * duration);
  const samples = new Float32Array(len);
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const startT = idx * 0.08;
    const startIdx = Math.floor(startT * SR);
    for (let i = startIdx; i < len; i++) {
      const t = (i - startIdx) / SR;
      const env = Math.exp(-t * 9);
      samples[i] += Math.sin(2 * Math.PI * freq * t) * env * 0.28;
    }
  });
  writeWav('star.wav', SR, samples);
}

// 3. Correct sound (0.6s) - Upbeat Victory Chime
{
  const duration = 0.65;
  const len = Math.floor(SR * duration);
  const samples = new Float32Array(len);
  const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  chord.forEach((freq, idx) => {
    const startT = idx * 0.09;
    const startIdx = Math.floor(startT * SR);
    for (let i = startIdx; i < len; i++) {
      const t = (i - startIdx) / SR;
      const env = Math.exp(-t * 6);
      samples[i] += (Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(4 * Math.PI * freq * t)) * env * 0.22;
    }
  });
  writeWav('correct.wav', SR, samples);
}

// 4. Cheer / Fanfare sound (0.9s)
{
  const duration = 0.9;
  const len = Math.floor(SR * duration);
  const samples = new Float32Array(len);
  // Major triad progression
  const sequence = [
    { freq: 523.25, t: 0.0, d: 0.2 },
    { freq: 659.25, t: 0.15, d: 0.2 },
    { freq: 783.99, t: 0.3, d: 0.2 },
    { freq: 1046.50, t: 0.45, d: 0.45 }
  ];
  sequence.forEach(note => {
    const startIdx = Math.floor(note.t * SR);
    const endIdx = Math.min(len, startIdx + Math.floor(note.d * SR));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SR;
      const env = Math.sin((t / note.d) * Math.PI);
      samples[i] += Math.sin(2 * Math.PI * note.freq * t) * env * 0.35;
    }
  });
  writeWav('cheer.wav', SR, samples);
}

// 5. Wrong / Try Again sound (0.35s)
{
  const duration = 0.35;
  const len = Math.floor(SR * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 8);
    const freq = 320 - t * 300;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
  }
  writeWav('wrong.wav', SR, samples);
}
