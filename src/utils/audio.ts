/**
 * Clean Web Audio chime generator mimicking medical/airport paging systems
 * Uses harmonic oscillators and exponential decay envelopes.
 */
class HospitalAudioService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play standard hospital two-tone announcement chime (F5 -> A5)
   */
  public playChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) {
          resolve();
          return;
        }

        const now = ctx.currentTime;
        const tone1 = ctx.createOscillator();
        const tone2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        // Note 1: 523.25 Hz (C5)
        tone1.type = 'sine';
        tone1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        tone1.connect(gain1);
        gain1.connect(ctx.destination);
        tone1.start(now);
        tone1.stop(now + 0.5);

        // Note 2: 659.25 Hz (E5)
        tone2.type = 'sine';
        tone2.frequency.setValueAtTime(659.25, now + 0.22);
        gain2.gain.setValueAtTime(0.25, now + 0.22);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        tone2.connect(gain2);
        gain2.connect(ctx.destination);
        tone2.start(now + 0.22);
        tone2.stop(now + 0.85);

        setTimeout(() => resolve(), 700);
      } catch (err) {
        console.warn('Audio chime playback omitted:', err);
        resolve();
      }
    });
  }

  /**
   * Announce patient token and counter via Web Speech Synthesis
   */
  public announceToken(tokenNumber: string, counterOrRoom: string = 'Counter 1', enableVoice: boolean = true) {
    this.playChime().then(() => {
      if (!enableVoice || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Format speech text: "Now calling Token M Q 1 0 2 to Room 1 0 2"
      const formattedToken = tokenNumber.split('').join(' ');
      const text = `Attention please. Token ${formattedToken}, please proceed to ${counterOrRoom}.`;

      window.speechSynthesis.cancel(); // Stop any pending utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Clear and measured hospital paging cadence
      utterance.pitch = 1.05;
      utterance.volume = 0.9;

      // Prefer a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const hospitalAudio = new HospitalAudioService();
