import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Modal,
  message,
  Button,
  Drawer,
  Collapse,
  theme,
} from "antd";
import {
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../header/header";
import { getUserDetails } from "../../utils/helpers/storage";
import { useMediaQuery } from "react-responsive";
import "./LayoutComponent.css";

const { Content, Sider } = Layout;
const { confirm } = Modal;
const { Panel } = Collapse;

const LayoutComponent: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userDetails, setUserDetails] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = getUserDetails("user");
    setUserDetails(userData);
  }, []);

  const allMenus = [
    { key: "/app/dashboard", icon: <UserOutlined />, label: "Dashboard" },
    { key: "/app/services", icon: <NotificationOutlined />, label: "Services" },
    { key: "/app/bookings", icon: <CalendarOutlined />, label: "Bookings" },
    { key: "/app/tickets", icon: <ScheduleOutlined />, label: "Tickets" },
    { key: "/app/employees", icon: <UsergroupAddOutlined />, label: "Employees" },
    { key: "/app/reports", icon: <FileTextOutlined />, label: "CMIS-Reports" },
    { key: "/app/settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "Logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const empMenus = [
    { key: "/app/dashboard", icon: <UserOutlined />, label: "Dashboard" },
    { key: "/app/tickets", icon: <ScheduleOutlined />, label: "Tickets" },
    { key: "/app/settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "Logout", icon: <LogoutOutlined />, label: "Logout" },
  ];
const handleLogout = () => {
  confirm({
    title: "Are you sure do you want to log out?",
    icon: <ExclamationCircleOutlined />,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      className: "logout-modal-button logout-modal-button-ok", // ✅ external class
    },
    cancelButtonProps: {
      className: "logout-modal-button logout-modal-button-cancel", // ✅ external class
    },
    onOk() {
      localStorage.removeItem("user");
      message.success("Logged out successfully!");
      navigate("/landing");
    },
    onCancel() {
      message.open({
        type: "info",
        content: "Logout cancelled",
        icon: <InfoCircleOutlined style={{ color: "rgb(20, 184, 166)" }} />,
      });
    },
  });
};

  const onClick = (e: any) => {
    if (e.key === "Logout") return handleLogout();
    navigate(e.key);
    if (isMobile) setDrawerOpen(false);
  };

  const menuItems = userDetails?.role_id === 3 ? empMenus : allMenus;

  return (
    <Layout className="layout-main">
      <HeaderBar />

      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="mobile-menu-btn">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="menu-toggle-btn"
          />
        </div>
      )}

      <Layout>
        
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            width={200}
            trigger={null}
            className="layout-sider"
          >
            <div className="sider-toggle">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="toggle-btn"
              />
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={onClick}
              items={menuItems}
              theme="light"
              inlineCollapsed={collapsed}
              className="layout-menu"
            />
          </Sider>
        )}

        
        {isMobile && (
          <Drawer
            title="Navigation"
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            className="mobile-drawer"
            closeIcon={false}
          >
            <Collapse accordion className="mobile-accordion">
              <Panel header="Main Menu" key="1">
                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  onClick={onClick}
                  items={menuItems}
                  theme="light"
                  className="layout-menu"
                />
              </Panel>
            </Collapse>
          </Drawer>
        )}

        <Layout className="layout-content-wrapper">
          <Content
            className="layout-content"
            style={{
              borderRadius: borderRadiusLG,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
