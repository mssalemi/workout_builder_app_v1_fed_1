import React, { useState } from "react";
import axios from "axios";

import { WorkoutExerciseEditor } from "../../WorkoutExerciseEditor/WorkoutExerciseEditor";
import { Button, Tag, Row, Col, Typography } from "antd";
const { Text } = Typography;

interface Props {
  title: string;
  completed: boolean;
  sets: number;
  reps: number;
  weight: number;
  exerciseHistoryId: number;
  workoutId: number;
  refetch: () => void;
}

const COMPLETE_WORKOUT_MUTATION = `
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      id
    }
  }
`;

const DELETE_EXERCISE_FROM_WORKOUT_MUTATION = `
  mutation DeleteExerciseFromWorkout($input: DeleteExerciseFromWorkoutInput!) {
    deleteExerciseFromWorkout(input: $input) {
      success
      errors
    }
  }
`;

export function WorkoutExerciseDisplay({
  completed,
  title,
  sets,
  reps,
  weight,
  exerciseHistoryId,
  workoutId,
  refetch,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const completeWorkout = async (workoutId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/graphql",
        {
          query: COMPLETE_WORKOUT_MUTATION,
          variables: {
            input: {
              workoutId, // Assuming 'workoutId' is the correct field name inside the input object
            },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log("Workout completed successfully", response.data);
      // Update UI or state as needed
    } catch (error) {
      console.error("Error completing workout", error);
      // Handle error, possibly show a message to the user
    }
  };

  const deleteExerciseFromWorkout = async (exerciseHistoryId: number) => {
    // console.log("Deleting exercise", exerciseHistoryId);
    try {
      const response = await axios.post(
        "http://localhost:3000/graphql",
        {
          query: DELETE_EXERCISE_FROM_WORKOUT_MUTATION,
          variables: {
            input: {
              exerciseHistoryId,
            },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log("Exercise deleted successfully", response.data);
      // Refresh workout data or handle UI updates here
    } catch (error) {
      console.error("Error deleting exercise", error);
    }
  };

  return (
    <div>
      <Text strong>{title} hey</Text>
      <Text>
        {sets}x{reps} @ {weight} lbs
      </Text>
      <Text underline onClick={() => setIsEditing(!isEditing)}>
        Edit
      </Text>
      <Tag color={completed ? "green" : "red"}>
        {completed ? "Completed" : "Not Completed"}
      </Tag>
      {isEditing && (
        <WorkoutExerciseEditor
          sets={sets || 0}
          reps={reps || 0}
          weight={weight || 0}
          exerciseHistoryId={exerciseHistoryId || 0}
          refetch={refetch}
        />
      )}
      hi
      <Button
        key="list-loadmore-edit"
        onClick={() => {
          completeWorkout(workoutId || 0);
        }}
        disabled={completed}
      >
        Complete{completed ? "d" : ""}
      </Button>
      <Button
        key="list-loadmore-more"
        onClick={() => deleteExerciseFromWorkout(exerciseHistoryId)}
      >
        Delete
      </Button>
    </div>
  );
}
