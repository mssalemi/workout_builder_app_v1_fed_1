import { useState, useCallback, useEffect, useReducer } from "react";
import { useMutation, gql } from "@apollo/client";

import {
  Page,
  Card,
  Text,
  FormLayout,
  TextField,
  Form,
  Button,
  BlockStack,
  InlineGrid,
  Spinner,
  Grid,
  Layout,
  Banner,
} from "@shopify/polaris";
import { ExitIcon } from "@shopify/polaris-icons";

import UserWorkoutProgramManager from "../components/UserWorkoutProgramManager/UserWorkoutProgramManager";

interface UserState {
  id: string;
  name: string;
  email: string;
}

function WorkoutProgramsPage() {
  // Set up React Context, to hold the user data
  // RN: its only stored in local storage

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserState | null>(null);

  const signOut = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const initialState: {
    user: UserState | null;
    token: string | null;
  } = {
    user: user,
    token: token,
  };

  const ourReducer = (
    state: {
      user: UserState | null;
      token: string | null;
    },
    action: { type: string }
  ) => {
    switch (action.type) {
      case "LOGOUT":
        signOut();
        const newState = { ...state, user: null, token: null };
        return newState;
      case "LOGIN":
        return {
          user: user,
          token: token,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(ourReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const user = localStorage.getItem("user");
    if (token) {
      setToken(token);
    }
    if (user) {
      setUser(JSON.parse(user));
    }
    if (user && token) {
      dispatch({ type: "LOGIN" });
    }
  }, []);

  const toggleUserLogout = () => {
    const action = { type: "LOGOUT" };
    dispatch(action);
  };

  const toggleUserLogin = () => {
    const action = { type: "LOGIN" };
    dispatch(action);
  };

  useEffect(() => {
    // console.log("[WorkoutProgramV2] Global User State", state);
  }, [state]);

  return (
    <Page title="Workout Program Manager v1">
      <Layout>
        <Layout.Section>
          <Banner title="This app is in development" tone="info"></Banner>
        </Layout.Section>
        <Layout.Section>
          <SignInCard
            user={state.user}
            setUser={setUser}
            token={state.token}
            toggleUserLogin={toggleUserLogin}
            setToken={setToken}
            signOut={toggleUserLogout}
          />
        </Layout.Section>
        {state.user && state.token && (
          <Layout.Section>
            <UserWorkoutProgramManager></UserWorkoutProgramManager>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}

interface SignInCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  setToken: (token: string | null) => void;
  token: string | null;
  signOut: () => void;
  toggleUserLogin: () => void;
}

const SignInCard = ({
  user,
  token,
  setUser,
  setToken,
  signOut,
  toggleUserLogin,
}: SignInCardProps) => {
  const [userId, setUserId] = useState("1");
  const [password, setPassword] = useState("");

  const SIGN_IN_MUTATION = gql`
    mutation UserLogin($input: UserLoginInput!) {
      userLogin(input: $input) {
        token
        user {
          id
          name
          email
        }
        errors
      }
    }
  `;

  const [signIn, { loading }] = useMutation(SIGN_IN_MUTATION);

  const handleSubmit = useCallback(async () => {
    const signInUser = async ({
      userId,
      password,
    }: {
      userId: string;
      password: string;
    }) => {
      const variables = {
        input: {
          userId: parseInt(userId),
          password: password,
        },
      };
      console.log("Variables", variables);
      const { data } = await signIn({
        variables: variables,
      });
      const {
        userLogin: { token, user },
      } = data;
      console.log(data);
      if (data.userLogin.token) {
        localStorage.setItem("user-token", data.userLogin.token);
        localStorage.setItem("user", JSON.stringify(data.userLogin.user));
        setToken(data.userLogin.token);
      } else if (data.userLogin.errors.length) {
        console.log("Opps, something went wrong!");
        console.log(data.userLogin.errors.join(", "));
      }
      if (user) {
        setUser(user);
        toggleUserLogin();
      } else {
        console.log("Opps, No user found!");
      }
    };
    signInUser({ userId, password });
  }, [password, userId, signIn, setToken, setUser]);

  const handleUserIdChange = useCallback(
    (value: string) => setUserId(value),
    []
  );

  const handlePasswordChange = useCallback(
    (value: string) => setPassword(value),
    []
  );

  if (loading) {
    return (
      <Card>
        <Grid>
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </Grid>
      </Card>
    );
  }

  return (
    <Card>
      {user && (
        <>
          <BlockStack gap="200">
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingMd">
                Greetings, {user.name} - You are signed in!
                {user.email}
              </Text>
              <Button
                onClick={() => {
                  signOut();
                }}
                icon={ExitIcon}
              ></Button>
            </InlineGrid>
          </BlockStack>
        </>
      )}
      {!user && (
        <>
          <Text as="h1">Sign In</Text>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                value={userId}
                onChange={handleUserIdChange}
                label="User ID"
                type="number"
                autoComplete="number"
                helpText={
                  <span>We’ll use this user id to inform to login.</span>
                }
              />
              <TextField
                value={password}
                onChange={handlePasswordChange}
                label="Password"
                type="password"
                autoComplete="current-password"
              />

              <Button submit>Submit</Button>
            </FormLayout>
          </Form>
        </>
      )}
    </Card>
  );
};

export default WorkoutProgramsPage;
