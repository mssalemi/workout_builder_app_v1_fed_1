import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CREATE_WORKOUT_MUTATION = `
  mutation CreateWorkout($input: CreateUserWorkoutInput!) {
    createUserWorkout(input: $input) {
      id
    }
  }
`;

export function NewWorkoutForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCreateWorkout = async (values: any) => {
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:3000/graphql", // Replace with your GraphQL endpoint
        {
          query: CREATE_WORKOUT_MUTATION,
          variables: {
            input: {
              userId: 1, // Assuming the userId is set here directly
              title: values.title,
            },
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Assuming successful creation
      message.success("Workout created successfully!");
      const workoutId = response.data.data.createUserWorkout.id; // Extract the workout ID from the response
      navigate(`/${workoutId}`); // Navigate to the workout page with the new ID
    } catch (error) {
      message.error("An error occurred while creating the workout.");
      console.error(error); // For debugging, remove in production
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreateWorkout}>
      <Form.Item
        label="Workout Title"
        name="title"
        rules={[{ required: true, message: "Please input the workout title!" }]}
      >
        <Input placeholder="Enter Workout Title" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Workout
        </Button>
      </Form.Item>
    </Form>
  );
}
