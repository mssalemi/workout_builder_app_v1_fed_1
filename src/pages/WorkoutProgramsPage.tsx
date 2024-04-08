import { useState, useCallback, useEffect, createContext } from "react";
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
} from "@shopify/polaris";
import { ExitIcon } from "@shopify/polaris-icons";

import UserWorkoutProgramManager from "../components/UserWorkoutProgramManager/UserWorkoutProgramManager";

function WorkoutProgramsPage() {
  // Set up React Context, to hold the user data
  // RN: its only stored in local storage

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const signOut = () => {
    console.log("signing out");
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const user = localStorage.getItem("user");
    if (token) {
      setToken(token);
    }
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const UserContext = createContext<{
    token: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }>({
    user: user,
    token: token,
  });

  return (
    <Page title="WorkoutProgram Manager">
      <UserContext.Provider
        value={{
          user: user,
          token: token,
        }}
      >
        <Layout>
          <Layout.Section>
            <SignInCard
              user={user}
              setUser={setUser}
              token={token}
              setToken={setToken}
              signOut={signOut}
            />
          </Layout.Section>
          {user && token && (
            <Layout.Section>
              <UserWorkoutProgramManager></UserWorkoutProgramManager>
            </Layout.Section>
          )}
        </Layout>
      </UserContext.Provider>
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
}

const SignInCard = ({
  user,
  token,
  setUser,
  setToken,
  signOut,
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

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const user = localStorage.getItem("user");
    if (token) {
      setToken(token);
    }
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [setToken, setUser]);

  const [signIn, { loading }] = useMutation(SIGN_IN_MUTATION);

  const handleSubmit = useCallback(async () => {
    console.log("userId", userId);
    console.log("password", password);
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
      console.log("variables", variables);
      const { data } = await signIn({
        variables: variables,
      });
      console.log("data", data);
      const {
        userLogin: { token, user },
      } = data;
      console.log("token", token);
      console.log("user", user);
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
              <Text as="h2">
                Greetings, {user.name} - You are signed in!
                {user.email}
              </Text>
              <Button
                onClick={() => {
                  console.log("im not working...");
                }}
                accessibilityLabel="Sign Out"
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
                label="Email"
                type="number"
                autoComplete="email"
                helpText={
                  <span>
                    We’ll use this email address to inform you on future changes
                    to Polaris.
                  </span>
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
