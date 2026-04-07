import { Button } from "@/components/ui/button";
import { Dumbbell, Trash2, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { WeightEntry } from "../hooks/useWeightJournal";
import { useWeightJournal } from "../hooks/useWeightJournal";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("lt-LT", {
    month: "short",
    day: "numeric",
  });
}

function ProgressBar({
  entries,
}: {
  entries: WeightEntry[];
}) {
  if (entries.length === 0) return null;
  const max = Math.max(...entries.map((e) => e.weight));
  const min = Math.min(...entries.map((e) => e.weight));
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1 h-10 mt-2">
      {entries.map((entry, i) => {
        const pct = 20 + ((entry.weight - min) / range) * 80;
        const isLast = i === entries.length - 1;
        return (
          <motion.div
            key={entry.id}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            title={`${formatDate(entry.date)}: ${entry.weight} kg`}
            className={`flex-1 rounded-t-sm origin-bottom ${
              isLast ? "bg-primary" : "bg-primary/30"
            }`}
            style={{ height: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}

function ExerciseCard({
  name,
  entries,
  index,
  onDelete,
}: {
  name: string;
  entries: WeightEntry[];
  index: number;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const latest = entries[entries.length - 1];
  const first = entries[0];
  const improved = entries.length > 1 ? latest.weight - first.weight : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`weights.item.${index + 1}`}
      className="bg-card border border-border/50 rounded-2xl p-4"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm text-foreground leading-snug">
              {name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground">
                {entries.length} įrašas{entries.length !== 1 ? "ų" : ""}
              </span>
              {improved !== null && improved !== 0 && (
                <span
                  className={`text-xs font-semibold flex items-center gap-0.5 ${
                    improved > 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {improved > 0 ? "+" : ""}
                  {improved} kg
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display font-black text-xl text-primary leading-none">
              {latest.weight}
              <span className="text-xs font-normal text-muted-foreground ml-0.5">
                kg
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatDate(latest.date)}
            </p>
          </div>
        </div>

        {/* Mini bar chart */}
        {entries.length > 1 && <ProgressBar entries={entries} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
              {[...entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {entry.weight} kg
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }}
                      data-ocid="weights.delete_button"
                      className="w-6 h-6 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WeightJournal() {
  const { byExercise, deleteEntry } = useWeightJournal();
  const exerciseNames = Object.keys(byExercise).sort();

  return (
    <div className="p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
          Progreso sekimas
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground mt-1">
          Svorių žurnalas
        </h1>
      </motion.div>

      {exerciseNames.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="weights.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-1">
            Dar nėra svorių
          </h3>
          <p className="text-sm text-muted-foreground max-w-[220px]">
            Treniruotės metu įrašyk svorį prie pasirinkto pratimo
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3" data-ocid="weights.list">
          <AnimatePresence>
            {exerciseNames.map((name, i) => (
              <ExerciseCard
                key={name}
                name={name}
                entries={byExercise[name]}
                index={i}
                onDelete={deleteEntry}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
