import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    id: string;
    name: string;
    reps: string;
    sets: bigint;
    repType: RepType;
    notes?: string;
}
export interface WorkoutLog {
    id: string;
    completedAt: Time;
    selectedExercises: Array<SelectedExercise>;
    dayId: bigint;
}
export type Time = bigint;
export interface MovementPattern {
    id: string;
    name: string;
    exercises: Array<Exercise>;
}
export interface SelectedExercise {
    exerciseId: string;
    patternId: string;
}
export interface WorkoutDay {
    id: bigint;
    patterns: Array<MovementPattern>;
    name: string;
}
export enum RepType {
    timed = "timed",
    amrap = "amrap",
    normal = "normal"
}
export interface backendInterface {
    deleteWorkoutLog(logId: string): Promise<void>;
    getProgram(): Promise<Array<WorkoutDay>>;
    getWorkoutLogs(): Promise<Array<WorkoutLog>>;
    logWorkout(dayId: bigint, selectedExercises: Array<[string, string]>): Promise<string>;
}
