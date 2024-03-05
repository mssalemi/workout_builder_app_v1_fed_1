import React, { useEffect, useState } from "react";
import axios from "axios";

import WorkoutsTable from "../components/WorkoutsTable/WorkoutsTable";
import { Workout } from "../types/types";

const FIND_WORKOUTS_BY_USER_QUERY = `
  query FindWorkoutsByUser($userId: ID!) {
    findWorkoutsByUser(userId: $userId) {
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

function HomePage() {
  const userId = 1;
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  console.log(workouts);
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql",
          {
            query: FIND_WORKOUTS_BY_USER_QUERY,
            variables: {
              userId: userId,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const {
          data: {
            data: { findWorkoutsByUser },
          },
        } = response;

        setWorkouts(findWorkoutsByUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkouts();
  }, [userId]);

  return (
    <div>
      <WorkoutsTable workouts={workouts} />
    </div>
  );
}

export default HomePage;
