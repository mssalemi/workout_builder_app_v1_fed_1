import React, { useState } from "react";
import axios from "axios";
import { Form, InputNumber, Button, Switch } from "antd";

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
  const [userId, setUserId] = useState(1);

  const handleAddExercise = async (values: {
    reps: number;
    weight: number;
    sets: number;
    userId: boolean;
  }) => {
    const token = localStorage.getItem("user-token");
    console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 moew", values.userId);
    if (exercise) {
      try {
        const payload = {
          workoutId: workoutId,
          exerciseId: exercise.exerciseId,
          performanceData: {
            reps: values.reps,
            weight: values.weight,
            sets: values.sets,
          },
        };
        console.log("payload", payload);
        const response = await axios.post(
          "http://localhost:3000/graphql", // Ensure this URL matches your GraphQL server endpoint
          {
            query: ADD_EXERCISE_TO_WORKOUT_MUTATION,
            variables: {
              input: payload,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        console.log("response", response.data);
        onOk();
        // Handle success (e.g., show a success message or update UI)
      } catch (error) {
        console.error("error", error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  console.log(exercise);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        console.log("🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚values", values);
        handleAddExercise(values);
      }}
    >
      <Form.Item
        label="User ID Switch (Left: User 1, Right: User 2)"
        name="userId"
        valuePropName="checked" // Ensures the form item controls the Switch checked state
      >
        <Switch
          checkedChildren="Mehdi"
          defaultChecked
          unCheckedChildren="Mate"
        />
      </Form.Item>
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
          Add Exercise to Workout
        </Button>
      </Form.Item>
    </Form>
  );
}
