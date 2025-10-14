import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
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

const saveUsers = (newUsers: User[]) => {
  localStorage.setItem("users", JSON.stringify(newUsers));
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const email = values.email.trim().toLowerCase();

    const users = getUsers();
    const userExists = users.some((u) => u.email === email);

    if (userExists) {
      message.error("Email is already registered.");
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      password: values.password,
      name: values.fullName,
      phone: values.phone,
    };

    users.push(newUser);
    saveUsers(users);

    message.success("Account created successfully! Please login.");

    navigate("/login");
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
        Create Your Account
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input
            placeholder="Your full name"
            style={{ borderRadius: 8, height: 40 }}
            size="large"
          />
        </Form.Item>

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
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
            {
              pattern: /^\+?[0-9]{7,15}$/,
              message: "Please enter a valid phone number!",
            },
          ]}
        >
          <Input
            placeholder="+1234567890"
            style={{ borderRadius: 8, height: 40 }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 6, message: "Password must be minimum 6 characters." },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Enter password"
            style={{ borderRadius: 8, height: 40 }}
            size="large"
          />
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
            Create Account
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

        <Text
          style={{
            display: "block",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#009688", fontWeight: 600 }}>
            Login
          </Link>
        </Text>
      </Form>
    </div>
  );
};

export default Register;
