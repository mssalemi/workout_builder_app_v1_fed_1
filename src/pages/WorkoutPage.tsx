import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import { Workout } from "../types/types";
import { WorkoutDisplay } from "../components/WorkoutDisplay";

const FIND_WORKOUT_QUERY = `
  query FindWorkout {
    findWorkout(workoutId: 35) {
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

  console.log("id", id);
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql",
          { query: FIND_WORKOUT_QUERY },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
        const {
          data: {
            data: { findWorkout },
          },
        } = response;

        console.log(findWorkout);
        setWorkout(findWorkout);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkout();
  }, []);

  useEffect(() => {
    console.log("[WORKOUT]: ", workout);
  }, [workout]);

  return (
    <div className="App">
      <header className="App-header">
        {workout && <WorkoutDisplay workout={workout} />}
        {!workout && <p>Loading...</p>}
      </header>
    </div>
  );
}

export default WorkoutPage;
