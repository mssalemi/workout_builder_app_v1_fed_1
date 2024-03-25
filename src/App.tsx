import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Row, Col, Menu, Button } from "antd";
import { HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";

import { SignInForm } from "./components/SignIn/SignInForm";

import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
import NewWorkoutPage from "./pages/NewWorkoutPage";

// Set up Apollo Client
// Middleware to add the token to the headers of each request
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("user-token");
  console.log("token", token);

  // Return the headers to the context so the HTTP link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Set up Apollo Client with the auth link and HttpLink using an array
const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql", // Replace with your GraphQL endpoint
});

const client = new ApolloClient({
  link: from([authLink, httpLink]), // Use `from` to combine links into a single link
  cache: new InMemoryCache(),
});

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("user-token"));
  const clearToken = () => {
    localStorage.removeItem("user-token");
    setToken(null);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <Row>
          <Col span={24}>
            <Menu mode="horizontal">
              <Menu.Item key="user-status">
                <SignInForm setToken={setToken} token={token} />
              </Menu.Item>
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="newWorkout" icon={<AppstoreAddOutlined />}>
                <Link to="/workouts/new">Create Workout</Link>
              </Menu.Item>
              {token && (
                <Menu.Item key="sign-out" style={{ marginLeft: "auto" }}>
                  <Button onClick={clearToken}>Sign Out</Button>
                </Menu.Item>
              )}
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
    </ApolloProvider>
  );
}

export default App;
