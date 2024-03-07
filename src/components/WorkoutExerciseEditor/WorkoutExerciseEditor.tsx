import React, { useState } from "react";
import {
  EditFilled,
  CloseSquareFilled,
  CheckSquareFilled,
} from "@ant-design/icons";

import {
  Input,
  Typography,
  Tag,
  Divider,
  Button,
  Space,
  Form,
  Tooltip,
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
  const [isEditing, setIsEditing] = useState(false);
  // const [form] = Form.useForm();
  const onSubmit = (values: any) => {
    console.log("Success:", values);
    const payload = {
      sets: parseInt(values.sets) || sets,
      reps: parseInt(values.reps) || reps,
      weight: parseInt(values.weight) || weight,
      exerciseHistoryId: exerciseHistoryId,
    };
    console.log("payload: ", payload);
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <>
      <Form onFinish={onSubmit} layout="vertical">
        <Space.Compact block size="small">
          <Form.Item label="Sets" name="sets" style={{ width: "5rem" }}>
            <Input
              disabled={!isEditing}
              style={{ width: "5rem" }}
              defaultValue={sets}
            />
          </Form.Item>
          <Form.Item label="Reps" name="reps" style={{ width: "5rem" }}>
            <Input
              disabled={!isEditing}
              style={{ width: "5rem" }}
              defaultValue={reps}
            />
          </Form.Item>
          <Form.Item label="Weight" name="weight" style={{ width: "5rem" }}>
            <Input disabled={!isEditing} defaultValue={weight} />
          </Form.Item>
          <Form.Item label="Action">
            {isEditing ? (
              <>
                <Button
                  icon={<CloseSquareFilled />}
                  type="primary"
                  htmlType="submit"
                  onClick={() => setIsEditing(false)}
                  danger
                ></Button>
                <Button
                  icon={<CheckSquareFilled />}
                  type="primary"
                  htmlType="submit"
                ></Button>
              </>
            ) : (
              <>
                <Tooltip title="edit performance data">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EditFilled />}
                    onClick={() => setIsEditing(true)}
                  />
                </Tooltip>
              </>
            )}
          </Form.Item>
        </Space.Compact>
      </Form>
    </>
  );
}

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
