import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Modal, InputNumber, Input, Button, Form, message } from "antd";
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

export function useAuth({
  token,
  setToken,
}: {
  token: string | null;
  setToken: (token: string | null) => void;
}) {
  const [signIn, { loading }] = useMutation(SIGN_IN_MUTATION);

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

export function SignInForm({
  setToken,
  token,
}: {
  setToken: (token: string | null) => void;
  token: string | null;
}) {
  const { signInUser, signOutUser, loading } = useAuth({
    token: token,
    setToken: setToken,
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setToken(token);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: { userId: string; password: string }) => {
    signInUser(values);
    handleOk();
  };

  const signInFormMarkup = (
    <Form
      name="sign_in_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="userId"
        rules={[{ required: true, message: "Please input your userId!" }]}
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

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {signInFormMarkup}
      </Modal>
      <UserStatusIndicator token={token} showSignInModal={showModal} />
    </>
  );
}

interface UserStatusIndicatorProps {
  token: string | null;
  showSignInModal: () => void;
}
const UserStatusIndicator = ({
  token,
  showSignInModal,
}: UserStatusIndicatorProps) => {
  const avatarStyle = token
    ? { backgroundColor: "#0095c7", verticalAlign: "middle" } // Blue for signed in
    : { backgroundColor: "#17348d", verticalAlign: "middle" }; // Orange for not signed in

  const tooltipTitle = token ? "Hello there, its time to lift!" : "Sign In";

  return (
    <Tooltip title={tooltipTitle}>
      <Avatar
        style={avatarStyle}
        icon={<UserOutlined />}
        onClick={showSignInModal} // Only allow clicking if signed in
      />
    </Tooltip>
  );
};
