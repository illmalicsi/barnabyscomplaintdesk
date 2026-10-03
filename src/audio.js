/**
 * audio.js - Procedural Web Audio API sound effects for Barnaby's Complaint Desk.
 * Zero external audio assets required. All sounds synthesized in real-time.
 */

let audioCtx = null;
let isMuted = localStorage.getItem('complaintdesk_muted') === 'true';

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return isMuted;
}

export function setAudioMuted(muted) {
  isMuted = muted;
  localStorage.setItem('complaintdesk_muted', muted ? 'true' : 'false');
  return isMuted;
}

export function toggleAudio() {
  return setAudioMuted(!isMuted);
}

/**
 * Procedural Bell Ding - Crystal-clear brass service bell chime
 */
export function playBellDing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Fundamental frequency ~1760 Hz (A6) and high bell harmonics
  const freqs = [1760, 3520, 5280, 880];
  const gains = [0.4, 0.25, 0.1, 0.15];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Exponential decay
    gain.gain.setValueAtTime(gains[i], now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (i === 0 ? 1.8 : 0.9));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.9);
  });
}

/**
 * Procedural Stamp Slam - Heavy desk thud + crisp mechanical wood impact
 */
export function playStampSlam() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Heavy low-frequency thump (kick/desk reverberation)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(32, now + 0.14);

  oscGain.gain.setValueAtTime(0.7, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);

  // 2. High-frequency wood impact transient (white noise snap)
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(3, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.5, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now);
}

/**
 * Procedural Paper Slide - Soft parchment rustle friction
 */
export function playPaperSlide() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.45;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.linearRampToValueAtTime(1400, now + duration * 0.5);
  filter.frequency.linearRampToValueAtTime(600, now + duration);
  filter.Q.setValueAtTime(1.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

/**
 * Procedural Coffee Sip & Cup Clink
 */
export function playCoffeeSip() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Liquid slurp noise
  const duration = 0.5;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.linearRampToValueAtTime(850, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);

  // Tiny ceramic cup clink after sip
  setTimeout(() => {
    if (isMuted) return;
    const clinkCtx = getAudioContext();
    if (!clinkCtx) return;
    const clinkTime = clinkCtx.currentTime;

    const osc = clinkCtx.createOscillator();
    const clinkGain = clinkCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, clinkTime);

    clinkGain.gain.setValueAtTime(0.2, clinkTime);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, clinkTime + 0.18);

    osc.connect(clinkGain);
    clinkGain.connect(clinkCtx.destination);

    osc.start(clinkTime);
    osc.stop(clinkTime + 0.2);
  }, 480);
}

/**
 * Procedural Paper Shredder sound
 */
export function playPaperShred() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.85;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    // Shredding rhythmic teeth modulation
    const mod = Math.sin(i * 0.05) > 0.2 ? 1 : 0.2;
    data[i] = (Math.random() * 2 - 1) * mod;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1600, now);
  filter.Q.setValueAtTime(2, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.02, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.18, now + duration - 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

/**
 * Procedural Clerk Murmur - Cute deadpan vocal synthesizer blip
 */
export function playClerkMurmur(pitchOffset = 0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [130, 145, 120, 138];
  
  notes.forEach((freq, idx) => {
    const startTime = now + idx * 0.065;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq + pitchOffset, startTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, startTime);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.07);
  });
}

/**
 * Procedural UI Click
 */
export function playUiClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}
