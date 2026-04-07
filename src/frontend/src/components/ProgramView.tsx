import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  Dumbbell,
  Flame,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import type { WorkoutDay, WorkoutLog } from "../types";

interface ProgramViewProps {
  days: WorkoutDay[];
  logs: WorkoutLog[];
  isLoading: boolean;
  onDaySelect: (day: WorkoutDay) => void;
}

const dayColors = [
  "from-primary/20 to-primary/5",
  "from-primary/15 to-primary/5",
  "from-primary/10 to-primary/5",
  "from-primary/12 to-primary/3",
];

const dayAccents = [
  "text-primary",
  "text-primary",
  "text-primary",
  "text-primary",
];

const dayBorders = [
  "border-primary/40",
  "border-primary/30",
  "border-primary/25",
  "border-primary/20",
];

function calcStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;
  const daySet = new Set(
    logs.map((l) => {
      const ms = Number(l.completedAt / 1_000_000n);
      const d = new Date(ms);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (daySet.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function calcMostFrequentDay(
  logs: WorkoutLog[],
  days: WorkoutDay[],
): string | null {
  if (logs.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const log of logs) {
    const key = log.dayId.toString();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  let maxId = "";
  let maxCount = 0;
  for (const [id, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxId = id;
    }
  }
  const day = days.find((d) => d.id.toString() === maxId);
  return day?.name ?? null;
}

export function ProgramView({
  days,
  logs,
  isLoading,
  onDaySelect,
}: ProgramViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-28 w-full rounded-xl"
            data-ocid="program.loading_state"
          />
        ))}
      </div>
    );
  }

  const streak = calcStreak(logs);
  const totalWorkouts = logs.length;
  const mostFrequent = calcMostFrequentDay(logs, days);

  return (
    <div className="p-4 space-y-3 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
          4 dienų programa
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground mt-1">
          Treniruočių
          <br />
          Programa
        </h1>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-3 gap-2 mb-2"
        data-ocid="program.stats_section"
      >
        <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
          <Flame className="w-4 h-4 text-primary" />
          <span className="font-display font-black text-xl text-foreground leading-none">
            {streak}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
            dienų iš eilės
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-display font-black text-xl text-foreground leading-none">
            {totalWorkouts}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
            treniruotės
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span
            className="font-display font-black text-sm text-foreground leading-none text-center truncate w-full px-1"
            title={mostFrequent ?? "–"}
          >
            {mostFrequent ? mostFrequent.split(" ")[0] : "–"}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
            mėgstamiausia
          </span>
        </div>
      </motion.div>

      {days.map((day, index) => (
        <motion.button
          key={day.id.toString()}
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 + index * 0.07 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDaySelect(day)}
          data-ocid={`program.day_card.${index + 1}`}
          className={`w-full text-left rounded-2xl border ${dayBorders[index]} bg-gradient-to-br ${dayColors[index]} p-5 transition-all hover:shadow-glow-sm active:scale-[0.98]`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center">
                <span
                  className={`font-display font-black text-lg ${dayAccents[index]}`}
                >
                  {index + 1}
                </span>
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${dayAccents[index]}`}
                >
                  Diena
                </span>
                <h2 className="font-display font-bold text-lg text-foreground leading-tight">
                  {day.name}
                </h2>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {day.patterns.map((pattern) => (
              <span
                key={pattern.id}
                className="text-xs px-2.5 py-1 rounded-full bg-card/60 text-muted-foreground font-medium border border-border/50"
              >
                {pattern.name}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{day.patterns.length} judesių modeliai</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
