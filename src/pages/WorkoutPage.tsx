import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import "./styles/WorkoutPage.css";
import { Result, Skeleton, Button } from "antd";

import { WorkoutDisplay } from "../components/WorkoutDisplay";

const FIND_WORKOUT_QUERY = gql`
  query FindWorkout($workoutId: Int!) {
    findWorkout(workoutId: $workoutId) {
      title
      id
      userId
      exercises {
        completed
        order
        userId
        performanceData {
          reps
          weight
          sets
        }
        exercise {
          id
          title
          description
          bodyPartMain
        }
        exerciseHistoryId
      }
    }
  }
`;

function WorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data, refetch } = useQuery(FIND_WORKOUT_QUERY, {
    variables: { workoutId: parseInt(id!, 10) },
  });

  const token = localStorage.getItem("user-token");
  console.log("🤖🤖🤖🤖🤖🤖 JWT Token:", token);

  if (loading) return <Skeleton avatar paragraph={{ rows: 6 }} />;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      <header className="App-header">
        {data?.findWorkout ? (
          <WorkoutDisplay workout={data.findWorkout} refetch={refetch} />
        ) : (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">Back Home</Button>}
          />
        )}
      </header>
    </div>
  );
}

export default WorkoutPage;
