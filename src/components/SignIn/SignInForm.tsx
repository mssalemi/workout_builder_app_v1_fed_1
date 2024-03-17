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

export function SignInForm() {
  const { signInUser, token, signOutUser, loading } = useAuth();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const signInFormMarkup = (
    <Form
      name="sign_in_form"
      initialValues={{ remember: true }}
      onFinish={signInUser}
      autoComplete="off"
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

  if (token) {
    return (
      <Tooltip title="Sign Out">
        <Avatar
          style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
          size="small"
          icon={<UserOutlined />}
          onClick={signOutUser}
        />
      </Tooltip>
    );
  }

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
      <UserStatusIndicator
        token={token}
        signOutUser={signOutUser}
        showSignInModal={showModal}
      />
    </>
  );
}

interface UserStatusIndicatorProps {
  token: string | null;
  signOutUser: () => void;
  showSignInModal: () => void;
}
const UserStatusIndicator = ({
  token,
  signOutUser,
  showSignInModal,
}: UserStatusIndicatorProps) => {
  const avatarStyle = token
    ? { backgroundColor: "#007bff", verticalAlign: "middle" } // Blue for signed in
    : { backgroundColor: "#007bff", verticalAlign: "middle" }; // Orange for not signed in

  const tooltipTitle = token ? "Sign Out" : "User not signed in";

  return (
    <Tooltip title={tooltipTitle}>
      <Avatar
        style={avatarStyle}
        size="small"
        icon={<UserOutlined />}
        onClick={token ? signOutUser : showSignInModal} // Only allow clicking if signed in
      />
    </Tooltip>
  );
};
