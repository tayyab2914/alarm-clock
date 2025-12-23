import { useState, useEffect, useCallback } from "react";
import { ClockDisplay } from "@/components/alarm/ClockDisplay";
import { AlarmList } from "@/components/alarm/AlarmList";
import { AddAlarmDialog } from "@/components/alarm/AddAlarmDialog";
import { AlarmNotification } from "@/components/alarm/AlarmNotification";
import { useAlarms } from "@/hooks/useAlarms";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { Alarm } from "@/types/alarm";

const Index = () => {
  const {
    alarms,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    snoozeAlarm,
    isSnoozed,
    clearSnooze,
  } = useAlarms();
  const { timeForMatching } = useCurrentTime();
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [dismissedThisMinute, setDismissedThisMinute] = useState<Set<string>>(
    new Set()
  );

  // Check for alarms that should trigger
  useEffect(() => {
    if (activeAlarm) return; // Don't check if there's already an active alarm

    const matchingAlarm = alarms.find(
      (alarm) =>
        alarm.enabled &&
        alarm.time === timeForMatching &&
        !isSnoozed(alarm.id) &&
        !dismissedThisMinute.has(alarm.id)
    );

    if (matchingAlarm) {
      setActiveAlarm(matchingAlarm);
    }
  }, [alarms, timeForMatching, activeAlarm, isSnoozed, dismissedThisMinute]);

  // Clear dismissed alarms when minute changes
  useEffect(() => {
    setDismissedThisMinute(new Set());
  }, [timeForMatching]);

  const handleDismiss = useCallback(() => {
    if (activeAlarm) {
      setDismissedThisMinute((prev) => new Set(prev).add(activeAlarm.id));
      clearSnooze(activeAlarm.id);
      setActiveAlarm(null);
    }
  }, [activeAlarm, clearSnooze]);

  const handleSnooze = useCallback(() => {
    if (activeAlarm) {
      snoozeAlarm(activeAlarm.id, 5);
      setActiveAlarm(null);
    }
  }, [activeAlarm, snoozeAlarm]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-4 py-8">
        <ClockDisplay />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Alarms</h2>
            <AddAlarmDialog onAdd={addAlarm} />
          </div>

          <AlarmList
            alarms={alarms}
            onToggle={toggleAlarm}
            onDelete={removeAlarm}
          />
        </div>
      </div>

      {activeAlarm && (
        <AlarmNotification
          alarm={activeAlarm}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  );
};

export default Index;
