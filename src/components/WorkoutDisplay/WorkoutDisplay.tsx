import React, { useState, useMemo, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import { Workout } from "../../types/types";
import { AddExerciseToWorkout } from "../AddExerciseToWorkout";
import { InfoCircleTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Row,
  Tag,
  Typography,
  Flex,
  FloatButton,
  Modal,
  Tooltip,
  Table,
  Badge,
  Space,
  Button,
} from "antd";
import { WorkoutExerciseEditor } from "../WorkoutExerciseEditor/WorkoutExerciseEditor";

const { Title, Text } = Typography;

interface Props {
  workout: Workout;
  refetch: () => void;
}

const COMPLETE_WORKOUT_MUTATION = gql`
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      id
    }
  }
`;

export function WorkoutDisplay({ workout, refetch }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("called");
    refetch();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [completeWorkoutMutation] = useMutation(COMPLETE_WORKOUT_MUTATION);

  const completeWorkout = async (workoutId: number) => {
    completeWorkoutMutation({
      variables: {
        input: { workoutId },
      },
    })
      .then((response) => {
        // Handle response here if needed, e.g., updating local state or UI
        console.log("Workout completed successfully", response.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error completing workout", error);
        // Handle error here, e.g., showing an error message
      });
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
            <WorkoutExerciseEditor refetch={refetch} {...performanceDataPlus} />
          </div>
        );
      },
    },
    {
      title: "Stats",
      dataIndex: "stats",
      key: "stats",
    },
  ];

  const completed = useMemo(() => {
    return (
      workout?.exercises?.length &&
      workout?.exercises?.filter((exercise) => {
        return exercise.completed;
      }).length === workout.exercises.length
    );
  }, [workout?.exercises]);

  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        okButtonProps={{
          disabled: true,
          loading: true,
        }}
        okText="Adding Exercise"
        onCancel={handleCancel}
        cancelText="Cancel"
      >
        {workout && (
          <AddExerciseToWorkout
            workoutId={workout.id!}
            userId={workout.userId!}
            onOk={handleOk}
          />
        )}
      </Modal>
      <>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Title level={3} keyboard>
              {workout.title} - {workout.id}
            </Title>
            <Text>
              {!completed && <Badge status="processing" text="In Progress" />}
              {completed && (
                <Badge
                  status="success"
                  text={<Tag color="green">Completed</Tag>}
                />
              )}
            </Text>
          </Col>
          <Col span={24}>
            <Table
              pagination={false}
              dataSource={exercisesData}
              columns={columns}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              disabled={completed || !workout?.exercises?.length}
              onClick={() => completeWorkout(workout.id!)}
            >
              Complete Workout
            </Button>
          </Col>
          <FloatButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={showModal}
          >
            Add Exercise
          </FloatButton>
        </Row>
      </>
    </div>
  );
}
