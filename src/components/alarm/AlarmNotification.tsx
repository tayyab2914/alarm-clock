import { useState, useEffect } from "react";
import { Alarm } from "@/types/alarm";
import { Button } from "@/components/ui/button";
import { ConnectDotsGame } from "./ConnectDotsGame";
import { useAlarmSound } from "@/hooks/useAlarmSound";
import { Bell, X } from "lucide-react";

interface AlarmNotificationProps {
  alarm: Alarm;
  onDismiss: () => void;
  onSnooze: () => void;
}

export function AlarmNotification({
  alarm,
  onDismiss,
  onSnooze,
}: AlarmNotificationProps) {
  const [showPuzzle, setShowPuzzle] = useState(false);
  const { startSound, stopSound } = useAlarmSound();

  useEffect(() => {
    startSound();
    return () => stopSound();
  }, [startSound, stopSound]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handlePuzzleComplete = () => {
    stopSound();
    onSnooze();
  };

  const handleDismiss = () => {
    stopSound();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8 max-w-md w-full">
        {!showPuzzle ? (
          <>
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Bell className="w-12 h-12 text-primary" />
            </div>

            <div className="text-center">
              <h2 className="text-5xl font-light tabular-nums mb-2">
                {formatTime(alarm.time)}
              </h2>
              {alarm.label && (
                <p className="text-xl text-muted-foreground">{alarm.label}</p>
              )}
            </div>

            <p className="text-muted-foreground text-center">
              Time to wake up!
            </p>

            <div className="flex flex-col gap-3 w-full">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowPuzzle(true)}
                className="w-full"
              >
                Snooze (5 min)
              </Button>
              <Button
                size="lg"
                onClick={handleDismiss}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Dismiss
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-medium">Complete to Snooze</h2>
            <ConnectDotsGame onComplete={handlePuzzleComplete} />
            <Button
              variant="ghost"
              onClick={() => setShowPuzzle(false)}
              className="mt-4"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
