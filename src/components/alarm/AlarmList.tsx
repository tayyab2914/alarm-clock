import { Alarm } from "@/types/alarm";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AlarmList({ alarms, onToggle, onDelete }: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No alarms set</p>
        <p className="text-sm mt-1">Tap the + button to add one</p>
      </div>
    );
  }

  // Sort alarms by time
  const sortedAlarms = [...alarms].sort((a, b) => a.time.localeCompare(b.time));

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="space-y-3">
      {sortedAlarms.map((alarm) => (
        <div
          key={alarm.id}
          className={`flex items-center justify-between p-4 rounded-lg border bg-card transition-opacity ${
            !alarm.enabled ? "opacity-50" : ""
          }`}
        >
          <div className="flex-1">
            <p className="text-2xl font-light tabular-nums">
              {formatTime(alarm.time)}
            </p>
            {alarm.label && (
              <p className="text-sm text-muted-foreground mt-1">{alarm.label}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={alarm.enabled}
              onCheckedChange={() => onToggle(alarm.id)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(alarm.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
