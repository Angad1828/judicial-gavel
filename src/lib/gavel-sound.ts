/**
 * Synthesized gavel thud (Web Audio). No asset download, no external URL.
 * A short wooden knock: low body tone + filtered noise transient.
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

export function playGavelThud(intensity = 1) {
  const ac = getContext();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  const now = ac.currentTime;
  const master = ac.createGain();
  master.gain.value = 0.35 * intensity;
  master.connect(ac.destination);

  // Wooden body
  const body = ac.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(190, now);
  body.frequency.exponentialRampToValueAtTime(58, now + 0.16);
  const bodyGain = ac.createGain();
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.exponentialRampToValueAtTime(1, now + 0.006);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  body.connect(bodyGain).connect(master);
  body.start(now);
  body.stop(now + 0.32);

  // Contact transient
  const frames = Math.floor(ac.sampleRate * 0.09);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 4);
  }
  const noise = ac.createBufferSource();
  noise.buffer = buffer;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1250;
  bp.Q.value = 0.8;
  const noiseGain = ac.createGain();
  noiseGain.gain.value = 0.5;
  noise.connect(bp).connect(noiseGain).connect(master);
  noise.start(now);
}
