import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const handleAuth = async (data: {
    username: string;
    email?: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const api = isLogin
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/register";
      const response = await axios.post(api, data);
      message.success(
        isLogin ? "Login successful!" : "Signup successful! You can log in now."
      );
      login(data.username);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      if (isLogin) navigate("/dashboard");
      else navigate("/login");
    } catch {
      alert("Something went wrong. Please try again or use other credentials.");
      message.error(
        isLogin
          ? "Login failed. Please check your credentials."
          : "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Typography.Title level={2} className="login-title">
          {isLogin ? "Login to QapTodo" : "Sign up for QapTodo"}
        </Typography.Title>

        <Form name="auth-form" onFinish={handleAuth} layout="vertical">
          {!isLogin && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                  type: "email",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email" />
            </Form.Item>
          )}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </a>
        </Typography.Text>
      </Card>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} QapTodo. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> |
          <a href="/terms-of-service"> Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default Auth;
