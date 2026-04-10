export function createBackgroundMusic(): Promise<string> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 8;
  const numChannels = 2;
  const frameCount = sampleRate * duration;

  const audioBuffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);

  const melody = [
    { freq: 523.25, time: 0.0, duration: 0.4 },
    { freq: 587.33, time: 0.5, duration: 0.4 },
    { freq: 659.25, time: 1.0, duration: 0.4 },
    { freq: 587.33, time: 1.5, duration: 0.4 },
    { freq: 523.25, time: 2.0, duration: 0.4 },
    { freq: 659.25, time: 2.5, duration: 0.4 },
    { freq: 783.99, time: 3.0, duration: 0.8 },
    { freq: 659.25, time: 4.0, duration: 0.4 },
    { freq: 587.33, time: 4.5, duration: 0.4 },
    { freq: 523.25, time: 5.0, duration: 0.4 },
    { freq: 587.33, time: 5.5, duration: 0.4 },
    { freq: 659.25, time: 6.0, duration: 0.8 },
  ];

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);

    for (let i = 0; i < frameCount; i++) {
      channelData[i] = 0;
    }

    melody.forEach((note) => {
      const startSample = Math.floor(note.time * sampleRate);
      const noteDuration = Math.floor(note.duration * sampleRate);

      for (let i = 0; i < noteDuration && startSample + i < frameCount; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-3 * t / note.duration);
        const value = Math.sin(2 * Math.PI * note.freq * t) * envelope * 0.15;
        channelData[startSample + i] += value;
      }
    });
  }

  const offlineContext = new OfflineAudioContext(numChannels, frameCount, sampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  return new Promise<string>((resolve) => {
    offlineContext.startRendering().then((renderedBuffer) => {
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  setUint32(0x46464952);
  setUint32(length - 8);
  setUint32(0x45564157);
  setUint32(0x20746d66);
  setUint32(16);
  setUint16(1);
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
  setUint16(buffer.numberOfChannels * 2);
  setUint16(16);
  setUint32(0x61746164);
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
    offset++;
  }

  return arrayBuffer;
}
