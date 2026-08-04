"use client";

// Sadece istemcide çalışmasını sağla
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Tarayıcı destek kontrolü
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("utopik_sound_enabled") === "true";
};

export const getVolume = (): number => {
  if (typeof window === "undefined") return 1.0;
  const vol = localStorage.getItem("utopik_sound_volume");
  return vol ? parseFloat(vol) / 100 : 1.0;
};

// UI Tıklama Sesi (Kısa, teknolojik bip)
export const playClickSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
  
  const vol = getVolume();
  gainNode.gain.setValueAtTime(0.1 * vol, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
};

// Tur Atlama Sesi (Derin bas dalgası)
export const playTurnSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(150, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

  const vol = getVolume();
  gainNode.gain.setValueAtTime(0.3 * vol, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.5);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
};

// Kriz Sesi (Gerilimli Siren)
export const playAlertSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  // Siren efekti (yukarı çıkıp inme)
  oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.2);
  oscillator.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.4);
  oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.6);
  oscillator.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.8);

  const vol = getVolume();
  gainNode.gain.setValueAtTime(0.05 * vol, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1 * vol, ctx.currentTime + 0.4);
  gainNode.gain.linearRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.8);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.8);
};
