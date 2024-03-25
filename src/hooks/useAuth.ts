import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

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
export function useAuth() {
  const [signIn, { loading }] = useMutation(SIGN_IN_MUTATION);
  const [token, setToken] = useState(localStorage.getItem("user-token"));

  const navigate = useNavigate();

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
    // Your sign-in logic here, returning the result
    if (data.userLogin.token) {
      localStorage.setItem("user-token", data.userLogin.token);
      setToken(data.userLogin.token);
      navigate("/");
    } else if (data.userLogin.errors.length) {
      message.error(data.userLogin.errors.join(", "));
    }
  };

  const signOutUser = () => {
    localStorage.removeItem("user-token");
    setToken(null);
  };

  return { token, signInUser, signOutUser, loading };
}
