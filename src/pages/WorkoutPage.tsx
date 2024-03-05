import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { Result } from "antd";

import { Workout } from "../types/types";
import { WorkoutDisplay } from "../components/WorkoutDisplay";

// const FIND_WORKOUT_QUERY = `
//   query FindWorkout {
//     findWorkout(workoutId: 35) {
//       title
//       id
//       userId
//       exercises {
//         completed
//         order
//         performanceData {
//           reps
//           weight
//           sets
//         }
//         exercise {
//           id
//           title
//           description
//           bodyPartMain
//         }
//         exerciseHistoryId
//       }
//     }
//   }
// `;

const FIND_WORKOUT_QUERY = `
  query FindWorkout($workoutId: ID!) {
    findWorkout(workoutId: $workoutId) {
      title
      id
      userId
      exercises {
        completed
        order
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
  const { id } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql",
          {
            query: FIND_WORKOUT_QUERY,
            variables: {
              workoutId: id,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const {
          data: {
            data: { findWorkout },
          },
        } = response;

        setWorkout(findWorkout);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkout();
  }, [id]);

  useEffect(() => {
    console.log("[WORKOUT]: ", workout);
  }, [workout]);

  return (
    <div className="App">
      <header className="App-header">
        {workout && <WorkoutDisplay workout={workout} />}
        {!workout && (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            // extra={<Button type="primary">Back Home</Button>}
          />
        )}
      </header>
    </div>
  );
}

export default WorkoutPage;
