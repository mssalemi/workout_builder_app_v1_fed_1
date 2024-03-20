import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Carousel, Skeleton } from "antd";

import WorkoutsTable from "../components/WorkoutsTable/WorkoutsTable";
import { Workout } from "../types/types";

const { Title, Paragraph } = Typography;

const FIND_WORKOUTS_BY_USER_QUERY = `
  query FindWorkoutsByUser {
    findWorkoutsByUser {
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

const contentStyle: React.CSSProperties = {
  height: "320px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

function HomePage() {
  const userId = 1;
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("user-token");
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/graphql",
          {
            query: FIND_WORKOUTS_BY_USER_QUERY,
          },
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
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
      <Col span={24}>
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
        {loading ? <Skeleton active /> : <WorkoutsTable workouts={workouts} />}
      </Col>
      <Col span={8}>
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </Col>
    </Row>
  );
}

export default HomePage;
