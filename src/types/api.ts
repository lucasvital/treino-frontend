export interface Exercise {
  exercicio: string;
  series: string;
  carga: string;
  intervalo: string;
}

export interface Workout {
  _id: string;
  userId: string;
  workoutName: string;
  treinos: {
    [key: string]: Exercise[];
  };
  createdAt: string;
}

export interface WorkoutResponse {
  workout: Workout;
  message?: string;
}
