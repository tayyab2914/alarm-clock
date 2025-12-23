import { useRef, useCallback } from "react";

export function useAlarmSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startSound = useCallback(() => {
    if (audioContextRef.current) return;

    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.3;

    const playBeep = () => {
      if (!audioContextRef.current || !gainNodeRef.current) return;

      const osc = audioContextRef.current.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 880;
      osc.connect(gainNodeRef.current);
      osc.start();
      osc.stop(audioContextRef.current.currentTime + 0.15);
    };

    // Play initial beep
    playBeep();

    // Repeat every 800ms
    intervalRef.current = window.setInterval(playBeep, 800);
  }, []);

  const stopSound = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Oscillator already stopped
      }
      oscillatorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    gainNodeRef.current = null;
  }, []);

  return { startSound, stopSound };
}
