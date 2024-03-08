import React from "react";

import { Table, Tag, Space } from "antd";

import { Workout } from "../../types/types";

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
    title: "View",
    key: "action",
    dataIndex: "action",
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
        title: workout.title,
        action: (
          <Space size="middle">
            <a href={`/${workout.id}`}>View</a>
          </Space>
        ),
      };
    })
    .filter((workout, index) => index < 5);
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
