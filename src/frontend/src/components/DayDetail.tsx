import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronDown, Loader2, Weight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogWorkout } from "../hooks/useQueries";
import { useWeightJournal } from "../hooks/useWeightJournal";
import { RepType } from "../types";
import type { Exercise, WorkoutDay } from "../types";
import { RestTimer } from "./RestTimer";

interface DayDetailProps {
  day: WorkoutDay;
  onBack: () => void;
}

function formatReps(exercise: Exercise): string {
  const setsNum = Number(exercise.sets);
  if (exercise.repType === RepType.amrap) {
    return `${setsNum}xAMRAP`;
  }
  if (exercise.repType === RepType.timed) {
    return `${setsNum}x${exercise.reps}sec`;
  }
  return `${setsNum}x${exercise.reps}`;
}

const markerIds = ["1", "2", "3"] as const;

export function DayDetail({ day, onBack }: DayDetailProps) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const pattern of day.patterns) {
      if (pattern.exercises.length > 0) {
        initial[pattern.id] = pattern.exercises[0].id;
      }
    }
    return initial;
  });
  const [done, setDone] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>(
    {},
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  // weight inputs: keyed by exerciseId -> string input value
  const [weightInputs, setWeightInputs] = useState<Record<string, string>>({});
  const [savedWeights, setSavedWeights] = useState<Record<string, boolean>>({});

  const logWorkout = useLogWorkout();
  const { addEntry } = useWeightJournal();

  const handleSelectExercise = (patternId: string, exerciseId: string) => {
    setSelected((prev) => ({ ...prev, [patternId]: exerciseId }));
    setHasInteracted(true);
  };

  const handleSaveWeight = (exercise: Exercise) => {
    const raw = weightInputs[exercise.id];
    const parsed = Number.parseFloat(raw ?? "");
    if (!raw || Number.isNaN(parsed) || parsed <= 0) {
      toast.error("Įveskite teisingą svorį");
      return;
    }
    addEntry(exercise.id, exercise.name, parsed);
    setSavedWeights((prev) => ({ ...prev, [exercise.id]: true }));
    toast.success(`${exercise.name}: ${parsed} kg išsaugota`);
    // Reset saved indicator after 2s
    setTimeout(() => {
      setSavedWeights((prev) => ({ ...prev, [exercise.id]: false }));
    }, 2000);
  };

  const handleComplete = async () => {
    const pairs: Array<[string, string]> = Object.entries(selected).map(
      ([patternId, exerciseId]) => [patternId, exerciseId],
    );
    try {
      await logWorkout.mutateAsync({ dayId: day.id, selectedExercises: pairs });
      setDone(true);
    } catch {
      toast.error("Nepavyko išsaugoti treniruotės");
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center"
        data-ocid="day_detail.success_state"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 shadow-glow"
        >
          <Check
            className="w-10 h-10 text-primary-foreground"
            strokeWidth={3}
          />
        </motion.div>
        <h2 className="font-display text-3xl font-black text-foreground mb-2">
          Puiku!
        </h2>
        <p className="text-muted-foreground mb-2">
          {day.name} treniruotė užbaigta
        </p>
        <p className="text-xs text-muted-foreground mb-8">Įrašyta į istoriją</p>
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-xl border-border/60"
        >
          Grįžti į programą
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="pb-32">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border/30 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="day_detail.back_button"
          className="w-9 h-9 rounded-xl bg-card flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Treniruotė
          </p>
          <h1 className="font-display font-bold text-lg leading-tight">
            {day.name}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {day.patterns.map((pattern, pIdx) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pIdx * 0.06 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 rounded-full bg-primary" />
              <h3 className="font-display font-bold text-base text-foreground">
                {pattern.name}
              </h3>
              <span className="text-xs text-muted-foreground ml-auto">
                Pasirink pratimą
              </span>
            </div>

            <div className="space-y-2">
              {pattern.exercises.map((exercise, eIdx) => {
                const isSelected = selected[pattern.id] === exercise.id;
                const noteKey = `${pattern.id}-${exercise.id}`;
                const noteExpanded = expandedNotes[noteKey];
                const weightSaved = savedWeights[exercise.id];

                return (
                  <div key={exercise.id}>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        handleSelectExercise(pattern.id, exercise.id)
                      }
                      data-ocid={`day_detail.exercise_option.${markerIds[eIdx] ?? eIdx + 1}`}
                      className={`w-full text-left rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary/60 bg-primary/10 shadow-glow-sm"
                          : "border-border/50 bg-card hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-full h-full rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {exercise.name}
                            </span>
                            <span
                              className={`text-xs font-black tracking-tight flex-shrink-0 font-display ${
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatReps(exercise)}
                            </span>
                          </div>
                          {exercise.notes && (
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedNotes((prev) => ({
                                    ...prev,
                                    [noteKey]: !prev[noteKey],
                                  }));
                                }}
                                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                              >
                                <span>Pastaba</span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform ${noteExpanded ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence>
                                {noteExpanded && (
                                  <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="text-xs text-muted-foreground mt-1 italic overflow-hidden"
                                  >
                                    {exercise.notes}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>

                    {/* Weight input — only visible when this exercise is selected */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1.5 ml-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/60 border border-border/30">
                            <Weight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <label
                              htmlFor={`weight-${exercise.id}`}
                              className="text-xs text-muted-foreground whitespace-nowrap"
                            >
                              Įrašyti svorį
                            </label>
                            <div className="flex items-center gap-1.5 flex-1">
                              <input
                                id={`weight-${exercise.id}`}
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0"
                                value={weightInputs[exercise.id] ?? ""}
                                onChange={(e) =>
                                  setWeightInputs((prev) => ({
                                    ...prev,
                                    [exercise.id]: e.target.value,
                                  }))
                                }
                                data-ocid="day_detail.weight_input"
                                className="w-16 text-sm font-semibold bg-transparent border-b border-border/50 focus:border-primary outline-none text-right text-foreground placeholder:text-muted-foreground/40 transition-colors pb-0.5"
                              />
                              <span className="text-xs text-muted-foreground">
                                kg
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSaveWeight(exercise)}
                              data-ocid="day_detail.weight_save_button"
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                                weightSaved
                                  ? "bg-primary/20 text-primary"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                              }`}
                            >
                              {weightSaved ? "✓" : "Išsaugoti"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating rest timer - appears after first exercise interaction */}
      <RestTimer visible={hasInteracted && !done} />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="max-w-[480px] mx-auto pointer-events-auto">
          <Button
            onClick={handleComplete}
            disabled={logWorkout.isPending}
            data-ocid="day_detail.complete_button"
            className="w-full h-14 rounded-2xl font-display font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all"
          >
            {logWorkout.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saugoma...
              </>
            ) : (
              "✓ Treniruotė Atlikta"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
