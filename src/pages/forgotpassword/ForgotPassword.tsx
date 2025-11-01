import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { ForgotPassword as forgotPasswordApi } from "../../app/services/auth"; 

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    try {
      message.loading({ content: "Updating password...", key: "loading" });

      
      const response = await forgotPasswordApi(Number(id), values);

      if (response && response.status === 200) {
        message.success({ content: "Password updated successfully!", key: "loading" });
      } else {
        message.error("Failed to update password.");
      }
    } catch (error) {
      message.error("An error occurred while resetting the password.");
    }
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
      <Title
        level={3}
        style={{ color: "#009688", marginBottom: 24, fontWeight: "bold" }}
      >
        Reset Password
      </Title>

      <Text style={{ display: "block", marginBottom: 16 }}>
        Enter your new password below.
      </Text>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your new password." },
            { min: 6, message: "Password must be at least 6 characters long." },
          ]}
        >
          <Input.Password
            placeholder="Enter new password"
            size="large"
            style={{ borderRadius: 8, height: 40 }}
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm new password"
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
            Update Password
          </Button>
        </Form.Item>

        <Form.Item style={{ marginTop: 16, textAlign: "center" }}>
          <Link
            to="/Landing"
            style={{ color: "#009688", display: "block", marginTop: 16 }}
          >
            ← Back to Login
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
