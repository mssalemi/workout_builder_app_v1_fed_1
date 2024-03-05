import React, { useState } from "react";
import { Workout, Exercise } from "../../types/types";
import { AddExerciseToWorkout } from "../AddExerciseToWorkout";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { Col, Row, Avatar, Typography, Tag, List, Button, Modal } from "antd";
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

export function WorkoutDisplay({ workout }: Props) {
  console.log("[WorkoutDisplay] workout: ", workout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="list-loadmore-edit">Edit</a>,
                      <a key="list-loadmore-more">Complete</a>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.exercise?.title}
                    ></List.Item.Meta>
                    <div>
                      <Tag color="magenta">
                        Sets: {item.performanceData?.sets}
                      </Tag>
                      <Tag color="red">Reps: {item.performanceData?.reps}</Tag>
                      <Tag color="volcano">
                        Weight: {item.performanceData?.weight}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            }
          </Col>
        </Row>
      </>
    </div>
  );
}
