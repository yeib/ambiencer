// Web Audio API Procedural & Media Audio Sound Engine — 100% Offline
import { FrequencyGeneratorState } from '../types';

interface ChannelRecord {
  id: string;
  gain: GainNode;
  nodes: any[];
  sourceNode?: AudioBufferSourceNode;
  audioBuffer?: AudioBuffer;
  isLoading: boolean;
  targetVolume: number;
  isMuted: boolean;
  cleanup?: () => void;
}

class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private channels: Map<string, ChannelRecord> = new Map();
  private isMasterMuted: boolean = false;
  private masterVolume: number = 0.8;

  // Custom Frequency & Binaural Synthesizer
  private freqGainNode: GainNode | null = null;
  private freqOscL: OscillatorNode | null = null;
  private freqOscR: OscillatorNode | null = null;
  private freqFilter: BiquadFilterNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.masterVolume;
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public async resume() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = vol;
    if (this.masterGain && !this.isMasterMuted) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx?.currentTime || 0, 0.05);
    }
  }

  public setMasterMute(muted: boolean) {
    this.isMasterMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.masterVolume, this.ctx?.currentTime || 0, 0.05);
    }
  }

  public stopAllChannels() {
    this.channels.forEach((ch) => {
      ch.targetVolume = 0;
      ch.gain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
      if (ch.sourceNode) {
        try { ch.sourceNode.stop(); ch.sourceNode.disconnect(); } catch (e) {}
      }
      if (ch.cleanup) ch.cleanup();
    });
    this.channels.clear();
  }

  // --- Custom Frequency / Solfeggio & Binaural Generator ---
  public updateFrequencyGenerator(state: FrequencyGeneratorState) {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    if (!state.enabled || state.volume === 0) {
      if (this.freqGainNode) {
        this.freqGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      return;
    }

    const now = this.ctx.currentTime;

    if (!this.freqGainNode) {
      this.freqGainNode = this.ctx.createGain();
      this.freqFilter = this.ctx.createBiquadFilter();
      this.freqFilter.type = 'lowpass';
      this.freqFilter.frequency.value = 1400;

      this.freqGainNode.connect(this.freqFilter);
      this.freqFilter.connect(this.masterGain);
    }

    this.freqGainNode.gain.setTargetAtTime(state.volume, now, 0.05);

    if (this.freqOscL) {
      try { this.freqOscL.stop(); this.freqOscL.disconnect(); } catch (e) {}
    }
    if (this.freqOscR) {
      try { this.freqOscR.stop(); this.freqOscR.disconnect(); } catch (e) {}
    }

    const carrier = state.carrierFreq;
    const beat = state.mode === 'binaural' ? state.beatFreq : 0;
    const waveType = state.waveform;

    this.freqOscL = this.ctx.createOscillator();
    this.freqOscL.type = waveType;
    this.freqOscL.frequency.setValueAtTime(carrier, now);

    this.freqOscR = this.ctx.createOscillator();
    this.freqOscR.type = waveType;
    this.freqOscR.frequency.setValueAtTime(carrier + beat, now);

    const merger = this.ctx.createChannelMerger(2);
    this.freqOscL.connect(merger, 0, 0);
    this.freqOscR.connect(merger, 0, 1);

    merger.connect(this.freqGainNode);

    this.freqOscL.start(now);
    this.freqOscR.start(now);
  }

  // --- Channel Audio Controls ---
  public updateChannelVolume(channelId: string, vol: number, isMuted: boolean, type: string, fileUrl?: string) {
    if (!this.ctx) this.init();
    const effectiveVol = isMuted ? 0 : vol;
    const now = this.ctx?.currentTime || 0;

    let ch = this.channels.get(channelId);

    if (!ch) {
      if (effectiveVol > 0) {
        this.createChannel(channelId, type, effectiveVol, isMuted, fileUrl);
      }
    } else {
      ch.targetVolume = effectiveVol;
      ch.isMuted = isMuted;
      ch.gain.gain.setTargetAtTime(effectiveVol, now, 0.05);

      if (effectiveVol === 0 && ch.sourceNode) {
        try {
          ch.sourceNode.stop();
          ch.sourceNode.disconnect();
          ch.sourceNode = undefined;
        } catch (e) {}
      }
    }
  }

  // Algoritmo de Crossfade Equal-Power para bucles infinitos 100% invisibles sin cortes ni fades de IA
  private makeCrossfadedLoopBuffer(originalBuffer: AudioBuffer, crossfadeDurationSec: number = 1.5): AudioBuffer {
    if (!this.ctx) return originalBuffer;
    
    const sampleRate = originalBuffer.sampleRate;
    const numChannels = originalBuffer.numberOfChannels;
    const crossfadeSamples = Math.min(
      Math.floor(sampleRate * crossfadeDurationSec),
      Math.floor(originalBuffer.length / 4)
    );

    if (crossfadeSamples <= 0) return originalBuffer;

    const newLength = originalBuffer.length - crossfadeSamples;
    const resultBuffer = this.ctx.createBuffer(numChannels, newLength, sampleRate);

    for (let c = 0; c < numChannels; c++) {
      const srcData = originalBuffer.getChannelData(c);
      const destData = resultBuffer.getChannelData(c);

      // Copiar el cuerpo central
      for (let i = 0; i < newLength; i++) {
        destData[i] = srcData[i];
      }

      // Mezclar los últimos N milisegundos del final con el inicio usando curva Equal-Power (Cos/Sin)
      const fadeStart = newLength - crossfadeSamples;
      const originalEndStart = originalBuffer.length - crossfadeSamples;

      for (let i = 0; i < crossfadeSamples; i++) {
        const progress = i / crossfadeSamples;
        // Curva Equal-Power Cosine / Sine
        const fadeIn = Math.sin(progress * (Math.PI / 2));
        const fadeOut = Math.cos(progress * (Math.PI / 2));

        const sampleFromStart = srcData[i];
        const sampleFromEnd = srcData[originalEndStart + i];

        destData[fadeStart + i] = (sampleFromStart * fadeIn) + (sampleFromEnd * fadeOut);
      }
    }

    return resultBuffer;
  }

  private async createChannel(channelId: string, type: string, initialVol: number, isMuted: boolean, fileUrl?: string) {
    if (!this.ctx || !this.masterGain) return;
    if (this.channels.has(channelId)) return;

    const gainNode = this.ctx.createGain();
    const effectiveVol = isMuted ? 0 : initialVol;
    gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    gainNode.connect(this.masterGain);

    const record: ChannelRecord = {
      id: channelId,
      gain: gainNode,
      nodes: [],
      isLoading: true,
      targetVolume: effectiveVol,
      isMuted: isMuted
    };

    this.channels.set(channelId, record);

    if (fileUrl) {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const rawAudioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

        if (record.targetVolume === 0 || record.isMuted) {
          record.isLoading = false;
          return;
        }

        // Genera bucle procesado con Crossfade Equal-Power de 1.5 segundos
        const seamlessLoopBuffer = this.makeCrossfadedLoopBuffer(rawAudioBuffer, 1.5);

        const sourceNode = this.ctx.createBufferSource();
        sourceNode.buffer = seamlessLoopBuffer;
        sourceNode.loop = true;

        sourceNode.connect(gainNode);
        sourceNode.start(0);

        record.sourceNode = sourceNode;
        record.audioBuffer = seamlessLoopBuffer;
        record.nodes.push(sourceNode);
        record.isLoading = false;

        record.cleanup = () => {
          try { sourceNode.stop(); sourceNode.disconnect(); } catch (e) {}
        };
      } catch (err) {
        console.error(`Error loading WebAudio sample ${fileUrl}:`, err);
        record.isLoading = false;
      }
    } else {
      // Procedural noise synthesis
      switch (type) {
        case 'pink_noise': {
          const buffer = this.generatePinkNoiseBuffer(3);
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(gainNode);
          src.start();
          record.nodes.push(src);
          record.sourceNode = src;
          break;
        }
        case 'white_noise': {
          const buffer = this.generateWhiteNoiseBuffer(3);
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(gainNode);
          src.start();
          record.nodes.push(src);
          record.sourceNode = src;
          break;
        }
        default: {
          const buffer = this.generatePinkNoiseBuffer(4);
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(gainNode);
          src.start();
          record.nodes.push(src);
          record.sourceNode = src;
          break;
        }
      }
      record.isLoading = false;
    }
  }

  private generatePinkNoiseBuffer(durationSeconds: number): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private generateWhiteNoiseBuffer(durationSeconds: number): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    return buffer;
  }
}

export const audioEngine = new WebAudioEngine();
