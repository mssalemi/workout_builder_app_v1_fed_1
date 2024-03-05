export interface Workout {
  id?: number;
  title?: string;
  userId?: number;
  exercises?: Exercise[];
}

export interface Exercise {
  completed?: boolean;
  order?: number;
  performanceData?: PerformanceData;
  exercise?: ExerciseDetails;
  exerciseHistoryId?: number;
}

export interface PerformanceData {
  reps?: number;
  weight?: number;
  sets?: number;
}

export interface ExerciseDetails {
  id?: number;
  title?: string;
  description?: string;
  bodyPartMain?: string;
}
