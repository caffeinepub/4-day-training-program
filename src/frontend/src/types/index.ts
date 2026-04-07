export enum RepType {
  reps = "reps",
  timed = "timed",
  amrap = "amrap",
}

export interface Exercise {
  id: string;
  name: string;
  sets: bigint;
  reps: string;
  repType: RepType;
  notes: string;
}

export interface MovementPattern {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  id: bigint;
  name: string;
  patterns: MovementPattern[];
}

export interface ExerciseSelection {
  patternId: string;
  exerciseId: string;
}

export interface WorkoutLog {
  id: string;
  dayId: bigint;
  completedAt: bigint;
  selectedExercises: ExerciseSelection[];
}
