import React, { useState } from "react";
import { Row, Col, List, Button, Input, Typography } from "antd";

import { ExerciseDetails } from "../../../types/types";

interface Props {
  setExercise: (exercise: { exerciseId: number; value: string } | null) => void;
  exercises: ExerciseDetails[];
  exercise:
    | {
        exerciseId: number;
        value: string;
      }
    | null
    | undefined;
}

export function ExerciseSearchDisplay({
  exercise,
  setExercise,
  exercises,
}: Props) {
  const [exerciseSearch, setExerciseSearch] = useState("Bench Press");
  console.log("exercise search display rendered", exercises);
  const filteredExercises = exercises.filter((exercise) =>
    exercise?.title?.toLowerCase().includes(exerciseSearch.toLowerCase())
  );
  return (
    <Row>
      <Col
        span={16}
        style={{
          padding: "1rem 0",
        }}
      >
        {" "}
        <Input
          value={exerciseSearch}
          onChange={(e) => setExerciseSearch(e.target.value)}
          disabled={exercise ? true : false}
        ></Input>
        {!exercise && (
          <List
            itemLayout="horizontal"
            dataSource={filteredExercises}
            renderItem={(exercise) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() =>
                      setExercise({
                        exerciseId: exercise.id || 0,
                        value: exercise.title || "",
                      })
                    }
                  >
                    Add
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={exercise.title}
                  description={"Focus: " + exercise.bodyPartMain}
                />
              </List.Item>
            )}
          />
        )}
      </Col>
      <Col span={16}>
        {exercise && (
          <>
            <Typography.Text keyboard>
              {exercise.value}({exercise.exerciseId})
            </Typography.Text>
          </>
        )}
      </Col>
    </Row>
  );
}
