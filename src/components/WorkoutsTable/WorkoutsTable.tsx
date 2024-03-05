import React from "react";

import { Table, Tag, Space } from "antd";

import { Workout } from "../../types/types";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
  },
];

interface Props {
  workouts: Workout[];
}

function WorkoutsTable({ workouts }: Props) {
  // this needs endpoint to access all workouts
  const data = workouts.map((workout, index) => {
    return {
      key: index,
      title: workout.title,
      action: (
        <Space size="middle">
          <a href={`/${workout.id}`}>View</a>
        </Space>
      ),
    };
  });
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
