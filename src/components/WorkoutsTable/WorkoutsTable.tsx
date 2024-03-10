import React from "react";
import { Exercise, Workout } from "../../types/types";

import { Table, Tag, Space, Typography } from "antd";

const { Text } = Typography;

const columns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Something else",
    dataIndex: "something-else",
    key: "somethingElse",
  },
];

interface Props {
  workouts: Workout[];
}

function WorkoutsTable({ workouts }: Props) {
  // this needs endpoint to access all workouts

  const data = workouts
    .map((workout, index) => {
      return {
        key: index,
        title: (
          <Space size="middle">
            <a href={`/${workout.id}`}>{workout.title}</a>
          </Space>
        ),
        status: (
          <Tag
            color={
              workout?.exercises!.length > 0 &&
              workout.exercises?.filter((exercise) => {
                return exercise.completed === true;
              }).length === workout.exercises?.length
                ? "green"
                : "red"
            }
          >
            {workout?.exercises!.length > 0 &&
            workout.exercises?.filter((exercise) => {
              return exercise.completed === true;
            }).length === workout.exercises?.length
              ? "Completed"
              : "Not Completed"}
          </Tag>
        ),
        description: (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {workout?.exercises!.length > 0 &&
                  workout.exercises?.map(
                    (exercise: Exercise, index: number) => {
                      console.log(exercise.exercise);
                      return (
                        <Text>
                          {exercise.exercise?.title}{" "}
                          {exercise.performanceData?.sets}x
                          {exercise.performanceData?.reps} @{" "}
                          {exercise.performanceData?.weight}
                        </Text>
                      );
                    }
                  )}
              </div>
              {workout?.exercises!.length > 0 && (
                <Text copyable={{ text: "Hello, Ant Design!" }}></Text>
              )}
            </div>

            <div></div>
          </>
        ),
      };
    })
    .filter((workout, index) => index < 5);

  console.log(workouts);
  return (
    <div>
      {" "}
      {workouts.length ? (
        <Table columns={columns} dataSource={data} />
      ) : (
        <h1>No Workouts</h1>
      )}
    </div>
  );
}

export default WorkoutsTable;
