import { useCurrentTime } from "@/hooks/useCurrentTime";

export function ClockDisplay() {
  const { formattedTime, formattedDate } = useCurrentTime();

  return (
    <div className="text-center py-12">
      <h1 className="text-7xl md:text-8xl font-light tracking-tight text-foreground tabular-nums">
        {formattedTime}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{formattedDate}</p>
    </div>
  );
}
