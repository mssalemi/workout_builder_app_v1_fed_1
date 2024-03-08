import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Avatar } from "antd";

import WorkoutsTable from "../components/WorkoutsTable/WorkoutsTable";
import { Workout } from "../types/types";

const { Title, Paragraph } = Typography;

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql",
          {
            query: FIND_WORKOUTS_BY_USER_QUERY,
            variables: { userId: userId },
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
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [userId]);

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Title level={2}>Workouts</Title>
        <Paragraph>
          This is your workout dashboard. Here you can view all your workouts,
          track your progress, and manage your exercise routine.
        </Paragraph>
      </Col>
      <Col span={16}>
        <Title keyboard level={4}>
          Mehdi's Recent Workouts
        </Title>
      </Col>
      <Col span={8}>
        <Title keyboard level={4}>
          Feed
        </Title>
      </Col>
      <Col span={16}>
        <WorkoutsTable workouts={workouts} />
      </Col>
    </Row>
  );
}

export default HomePage;
