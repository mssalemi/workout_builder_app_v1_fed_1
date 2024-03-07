import React, { useState, useMemo } from "react";
import axios from "axios";
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
}

const COMPLETE_WORKOUT_MUTATION = `
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      id
    }
  }
`;

const style: React.CSSProperties = { padding: "8px 0" };

export function WorkoutDisplay({ workout }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("called");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
      // console.log("Workout completed successfully", response.data);
      // Update UI or state as needed
    } catch (error) {
      console.error("Error completing workout", error);
      // Handle error, possibly show a message to the user
    }
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
  ];

  const completed = useMemo(() => {
    return (
      workout?.exercises &&
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
        onOk={handleOk}
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
              {workout.title} -{" "}
            </Title>
            <Text>
              {completed && <Tag color="green">Completed</Tag>}
              {!completed && <Badge status="processing" text="In Progress" />}
            </Text>
            {!completed && (
              <Button
                type="primary"
                onClick={() => completeWorkout(workout?.id || 0)}
              >
                Complete Workout
              </Button>
            )}
          </Col>
          <Col span={24}>
            <Table
              pagination={false}
              dataSource={exercisesData}
              columns={columns}
            />
            <FloatButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={showModal}
            >
              Add Exercise
            </FloatButton>
          </Col>
        </Row>
      </>
    </div>
  );
}
