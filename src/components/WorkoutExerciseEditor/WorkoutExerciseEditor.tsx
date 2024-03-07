import React from "react";

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
  sets: number;
  reps: number;
  weight: number;
  exerciseHistoryId: number;
}
export function WorkoutExerciseEditor({
  sets,
  reps,
  weight,
  exerciseHistoryId,
}: Props) {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("Success:", values);
    const payload = {
      sets: values.sets || sets,
      reps: values.reps || reps,
      weight: values.weight || weight,
      exerciseHistoryId: exerciseHistoryId,
    };
    console.log("payload: ", payload);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      form={form}
      name="workout"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="horizontal"
    >
      <Form.Item label="Sets" name="sets">
        <InputNumber defaultValue={sets} />
      </Form.Item>
      <Form.Item label="ExerciseHistoryId" name="exerciseHistoryId" hidden>
        <Input defaultValue={exerciseHistoryId} value={reps} />
      </Form.Item>
      <Form.Item label="Reps" name="reps">
        <InputNumber defaultValue={reps} />
      </Form.Item>
      <Form.Item label="Weight" name="weight">
        <InputNumber defaultValue={weight} />
      </Form.Item>
      <Form.Item>
        <Button key="list-loadmore-edit" htmlType="submit">
          Edit
        </Button>
      </Form.Item>
    </Form>
  );
}
