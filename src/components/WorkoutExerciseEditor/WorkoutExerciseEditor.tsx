import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

import {
  CloseSquareFilled,
  CheckSquareFilled,
  LeftSquareFilled,
} from "@ant-design/icons";

import {
  Input,
  Button,
  Space,
  Form,
  Tooltip,
  Spin,
  Flex,
  Row,
  Col,
  Typography,
} from "antd";

const { Text, Title } = Typography;

const UPDATE_EXERCISE_IN_WORKOUT_MUTATION = gql`
  mutation UpdateExerciseInWorkout(
    $exerciseHistoryId: Int!
    $newPerformanceData: PerformanceDataInput!
  ) {
    updateExerciseInWorkout(
      input: {
        exerciseHistoryId: $exerciseHistoryId
        newPerformanceData: $newPerformanceData
      }
    ) {
      exercise {
        id
      }
    }
  }
`;

const DELETE_EXERCISE_FROM_WORKOUT_MUTATION = gql`
  mutation DeleteExerciseFromWorkout($input: DeleteExerciseFromWorkoutInput!) {
    deleteExerciseFromWorkout(input: $input) {
      success
      errors
    }
  }
`;

interface Props {
  sets: number;
  reps: number;
  weight: number;
  exerciseHistoryId: number;
  refetch: () => void;
}
export function WorkoutExerciseEditor({
  sets,
  reps,
  weight,
  exerciseHistoryId,
  refetch,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateExerciseMutation, { loading: updating, error }] = useMutation(
    UPDATE_EXERCISE_IN_WORKOUT_MUTATION
  );

  const [deleteExerciseMutation, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_EXERCISE_FROM_WORKOUT_MUTATION);

  const onSubmit = (values: any) => {
    const payload = {
      sets: parseInt(values.sets, 10) || sets,
      reps: parseInt(values.reps, 10) || reps,
      weight: parseInt(values.weight, 10) || weight,
      // Include other fields if necessary
    };
    updateExerciseMutation({
      variables: {
        newPerformanceData: payload,
        exerciseHistoryId,
      },
    });
    setIsEditing(false); // Exit editing mode after submission
    refetch();
  };

  const onDelete = () => {
    deleteExerciseMutation({
      variables: {
        input: {
          exerciseHistoryId,
        },
      },
    });
    refetch();
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };

  const cancelEdit = () => {
    form.resetFields();
    setIsEditing(false);
  };

  return (
    <>
      <Row>
        <Col span={3}>
          <Space
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Text strong> Sets </Text>
            <Text
              style={{
                fontSize: "1.5rem",
              }}
              strong
            >
              {sets}
            </Text>
          </Space>
        </Col>
        <Col span={3}>
          <Space
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Text strong> Reps </Text>
            <Text
              style={{
                fontSize: "1.5rem",
              }}
              strong
            >
              {reps}
            </Text>
          </Space>
        </Col>
        <Col span={3}>
          <Space
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Text strong> Weight </Text>
            <Text
              strong
              style={{
                fontSize: "1.5rem",
              }}
            >
              {weight}
            </Text>
          </Space>
        </Col>
        <Col span={24}>
          {" "}
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Space.Compact block size="small">
              <Flex>
                <Form.Item name="sets" style={{ width: "5rem" }}>
                  <Input
                    disabled={!isEditing}
                    style={{ width: "5rem" }}
                    defaultValue={sets}
                  />
                </Form.Item>
                <Form.Item name="reps" style={{ width: "5rem" }}>
                  <Input
                    disabled={!isEditing}
                    style={{ width: "5rem" }}
                    defaultValue={reps}
                  />
                </Form.Item>
                <Form.Item name="weight" style={{ width: "5rem" }}>
                  <Input disabled={!isEditing} defaultValue={weight} />
                </Form.Item>

                {isEditing && (
                  <Form.Item style={{ width: "1.5rem" }}>
                    <Tooltip title="Cancel">
                      <Button
                        icon={<CloseSquareFilled />}
                        type="primary"
                        onClick={cancelEdit}
                        danger
                        htmlType="reset"
                        disabled={editLoading}
                      ></Button>
                    </Tooltip>
                  </Form.Item>
                )}

                {isEditing && (
                  <Form.Item style={{ width: "1.5rem" }}>
                    {editLoading ? (
                      <Flex gap="small">
                        {" "}
                        <Spin size="small"></Spin>
                      </Flex>
                    ) : (
                      <Tooltip title="Save">
                        <Button
                          icon={<CheckSquareFilled />}
                          type="primary"
                          htmlType="submit"
                          onClick={() => {
                            console.log("placeholder submit");
                            form.submit();
                            setEditLoading(true);
                          }}
                        ></Button>
                      </Tooltip>
                    )}
                  </Form.Item>
                )}
                {!isEditing && (
                  <Form.Item>
                    <Tooltip title="Edit">
                      <Button
                        type="primary"
                        icon={<LeftSquareFilled />}
                        onClick={() => setIsEditing(true)}
                      />
                    </Tooltip>
                  </Form.Item>
                )}
              </Flex>
            </Space.Compact>
          </Form>
        </Col>
      </Row>
    </>
  );
}

// RIP - Old Form
// <Form
//   form={form}
//   name="workout"
//   onFinish={onSubmit}
//   onFinishFailed={onFinishFailed}
//   layout="horizontal"
// >
//   <Form.Item label="Sets" name="sets">
//     <InputNumber defaultValue={sets} />
//   </Form.Item>
//   <Form.Item label="ExerciseHistoryId" name="exerciseHistoryId" hidden>
//     <Input defaultValue={exerciseHistoryId} value={reps} />
//   </Form.Item>
//   <Form.Item label="Reps" name="reps">
//     <InputNumber defaultValue={reps} />
//   </Form.Item>
//   <Form.Item label="Weight" name="weight">
//     <InputNumber defaultValue={weight} />
//   </Form.Item>
//   <Form.Item>
//     <Button key="list-loadmore-edit" htmlType="submit">
//       Edit
//     </Button>
//   </Form.Item>
// </Form>
