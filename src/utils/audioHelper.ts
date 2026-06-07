/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioHelper {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio API not supported on this device.', e);
      }
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.1) {
    this.init();
    if (!this.ctx || !this.enabled) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Single hit
  public throwHit(multiplier: number = 1) {
    if (multiplier === 3) {
      // Triple hit: quick high-toned triplet
      this.playTone(880, 0.1, 'sine');
      setTimeout(() => this.playTone(1046.5, 0.1, 'sine'), 80);
      setTimeout(() => this.playTone(1318.5, 0.15, 'sine'), 160);
    } else if (multiplier === 2) {
      // Double hit: medium-high double beep
      this.playTone(587.3, 0.1, 'triangle');
      setTimeout(() => this.playTone(1174.6, 0.15, 'triangle'), 80);
    } else {
      // Single hit: sweet clicky pop
      this.playTone(440, 0.08, 'sine');
    }
  }

  // Bust / Terlebih Skor
  public bust() {
    this.playTone(330, 0.15, 'sawtooth', 0.08);
    setTimeout(() => {
      this.playTone(220, 0.3, 'sawtooth', 0.08);
    }, 150);
  }

  // Win Leg / Match
  public win() {
    const scale = [523.3, 659.3, 784.0, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    scale.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'triangle', 0.12);
      }, idx * 120);
    });
  }

  // Reset or Switch Turn
  public turnSwitch() {
    this.playTone(659.3, 0.05, 'sine', 0.08);
    setTimeout(() => this.playTone(784.0, 0.05, 'sine', 0.08), 50);
  }
}

export const audio = new AudioHelper();
