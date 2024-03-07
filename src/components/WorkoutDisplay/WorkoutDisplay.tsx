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
import { WorkoutExerciseDisplay } from "./components/WorkoutExerciseDisplay";

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
          <Col span={24}>
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
          <Col span={24}>
            {""}
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
                  const { performanceData, exerciseHistoryId } = item;

                  const { sets, reps, weight } = performanceData || {};

                  console.log(
                    sets,
                    reps,
                    weight,
                    exerciseHistoryId,
                    item?.completed
                  );

                  return (
                    <List.Item>
                      <WorkoutExerciseDisplay
                        sets={sets || 0}
                        reps={reps || 0}
                        weight={weight || 0}
                        exerciseHistoryId={exerciseHistoryId || 0}
                        workoutId={workout.id || 0}
                        completed={item?.completed || false}
                        title={item?.exercise?.title || "NO TITLE FOUND"}
                      />
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
