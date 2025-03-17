import React from "react";
import { Layout, Menu, Dropdown, Button, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../assets/qapita-crop.jpg";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    console.log("Auth state changed:", isAuthenticated);
  }, [isAuthenticated]);

  const userMenu = (
    <Menu>
      <Menu.Item
        key="logout"
        onClick={() => {
          logout();
          navigate("/home");
        }}
        icon={<LogoutOutlined />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="QapTodo Logo" className="navbar-logo" />
        <Text className="navbar-title">QapTodo</Text>
      </div>
      {isAuthenticated ? (
        <Menu mode="horizontal" className="navbar-menu">
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined />}
            className="navbar-dashboard-button"
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <></>
      )}

      <div className="navbar-right">
        {isAuthenticated ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button type="text" className="navbar-user">
              <Space>
                <UserOutlined />
                {username}
              </Space>
            </Button>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button type="primary" className="navbar-login">
              Login
            </Button>
          </Link>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
