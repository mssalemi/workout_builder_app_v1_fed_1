import React, { useState } from "react";
import { Workout } from "../../types/types";
import { AddExerciseToWorkout } from "../AddExerciseToWorkout";
import { InfoCircleTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Row,
  Avatar,
  Typography,
  Flex,
  Button,
  Modal,
  Tooltip,
  Table,
} from "antd";
import { WorkoutExerciseEditor } from "../WorkoutExerciseEditor/WorkoutExerciseEditor";

const { Text } = Typography;

interface Props {
  workout: Workout;
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

  const exercisesData = workout?.exercises?.map((exercise) => {
    const { performanceData, exerciseHistoryId } = exercise;
    const { sets, reps, weight } = performanceData || {};
    return {
      key: exercise?.exerciseHistoryId,
      title: exercise?.exercise?.title || "NO TITLE FOUND",
      performanceDataPlus: {
        sets: sets || 0,
        reps: reps || 0,
        weight: weight || 0,
        exerciseHistoryId: exerciseHistoryId || 0,
      },
      completed: exercise.completed || false,
      stats: (
        <Flex justify={"center"} align={"center"}>
          <Tooltip title="Needs more data.">
            <InfoCircleTwoTone twoToneColor="#DCDCDC" />
          </Tooltip>
        </Flex>
      ),
    };
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Performance Data",
      dataIndex: "performanceDataPlus",
      key: "performanceDataPlus",
      render: (performanceDataPlus: {
        sets: number;
        reps: number;
        weight: number;
        exerciseHistoryId: number;
      }) => {
        return (
          <div>
            <WorkoutExerciseEditor {...performanceDataPlus} />
          </div>
        );
      },
    },
    {
      title: "Stats",
      dataIndex: "stats",
      key: "stats",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
          Add Exercise
        </Button>
      ),
    },
  ];

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
            <Table dataSource={exercisesData} columns={columns} />
          </Col>
        </Row>
      </>
    </div>
  );
}
