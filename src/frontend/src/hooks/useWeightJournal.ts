import { useCallback, useEffect, useState } from "react";

export interface WeightEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  unit: "kg";
  date: string; // ISO string
}

const STORAGE_KEY = "weight_journal";

function loadEntries(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WeightEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: WeightEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useWeightJournal() {
  const [entries, setEntries] = useState<WeightEntry[]>(loadEntries);

  // Sync across tabs
  useEffect(() => {
    const handler = () => setEntries(loadEntries());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addEntry = useCallback(
    (exerciseId: string, exerciseName: string, weight: number) => {
      const entry: WeightEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        exerciseId,
        exerciseName,
        weight,
        unit: "kg",
        date: new Date().toISOString(),
      };
      setEntries((prev) => {
        const next = [...prev, entry];
        saveEntries(next);
        return next;
      });
      return entry;
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEntries(next);
      return next;
    });
  }, []);

  // Group by exercise name
  const byExercise = entries.reduce(
    (acc, entry) => {
      const key = entry.exerciseName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {} as Record<string, WeightEntry[]>,
  );

  // Sort each group by date ascending
  for (const key of Object.keys(byExercise)) {
    byExercise[key].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  return { entries, byExercise, addEntry, deleteEntry };
}
