import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { InputNumber, Input, Button, Form, message } from "antd";
import { Avatar, Typography, Tooltip } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
const { Text } = Typography;

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

export function SignInForm() {
  const [signIn, { loading }] = useMutation(SIGN_IN_MUTATION);
  const navigate = useNavigate();

  const token = localStorage.getItem("user-token");
  console.log("🤖🤖🤖🤖🤖🤖 JWT Token:", token);

  const onFinish = async (values: { userId: string; password: string }) => {
    try {
      console.log("Received values of form: ", values);
      const variables = {
        input: {
          userId: parseInt(values.userId),
          password: values.password,
        },
      };

      console.log("variables", variables);
      const { data } = await signIn({
        variables: variables,
      });
      console.log("data", data);

      if (data.userLogin.token) {
        localStorage.setItem("user-token", data.userLogin.token);
        navigate("/");
      } else if (data.userLogin.errors.length) {
        message.error(data.userLogin.errors.join(", "));
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      message.error("An error occurred during sign-in. Please try again.");
    }
  };

  if (token) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar icon={<UserOutlined />} />
        <Text>User Signed In</Text>
        <Tooltip title="Sign out">
          <Button
            shape="circle"
            icon={<LogoutOutlined />}
            onClick={() => localStorage.removeItem("user-token")}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <Form
      name="sign_in_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Username"
        name="userId"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}
