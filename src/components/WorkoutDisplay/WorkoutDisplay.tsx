import React, { useState, useMemo, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

import { Workout } from "../../types/types";
import { AddExerciseToWorkout } from "../AddExerciseToWorkout";
import {
  InfoCircleTwoTone,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
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
  Avatar,
  Button,
} from "antd";
import { WorkoutExerciseEditor } from "../WorkoutExerciseEditor/WorkoutExerciseEditor";

const { Title, Text } = Typography;

const avatar = createAvatar(lorelei, {
  seed: "John Doe",
  // ... other options
});

const svg = avatar.toString();

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

const DELETE_EXERCISE_FROM_WORKOUT_MUTATION = gql`
  mutation DeleteExerciseFromWorkout($input: DeleteExerciseFromWorkoutInput!) {
    deleteExerciseFromWorkout(input: $input) {
      success
      errors
    }
  }
`;

export function WorkoutDisplay({ workout, refetch }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteExerciseMutation, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_EXERCISE_FROM_WORKOUT_MUTATION);

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

  const deleteExercise = async (exerciseHistoryId: number) => {
    deleteExerciseMutation({
      variables: {
        input: { exerciseHistoryId },
      },
    })
      .then((response) => {
        // Handle response here if needed, e.g., updating local state or UI
        console.log("Exercise deleted successfully", response.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error deleting exercise", error);
        // Handle error here, e.g., showing an error message
      });
  };

  const exercisesData = workout?.exercises?.map((exercise) => {
    const { performanceData, exerciseHistoryId } = exercise;
    const { sets, reps, weight } = performanceData || {};

    console.log("👍👍👍👍👍👍exercise", exercise);
    console.log("👍👍👍👍👍👍exercise userId", exercise?.userId || 0);

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
      info: {
        bodyPartMain: exercise?.exercise?.bodyPartMain || "NO BODY PART FOUND",
        description: exercise?.exercise?.description || "NO DESCRIPTION FOUND",
      },
      stats: (
        <Flex justify={"center"} align={"center"}>
          <Tooltip title="Needs more data.">
            <InfoCircleTwoTone twoToneColor="#DCDCDC" />
          </Tooltip>
        </Flex>
      ),
      userId: exercise?.userId || 0,
    };
  });

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text: any, record: any) => {
        console.log("columns for exercise", record);
        const url =
          record.userId == 1
            ? "https://api.dicebear.com/7.x/bottts/svg?seed=Boots?backgroundColor=b6e3f4,c0aede,d1d4f9"
            : "https://api.dicebear.com/7.x/bottts/svg?seed=Ginger";
        return <Avatar src={url} />;
      },
    },
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
      title: "Body Part",
      dataIndex: "bodyPart",
      key: "bodyPart",
      render: (text: any, record: any) => {
        console.log(record);
        return (
          <>
            <Text>{record?.info.bodyPartMain}</Text>
          </>
        );
      },
    },
    {
      title: "Stats",
      dataIndex: "stats",
      key: "stats",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text: any, record: any) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() =>
              deleteExercise(record.performanceDataPlus.exerciseHistoryId)
            }
          >
            <CloseCircleOutlined />
          </Button>
        );
      },
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
        open={isModalOpen}
        okButtonProps={{
          disabled: true,
          loading: true,
        }}
        okText=" "
        onCancel={handleCancel}
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
