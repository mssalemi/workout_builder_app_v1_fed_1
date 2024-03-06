import React, { useState } from "react";
import axios from "axios";
import { Workout, Exercise } from "../../types/types";
import { AddExerciseToWorkout } from "../AddExerciseToWorkout";
import { PlusCircleTwoTone } from "@ant-design/icons";
import {
  Col,
  Row,
  Avatar,
  Typography,
  Tag,
  List,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
const { Text } = Typography;

interface Props {
  workout: Workout;
}

interface DataType {
  userId?: string;
  id?: string;
  title?: string;
  exercises?: Exercise[];
}

const DELETE_EXERCISE_FROM_WORKOUT_MUTATION = `
  mutation DeleteExerciseFromWorkout($input: DeleteExerciseFromWorkoutInput!) {
    deleteExerciseFromWorkout(input: $input) {
      success
      errors
    }
  }
`;

const COMPLETE_WORKOUT_MUTATION = `
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      id
    }
  }
`;

type FieldType = {
  reps: number;
  sets: number;
  weight: number;
};

export function WorkoutDisplay({ workout }: Props) {
  console.log("[WorkoutDisplay] workout: ", workout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = workout.userId;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const deleteExerciseFromWorkout = async (exerciseHistoryId: number) => {
    console.log("Deleting exercise", exerciseHistoryId);
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
      console.log("Exercise deleted successfully", response.data);
      // Refresh workout data or handle UI updates here
    } catch (error) {
      console.error("Error deleting exercise", error);
      // Handle error, maybe show a message to the user
    }
  };

  const [form] = Form.useForm();

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
      console.log("Workout completed successfully", response.data);
      // Update UI or state as needed
    } catch (error) {
      console.error("Error completing workout", error);
      // Handle error, possibly show a message to the user
    }
  };

  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {workout && (
          <AddExerciseToWorkout
            workoutId={workout.id!}
            userId={workout.userId!}
          />
        )}
      </Modal>
      <>
        <Row>
          <Col span={8}>
            <Avatar
              shape="square"
              style={{
                backgroundColor: "#fde3cf",
                color: "#f56a00",
              }}
            >
              {workout.userId}
            </Avatar>
            <Text keyboard>{workout.title}</Text>
          </Col>
          <Col span={16}>
            {" "}
            {
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={workout?.exercises}
                footer={
                  <Button
                    icon={<PlusCircleTwoTone></PlusCircleTwoTone>}
                    type="primary"
                    onClick={showModal}
                  >
                    Add Exercise
                  </Button>
                }
                renderItem={(item) => {
                  const { performanceData } = item;

                  const { sets, reps, weight } = performanceData || {};

                  return (
                    <List.Item
                      actions={[
                        <Button key="list-loadmore-edit">Edit</Button>,
                        <Button
                          key="list-loadmore-edit"
                          onClick={() => {
                            completeWorkout(workout?.id || 0);
                          }}
                          disabled={item?.completed}
                        >
                          Complete{item?.completed ? "d" : ""}
                        </Button>,
                        <Button
                          key="list-loadmore-more"
                          onClick={() =>
                            deleteExerciseFromWorkout(
                              item?.exerciseHistoryId || 0
                            )
                          }
                        >
                          Delete
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={item.exercise?.title}
                      ></List.Item.Meta>
                      {/* <Tag color="magenta">
                          Sets: {item.performanceData?.sets}
                        </Tag>
                        <Tag color="red">
                          Reps: {item.performanceData?.reps}
                        </Tag>
                        <Tag color="volcano">
                          Weight: {item.performanceData?.weight}
                        </Tag> */}
                      <Form
                        form={form}
                        name="workout"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="horizontal"
                      >
                        <Form.Item
                          label="Sets"
                          name="sets"
                          rules={[
                            {
                              required: true,
                              message: "Please input the number of sets!",
                            },
                          ]}
                        >
                          <InputNumber defaultValue={sets} />
                        </Form.Item>
                        <Form.Item
                          label="Reps"
                          name="reps"
                          rules={[
                            {
                              required: true,
                              message: "Please input the number of reps!",
                            },
                          ]}
                        >
                          <InputNumber defaultValue={reps} />
                        </Form.Item>
                        <Form.Item
                          label="Weight"
                          name="weight"
                          rules={[
                            {
                              required: true,
                              message: "Please input the weight!",
                            },
                          ]}
                        >
                          <InputNumber defaultValue={weight} />
                        </Form.Item>
                      </Form>
                    </List.Item>
                  );
                }}
              />
            }
          </Col>
        </Row>
      </>
    </div>
  );
}
