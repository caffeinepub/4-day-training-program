import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkoutDay, WorkoutLog } from "../types";
import { RepType } from "../types";

// ─── Static program data (stored locally) ───────────────────────────────────

const PROGRAM: WorkoutDay[] = [
  {
    id: 1n,
    name: "Hinge & Vertical Press",
    patterns: [
      {
        id: "d1-hinge",
        name: "Hinge",
        exercises: [
          {
            id: "d1-e1",
            name: "Dumbbell RDL",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e2",
            name: "Barbell RDL",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e3",
            name: "Snatch Grip RDL",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d1-vpress",
        name: "Vertical Press",
        exercises: [
          {
            id: "d1-e4",
            name: "½ Kneeling DB Single Arm Overhead Press",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e5",
            name: "½ Kneeling Landmine Press",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e6",
            name: "Tall Kneeling Enhanced Eccentric Landmine Press",
            sets: 3n,
            reps: "6",
            repType: RepType.reps,
            notes: "Down phase 4-5 seconds",
          },
        ],
      },
      {
        id: "d1-hpull",
        name: "Horizontal Pull",
        exercises: [
          {
            id: "d1-e7",
            name: "DB Incline Chest Supported Row",
            sets: 3n,
            reps: "15",
            repType: RepType.reps,
            notes: "Bench no higher than 45 degrees",
          },
          {
            id: "d1-e8",
            name: "DB Seal Row",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e9",
            name: "Pendlay Row",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "Bar should rest on ground between reps",
          },
        ],
      },
      {
        id: "d1-lunge",
        name: "Lunge",
        exercises: [
          {
            id: "d1-e10",
            name: "Dumbbell Split Squat",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e11",
            name: "Dumbbell Walking Lunge",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d1-e12",
            name: "Dumbbell Deficit Reverse Lunge",
            sets: 3n,
            reps: "6",
            repType: RepType.reps,
            notes: "Keep weight through lead leg",
          },
        ],
      },
      {
        id: "d1-anterior",
        name: "Anterior Chain",
        exercises: [
          {
            id: "d1-e13",
            name: "Hanging Hollow Body",
            sets: 3n,
            reps: "30",
            repType: RepType.timed,
            notes: "Pull hips to ribs",
          },
          {
            id: "d1-e14",
            name: "Hanging Knee Tuck",
            sets: 3n,
            reps: "AMRAP",
            repType: RepType.amrap,
            notes: "Pull hips to ribs",
          },
          {
            id: "d1-e15",
            name: "Toes to Bar",
            sets: 3n,
            reps: "AMRAP",
            repType: RepType.amrap,
            notes: "Control down phase and swinging",
          },
        ],
      },
    ],
  },
  {
    id: 2n,
    name: "Squat & Horizontal Press",
    patterns: [
      {
        id: "d2-squat",
        name: "Squat",
        exercises: [
          {
            id: "d2-e1",
            name: "Goblet Squat",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e2",
            name: "Front Squat",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e3",
            name: "Back Squat",
            sets: 3n,
            reps: "6",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d2-hpress",
        name: "Horizontal Press",
        exercises: [
          {
            id: "d2-e4",
            name: "DB Bench Press",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e5",
            name: "Barbell Bench Press",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e6",
            name: "Landmine Press",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d2-vpull",
        name: "Vertical Pull",
        exercises: [
          {
            id: "d2-e7",
            name: "Lat Pulldown",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e8",
            name: "Assisted Pull-Up",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e9",
            name: "Pull-Up",
            sets: 3n,
            reps: "AMRAP",
            repType: RepType.amrap,
            notes: "Full range of motion",
          },
        ],
      },
      {
        id: "d2-hip",
        name: "Hip Extension",
        exercises: [
          {
            id: "d2-e10",
            name: "Hip Thrust",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e11",
            name: "Single Leg Hip Thrust",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e12",
            name: "Nordic Hamstring Curl",
            sets: 3n,
            reps: "6",
            repType: RepType.reps,
            notes: "Eccentric focus",
          },
        ],
      },
      {
        id: "d2-core",
        name: "Core",
        exercises: [
          {
            id: "d2-e13",
            name: "Dead Bug",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e14",
            name: "Pallof Press",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d2-e15",
            name: "Ab Wheel Rollout",
            sets: 3n,
            reps: "AMRAP",
            repType: RepType.amrap,
            notes: "Control return phase",
          },
        ],
      },
    ],
  },
  {
    id: 3n,
    name: "Single Leg & Carry",
    patterns: [
      {
        id: "d3-singleleg",
        name: "Single Leg",
        exercises: [
          {
            id: "d3-e1",
            name: "Bulgarian Split Squat",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e2",
            name: "Step Up",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e3",
            name: "Single Leg RDL",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "Keep hips level",
          },
        ],
      },
      {
        id: "d3-push",
        name: "Push",
        exercises: [
          {
            id: "d3-e4",
            name: "Push-Up",
            sets: 3n,
            reps: "15",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e5",
            name: "DB Overhead Press",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e6",
            name: "Pike Push-Up",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d3-pull",
        name: "Pull",
        exercises: [
          {
            id: "d3-e7",
            name: "TRX Row",
            sets: 3n,
            reps: "12",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e8",
            name: "Cable Row",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d3-e9",
            name: "Face Pull",
            sets: 3n,
            reps: "15",
            repType: RepType.reps,
            notes: "External rotation emphasis",
          },
        ],
      },
      {
        id: "d3-carry",
        name: "Carry",
        exercises: [
          {
            id: "d3-e10",
            name: "Farmer's Carry",
            sets: 3n,
            reps: "40",
            repType: RepType.timed,
            notes: "",
          },
          {
            id: "d3-e11",
            name: "Suitcase Carry",
            sets: 3n,
            reps: "30",
            repType: RepType.timed,
            notes: "Each side",
          },
          {
            id: "d3-e12",
            name: "Overhead Carry",
            sets: 3n,
            reps: "20",
            repType: RepType.timed,
            notes: "Keep core braced",
          },
        ],
      },
    ],
  },
  {
    id: 4n,
    name: "Power & Conditioning",
    patterns: [
      {
        id: "d4-power",
        name: "Power",
        exercises: [
          {
            id: "d4-e1",
            name: "Trap Bar Jump",
            sets: 3n,
            reps: "5",
            repType: RepType.reps,
            notes: "Maximal intent",
          },
          {
            id: "d4-e2",
            name: "Broad Jump",
            sets: 3n,
            reps: "5",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d4-e3",
            name: "Medicine Ball Slam",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d4-strength",
        name: "Strength",
        exercises: [
          {
            id: "d4-e4",
            name: "Trap Bar Deadlift",
            sets: 4n,
            reps: "5",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d4-e5",
            name: "Romanian Deadlift",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d4-e6",
            name: "Sumo Deadlift",
            sets: 3n,
            reps: "6",
            repType: RepType.reps,
            notes: "",
          },
        ],
      },
      {
        id: "d4-upper",
        name: "Upper Body",
        exercises: [
          {
            id: "d4-e7",
            name: "Weighted Dip",
            sets: 3n,
            reps: "8",
            repType: RepType.reps,
            notes: "",
          },
          {
            id: "d4-e8",
            name: "Chest-to-Bar Pull-Up",
            sets: 3n,
            reps: "AMRAP",
            repType: RepType.amrap,
            notes: "",
          },
          {
            id: "d4-e9",
            name: "Single Arm DB Row",
            sets: 3n,
            reps: "10",
            repType: RepType.reps,
            notes: "Brace against bench",
          },
        ],
      },
      {
        id: "d4-conditioning",
        name: "Conditioning",
        exercises: [
          {
            id: "d4-e10",
            name: "Battle Ropes",
            sets: 3n,
            reps: "30",
            repType: RepType.timed,
            notes: "",
          },
          {
            id: "d4-e11",
            name: "Prowler Push",
            sets: 3n,
            reps: "20",
            repType: RepType.timed,
            notes: "",
          },
          {
            id: "d4-e12",
            name: "Sled Pull",
            sets: 3n,
            reps: "20",
            repType: RepType.timed,
            notes: "",
          },
        ],
      },
    ],
  },
];

// ─── Workout logs (localStorage) ────────────────────────────────────────────

const LOGS_KEY = "workout_logs";

function loadLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      dayId: string;
      completedAt: string;
      selectedExercises: Array<{ patternId: string; exerciseId: string }>;
    }>;
    return parsed.map((l) => ({
      id: l.id,
      dayId: BigInt(l.dayId),
      completedAt: BigInt(l.completedAt),
      selectedExercises: l.selectedExercises,
    }));
  } catch {
    return [];
  }
}

function saveLogs(logs: WorkoutLog[]) {
  const serializable = logs.map((l) => ({
    id: l.id,
    dayId: l.dayId.toString(),
    completedAt: l.completedAt.toString(),
    selectedExercises: l.selectedExercises,
  }));
  localStorage.setItem(LOGS_KEY, JSON.stringify(serializable));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useGetProgram() {
  return useQuery<WorkoutDay[]>({
    queryKey: ["program"],
    queryFn: async () => PROGRAM,
  });
}

export function useGetWorkoutLogs() {
  return useQuery<WorkoutLog[]>({
    queryKey: ["workoutLogs"],
    queryFn: async () => loadLogs(),
  });
}

export function useLogWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      dayId,
      selectedExercises,
    }: {
      dayId: bigint;
      selectedExercises: Array<[string, string]>;
    }) => {
      const logs = loadLogs();
      const newLog: WorkoutLog = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dayId,
        completedAt: BigInt(Date.now()) * 1_000_000n,
        selectedExercises: selectedExercises.map(([patternId, exerciseId]) => ({
          patternId,
          exerciseId,
        })),
      };
      saveLogs([...logs, newLog]);
      return newLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
    },
  });
}

export function useDeleteWorkoutLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logId: string) => {
      const logs = loadLogs();
      saveLogs(logs.filter((l) => l.id !== logId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
    },
  });
}
