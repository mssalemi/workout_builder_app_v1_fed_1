import React, { useState } from "react";
import axios from "axios";
import { Form, InputNumber, Button } from "antd";

interface Props {
  exercise: {
    exerciseId: number;
    value: string;
  };
  onOk: () => void;
  workoutId: number;
}

const ADD_EXERCISE_TO_WORKOUT_MUTATION = `
  mutation AddExerciseToWorkout($input: AddExerciseToWorkoutInput!) {
    addExerciseToWorkout(input: $input) {
      title
    }
  }
`;

export function AddExerciseToWorkoutForm({ exercise, onOk, workoutId }: Props) {
  const [form] = Form.useForm();
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(0);

  const handleAddExercise = async (performanceData: {
    reps: number;
    weight: number;
    sets: number;
  }) => {
    if (exercise) {
      try {
        await axios.post(
          "http://localhost:3000/graphql", // Ensure this URL matches your GraphQL server endpoint
          {
            query: ADD_EXERCISE_TO_WORKOUT_MUTATION,
            variables: {
              input: {
                workoutId: workoutId,
                exerciseId: exercise.exerciseId,
                performanceData,
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

  console.log(exercise);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handleAddExercise(values)}
    >
      <Form.Item
        label="Sets"
        name="sets"
        rules={[{ required: true, message: "Sets!" }]}
      >
        <InputNumber placeholder="1" />
      </Form.Item>
      <Form.Item
        label="Reps"
        name="reps"
        rules={[{ required: true, message: "Reps!" }]}
      >
        <InputNumber placeholder="8" />
      </Form.Item>
      <Form.Item
        label="Weight"
        name="weight"
        rules={[{ required: true, message: "Weight!" }]}
      >
        <InputNumber placeholder="225" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Workout
        </Button>
      </Form.Item>
    </Form>
  );
}
