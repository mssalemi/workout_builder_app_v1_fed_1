import React, { useEffect, useState } from "react";
import axios from "axios";

import { ExerciseSearchDisplay } from "./components/ExerciseSearchDisplay";
import { AddExerciseToWorkoutForm } from "./components/AddExerciseToWorkoutForm";

import { ExerciseDetails } from "../../types/types";
interface Props {
  workoutId: number;
  userId: number;
  onOk: () => void;
}

const GET_EXERCISE_QUERY = `
  query GetExercise {
    exercises {
      id
      title
      bodyPartMain
      bodyPartAccessory
    }
  }
`;

export function AddExerciseToWorkout({ workoutId, userId, onOk }: Props) {
  const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const [exercise, setExercise] = useState<{
    exerciseId: number;
    value: string;
  } | null>();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(false);
        const response = await axios.post(
          "http://localhost:3000/graphql", // Ensure this URL matches your GraphQL server endpoint
          { query: GET_EXERCISE_QUERY },
          { headers: { "Content-Type": "application/json" } }
        );
        // console.log(response);
        const {
          data: {
            data: { exercises },
          },
        } = response;
        onOk();
        // console.log(exercises);
        setExercises(exercises);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div>
      <div>
        {exercises.length > 0 && (
          <>
            <ExerciseSearchDisplay
              setExercise={setExercise}
              exercises={exercises}
              exercise={exercise}
            />

            {exercise && (
              <AddExerciseToWorkoutForm
                exercise={exercise}
                onOk={onOk}
                workoutId={workoutId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
