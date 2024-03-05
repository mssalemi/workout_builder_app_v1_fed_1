import React, { useEffect, useState } from "react";
import axios from "axios";

import { Select, InputNumber, Button } from "antd";
interface Props {
  workoutId: number;
  userId: number;
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

export function AddExerciseToWorkout({ workoutId, userId }: Props) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(0);

  const [exercise, setExercise] = useState<{
    exerciseId: number;
    value: string;
  } | null>();

  useEffect(() => {
    console.log("exercise", exercise);
  }, [exercise]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(false);
        const response = await axios.post(
          "http://localhost:3000/graphql", // Ensure this URL matches your GraphQL server endpoint
          { query: GET_EXERCISE_QUERY },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
        const {
          data: {
            data: { exercises },
          },
        } = response;
        console.log(exercises);
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
        console.log(response.data);
        // Handle success (e.g., show a success message or update UI)
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show an error message)
      }
    }
  };

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
              options={exercises.map((exercise: any) => ({
                id: exercise.id,
                value: exercise.title,
              }))}
              onChange={({ value, id }) => {
                setExercise({
                  exerciseId: 1,
                  value,
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
