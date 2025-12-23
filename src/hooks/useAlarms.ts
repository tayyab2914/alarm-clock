import { useState, useEffect, useCallback } from "react";
import { Alarm } from "@/types/alarm";

const STORAGE_KEY = "alarm-clock-alarms";
const SNOOZE_KEY = "alarm-clock-snooze";

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [snoozedAlarms, setSnoozedAlarms] = useState<Map<string, number>>(() => {
    const stored = localStorage.getItem(SNOOZE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed).map(([k, v]) => [k, v as number]));
    }
    return new Map();
  });

  // Persist alarms to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  // Persist snoozed alarms to localStorage
  useEffect(() => {
    const obj = Object.fromEntries(snoozedAlarms);
    localStorage.setItem(SNOOZE_KEY, JSON.stringify(obj));
  }, [snoozedAlarms]);

  const addAlarm = useCallback((time: string, label?: string) => {
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      time,
      enabled: true,
      label,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    setSnoozedAlarms((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  }, []);

  const snoozeAlarm = useCallback((id: string, minutes: number = 5) => {
    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    setSnoozedAlarms((prev) => new Map(prev).set(id, snoozeUntil));
  }, []);

  const isSnoozed = useCallback(
    (id: string) => {
      const snoozeUntil = snoozedAlarms.get(id);
      if (!snoozeUntil) return false;
      if (Date.now() >= snoozeUntil) {
        // Snooze expired, clean up
        setSnoozedAlarms((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        return false;
      }
      return true;
    },
    [snoozedAlarms]
  );

  const clearSnooze = useCallback((id: string) => {
    setSnoozedAlarms((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return {
    alarms,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    snoozeAlarm,
    isSnoozed,
    clearSnooze,
  };
}
