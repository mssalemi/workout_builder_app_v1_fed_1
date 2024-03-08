import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Row, Col, Menu } from "antd";
import { HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";

import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
import NewWorkoutPage from "./pages/NewWorkoutPage";

function App() {
  return (
    <Router>
      <Row>
        <Col span={24}>
          <Menu mode="horizontal">
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="newWorkout" icon={<AppstoreAddOutlined />}>
              <Link to="/workouts/new">Create Workout</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col
          span={24}
          style={{
            padding: "0 2rem",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:id" element={<WorkoutPage />} />
            <Route path="/workouts/new" element={<NewWorkoutPage />} />
          </Routes>
        </Col>
      </Row>
    </Router>
  );
}

export default App;
