import React from "react";
import { Form, Input, Checkbox, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  lastLogin?: string;
}


const getUsers = (): User[] => {
  const usersStr = localStorage.getItem("users");
  if (!usersStr) return [];
  try {
    return JSON.parse(usersStr) as User[];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const setCurrentUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values: { email: string; password: string; remember: boolean }) => {
    const email = values.email.trim().toLowerCase();
    const password = values.password;

    if (!email || !password) {
      message.error("Please enter email and password.");
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      message.error("No account found with this email.");
      return;
    }

    if (user.password !== password) {
      message.error("Incorrect password.");
      return;
    }

    user.lastLogin = new Date().toISOString();

    const userIndex = users.findIndex((u) => u.id === user.id);
    users[userIndex] = user;
    saveUsers(users);
    setCurrentUser(user);

    message.success(`✓ Welcome ${user.name}! Redirecting...`);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 40,
        padding: 24,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Title level={3} style={{ marginBottom: 24, fontWeight: "bold" }}>
        Book Your Cleaning
      </Title>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <Button
          type="primary"
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #009688 0%, #00bcd4 100%)",
            borderRadius: 20,
            fontWeight: "bold",
            height: 40,
             color: "#f5f0f0ff",
          }}
          disabled
        >
          Login
        </Button>
        <Button
          type="default"
          style={{
            flex: 1,
            borderRadius: 20,
            fontWeight: "bold",
            height: 40,
            border: "1px solid #009688",
            color: "#009688",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>

      <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            placeholder="your@email.com"
            style={{ borderRadius: 8, height: 40 }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            placeholder="Enter password"
            style={{ borderRadius: 8, height: 40 }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          initialValue={false}
          style={{ marginBottom: 0 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox>Remember me</Checkbox>
            <Text
              style={{ color: "#009688", fontWeight: 500, cursor: "pointer" }}
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot password?
            </Text>
          </div>
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: "linear-gradient(90deg, #009688 0%, #00bcd4 100%)",
              border: "none",
              borderRadius: 10,
              height: 45,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Sign In
          </Button>
        </Form.Item>

        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", textAlign: "center" }}
        >
          By continuing, you agree to our{" "}
          <a href="#" target="_blank" style={{ color: "#009688" }}>
            Terms
          </a>{" "}
          and{" "}
          <a href="#" target="_blank" style={{ color: "#009688" }}>
            Privacy Policy
          </a>
          .
        </Text>
      </Form>
    </div>
  );
};

export default Login;
