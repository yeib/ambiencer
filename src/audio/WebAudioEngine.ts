// Web Audio API Procedural Sound Engine — 100% Offline & Zero Asset Dependencies
import { FrequencyGeneratorState } from '../types';

class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private channels: Map<string, { gain: GainNode; nodes: any[]; cleanup?: () => void }> = new Map();
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

    // Create frequency nodes if not exist
    if (!this.freqGainNode) {
      this.freqGainNode = this.ctx.createGain();
      this.freqFilter = this.ctx.createBiquadFilter();
      this.freqFilter.type = 'lowpass';
      this.freqFilter.frequency.value = 1400; // Keep tone smooth & soothing

      this.freqGainNode.connect(this.freqFilter);
      this.freqFilter.connect(this.masterGain);
    }

    this.freqGainNode.gain.setTargetAtTime(state.volume, now, 0.05);

    // Stop old oscillators if parameters change drastically
    if (this.freqOscL) {
      try { this.freqOscL.stop(); this.freqOscL.disconnect(); } catch (e) {}
    }
    if (this.freqOscR) {
      try { this.freqOscR.stop(); this.freqOscR.disconnect(); } catch (e) {}
    }

    const carrier = state.carrierFreq;
    const beat = state.mode === 'binaural' ? state.beatFreq : 0;
    const waveType = state.waveform;

    // Left Channel = Carrier
    this.freqOscL = this.ctx.createOscillator();
    this.freqOscL.type = waveType;
    this.freqOscL.frequency.setValueAtTime(carrier, now);

    // Right Channel = Carrier + Beat Frequency
    this.freqOscR = this.ctx.createOscillator();
    this.freqOscR.type = waveType;
    this.freqOscR.frequency.setValueAtTime(carrier + beat, now);

    const merger = this.ctx.createChannelMerger(2);
    this.freqOscL.connect(merger, 0, 0); // Left
    this.freqOscR.connect(merger, 0, 1); // Right

    merger.connect(this.freqGainNode);

    this.freqOscL.start(now);
    this.freqOscR.start(now);
  }

  // --- Sound Channel Controls ---
  public updateChannelVolume(channelId: string, vol: number, isMuted: boolean, type: string) {
    if (!this.ctx) this.init();
    const effectiveVol = isMuted ? 0 : vol;

    let ch = this.channels.get(channelId);
    if (!ch) {
      if (effectiveVol > 0) {
        this.createChannel(channelId, type, effectiveVol);
      }
    } else {
      ch.gain.gain.setTargetAtTime(effectiveVol, this.ctx?.currentTime || 0, 0.05);
    }
  }

  private createChannel(channelId: string, type: string, initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = initialVol;
    gainNode.connect(this.masterGain);

    const activeNodes: any[] = [];
    let cleanupFunc: (() => void) | undefined = undefined;

    switch (type) {
      case 'pink_noise': {
        const buffer = this.generatePinkNoiseBuffer(3);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        src.connect(gainNode);
        src.start();
        activeNodes.push(src);
        break;
      }
      case 'white_noise': {
        const buffer = this.generateWhiteNoiseBuffer(3);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        src.connect(gainNode);
        src.start();
        activeNodes.push(src);
        break;
      }
      case 'rain': {
        const buffer = this.generatePinkNoiseBuffer(5);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        src.connect(filter);
        filter.connect(gainNode);
        src.start();
        activeNodes.push(src, filter);
        break;
      }
      case 'thunder': {
        const buffer = this.generateBrownNoiseBuffer(5);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        src.connect(filter);
        filter.connect(gainNode);
        src.start();

        let isThundering = true;
        const triggerThunderRumble = () => {
          if (!isThundering || !this.ctx) return;
          const osc = this.ctx.createOscillator();
          const rumbleGain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(45 + Math.random() * 30, this.ctx.currentTime);
          rumbleGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
          rumbleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);
          osc.connect(rumbleGain);
          rumbleGain.connect(gainNode);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.8);
          setTimeout(triggerThunderRumble, Math.random() * 4000 + 3000);
        };
        triggerThunderRumble();
        cleanupFunc = () => { isThundering = false; };
        activeNodes.push(src, filter);
        break;
      }
      case 'waves': {
        const buffer = this.generatePinkNoiseBuffer(6);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.12;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 400;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        src.connect(filter);
        filter.connect(gainNode);
        src.start();
        lfo.start();
        activeNodes.push(src, filter, lfo, lfoGain);
        break;
      }
      case 'wind': {
        const buffer = this.generatePinkNoiseBuffer(5);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 2.0;
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 350;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        src.connect(filter);
        filter.connect(gainNode);
        src.start();
        lfo.start();
        activeNodes.push(src, filter, lfo, lfoGain);
        break;
      }
      case 'fire': {
        const buffer = this.generateBrownNoiseBuffer(4);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 900;
        src.connect(filter);
        filter.connect(gainNode);
        src.start();

        let isCracking = true;
        const triggerCrackle = () => {
          if (!isCracking || !this.ctx) return;
          const osc = this.ctx.createOscillator();
          const crackleGain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = 800 + Math.random() * 2000;
          crackleGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
          crackleGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
          osc.connect(crackleGain);
          crackleGain.connect(gainNode);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.03);
          setTimeout(triggerCrackle, Math.random() * 150 + 50);
        };
        triggerCrackle();
        cleanupFunc = () => { isCracking = false; };
        activeNodes.push(src, filter);
        break;
      }
      case 'keyboard': {
        let isTyping = true;
        const triggerClick = () => {
          if (!isTyping || !this.ctx) return;
          const osc = this.ctx.createOscillator();
          const clickGain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(400 + Math.random() * 600, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);
          clickGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
          clickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
          osc.connect(clickGain);
          clickGain.connect(gainNode);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.04);
          const delay = Math.random() < 0.2 ? Math.random() * 400 + 200 : Math.random() * 120 + 80;
          setTimeout(triggerClick, delay);
        };
        triggerClick();
        cleanupFunc = () => { isTyping = false; };
        break;
      }
      default: {
        const buffer = this.generatePinkNoiseBuffer(4);
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        src.connect(gainNode);
        src.start();
        activeNodes.push(src);
        break;
      }
    }

    this.channels.set(channelId, { gain: gainNode, nodes: activeNodes, cleanup: cleanupFunc });
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

  private generateBrownNoiseBuffer(durationSeconds: number): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOutput = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOutput + (0.02 * white)) / 1.02;
      lastOutput = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }
}

export const audioEngine = new WebAudioEngine();
