import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Dumbbell, Star, Target, Trash2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteWorkoutLog } from "../hooks/useQueries";
import type { WorkoutDay, WorkoutLog } from "../types";

interface HistoryViewProps {
  logs: WorkoutLog[];
  days: WorkoutDay[];
  isLoading: boolean;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getThisWeekCount(logs: WorkoutLog[]): number {
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  const mondayMs = monday.getTime();
  return logs.filter((l) => Number(l.completedAt / 1_000_000n) >= mondayMs)
    .length;
}

function getMostFrequentDay(
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
  const found = days.find((d) => d.id.toString() === maxId);
  return found?.name ?? null;
}

export function HistoryView({ logs, days, isLoading }: HistoryViewProps) {
  const deleteLog = useDeleteWorkoutLog();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedLogs = [...logs].sort((a, b) =>
    Number(b.completedAt - a.completedAt),
  );

  const getDayName = (dayId: bigint): string => {
    const day = days.find((d) => d.id === dayId);
    return day?.name ?? `Diena ${dayId}`;
  };

  const getExerciseNames = (log: WorkoutLog): string[] => {
    const names: string[] = [];
    for (const sel of log.selectedExercises) {
      for (const day of days) {
        for (const pattern of day.patterns) {
          const exercise = pattern.exercises.find(
            (e) => e.id === sel.exerciseId,
          );
          if (exercise) {
            names.push(exercise.name);
          }
        }
      }
    }
    return names;
  };

  const handleDelete = async (logId: string) => {
    setDeletingId(logId);
    try {
      await deleteLog.mutateAsync(logId);
      toast.success("Įrašas ištrintas");
    } catch {
      toast.error("Nepavyko ištrinti");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-32 w-full rounded-xl"
            data-ocid="history.loading_state"
          />
        ))}
      </div>
    );
  }

  const thisWeek = getThisWeekCount(logs);
  const mostFrequent = getMostFrequentDay(logs, days);

  return (
    <div className="p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
          Atliktos treniruotės
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground mt-1">
          Istorija
        </h1>
      </motion.div>

      {/* Stats summary - only when logs exist */}
      {logs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-3 gap-2 mb-5"
          data-ocid="history.stats_section"
        >
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-display font-black text-xl text-foreground leading-none">
              {logs.length}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
              iš viso
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-display font-black text-xl text-foreground leading-none">
              {thisWeek}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
              šią savaitę
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-card border border-border/50 py-3 px-2">
            <Star className="w-4 h-4 text-orange-400" />
            <span
              className="font-display font-black text-sm text-foreground leading-none text-center truncate w-full px-1"
              title={mostFrequent ?? "–"}
            >
              {mostFrequent ? mostFrequent.split(" ")[0] : "–"}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
              dažniausia
            </span>
          </div>
        </motion.div>
      )}

      {sortedLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="history.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-1">
            Dar nėra įrašų
          </h3>
          <p className="text-sm text-muted-foreground">
            Atlik pirmą treniruotę ir ji atsiras čia
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3" data-ocid="history.list">
          <AnimatePresence>
            {sortedLogs.map((log, index) => {
              const exerciseNames = getExerciseNames(log);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  data-ocid={`history.item.${index + 1}`}
                  className="bg-card border border-border/50 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base text-foreground">
                        {getDayName(log.dayId)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(log.completedAt)}
                        </span>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`history.delete_button.${index + 1}`}
                          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="rounded-2xl max-w-[320px] mx-auto"
                        data-ocid="history.dialog"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">
                            Ištrinti įrašą?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Šis veiksmas negrįžtamas. Treniruotės istorija bus
                            ištrinta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            data-ocid="history.cancel_button"
                            className="rounded-xl"
                          >
                            Atšaukti
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(log.id)}
                            data-ocid="history.confirm_button"
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingId === log.id}
                          >
                            Ištrinti
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {exerciseNames.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exerciseNames.map((name) => (
                        <span
                          key={name}
                          className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/40"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
