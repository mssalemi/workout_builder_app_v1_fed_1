import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { Select, InputNumber, Button } from "antd";

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

const ADD_EXERCISE_TO_WORKOUT_MUTATION = `
  mutation AddExerciseToWorkout($input: AddExerciseToWorkoutInput!) {
    addExerciseToWorkout(input: $input) {
      title
    }
  }
`;

export function AddExerciseToWorkout({ workoutId, userId, onOk }: Props) {
  const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(0);

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

  const handleAddExercise = async () => {
    if (exercise) {
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql", // Ensure this URL matches your GraphQL server endpoint
          {
            query: ADD_EXERCISE_TO_WORKOUT_MUTATION,
            variables: {
              input: {
                workoutId: workoutId,
                exerciseId: exercise.exerciseId,
                performanceData: { reps, weight, sets },
              },
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );
        // console.log(response.data);
        onOk();
        // Handle success (e.g., show a success message or update UI)
      } catch (error) {
        // console.error(error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  const options = useMemo(() => {
    return exercises.map((exercise: any) => ({
      id: exercise.id,
      value: exercise.title,
    }));
  }, [exercises]);

  return (
    <div>
      <p>WorkoutId: {workoutId}</p>
      <p>UserId: {userId}</p>
      <div>
        <h1>Exercise List</h1>
        {exercises.length > 0 && (
          <>
            <Select
              style={{ width: 120 }}
              loading={loading}
              options={options}
              onChange={(value) => {
                const exercise = exercises.find(
                  (exercise: any) => exercise.title === value
                );
                setExercise({
                  exerciseId: exercise?.id || 0,
                  value: value,
                });
              }}
            />
            {exercise && (
              <div>
                <p>Selected Exercise: {exercise.value}</p>
                <p>Selected Exercise ID: {exercise.exerciseId}</p>
                <InputNumber
                  value={reps}
                  onChange={(value) => setReps(value || 0)}
                  addonAfter="Reps"
                />
                <InputNumber
                  value={weight}
                  onChange={(value) => setWeight(value || 0)}
                  addonAfter="Weight"
                />
                <InputNumber
                  value={sets}
                  onChange={(value) => setSets(value || 0)}
                  addonAfter="Sets"
                />
                <Button onClick={handleAddExercise}>Add Exercise</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
