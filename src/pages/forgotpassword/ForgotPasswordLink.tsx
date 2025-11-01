import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link } from "react-router-dom";

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

const sendPasswordResetEmail = async (email: string, user: User) => {
  const resetLink = `https://your-app.com/reset-password/${user.id}`;
  console.log(`Password reset link for ${email}: ${resetLink}`);
  return new Promise((resolve) => setTimeout(resolve, 1500));
};

const ForgotPasswordLink: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    const email = values.email.trim().toLowerCase();
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      message.error("No account found with this email.");
      return;
    }

    message.info("Sending reset email...");
    await sendPasswordResetEmail(email, user);
    message.success(`✓ Password reset link sent to ${email}. Check console for demo link.`);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 60,
        padding: 24,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Title level={3} style={{color: "#009688", marginBottom: 24, fontWeight: "bold"}}>
        Forgot Password
      </Title>

      <Text style={{ display: "block", marginBottom: 16 }}>
        Enter your email to receive a password reset link.
      </Text>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email." },
            { type: "email", message: "Please enter a valid email." },
          ]}
        >
          <Input
            placeholder="your@email.com"
            size="large"
            style={{ borderRadius: 8, height: 40 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
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
            Send Reset Link
          </Button>
        </Form.Item>

        <Form.Item style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/Landing" style={{ color: "#009688", display: "block", marginTop: 16 }}>
  ← Back to Login
</Link>

        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPasswordLink;
