import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Dropdown,
  Typography,
  Space,
  AutoComplete,
  Avatar,
  Grid,
  message,
  Menu,
  Modal,
} from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import BrandLogo from "../../assets/SWACHIFY_gif.gif";
import { useNavigate } from "react-router-dom";
import "./HeaderBar.css";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;
const { confirm } = Modal;

const HeaderBar: React.FC = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user") || "null");
    if (userDetails) setUserData(userDetails);
  }, []);

  const pages = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Services", path: "/app/services" },
    { label: "Tickets", path: "/app/tickets" },
    { label: "Employees", path: "/app/employees" },
    { label: "Bookings", path: "/app/bookings" },
    { label: "Settings", path: "/app/settings" },
    { label: "CMIS-Reports", path: "/app/reports" },
  ];

  const empPages = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Tickets", path: "/app/tickets" },
    { label: "Settings", path: "/app/settings" },
  ];

  const handleSearch = (value: string) => {
    const noSpaces = value.replace(/\s/g, "");
    setSearchValue(noSpaces);

    if (!noSpaces) {
      setSearchSuggestions([]);
      return;
    }

    const filtered =
      userData.role_id === 3
        ? empPages.filter((page) =>
            page.label.toLowerCase().includes(noSpaces.toLowerCase())
          )
        : pages.filter((page) =>
            page.label.toLowerCase().includes(noSpaces.toLowerCase())
          );

    setSearchSuggestions(filtered);
  };

  const handleSelect = (value: string) => {
    const selected =
      userData.role_id === 3
        ? empPages.find(
            (page) => page.label.toLowerCase() === value.toLowerCase()
          )
        : pages.find(
            (page) => page.label.toLowerCase() === value.toLowerCase()
          );
    if (selected) {
      navigate(selected.path);
      setSearchValue("");
      setSearchSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") e.preventDefault();
    if (e.key === "Enter" && searchSuggestions.length > 0) {
      handleSelect(searchSuggestions[0].label);
    }
  };

  const handleLogout = () => {
    confirm({
      title: "Are you sure you want to log out?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        style: { backgroundColor: "rgb(20, 184, 166)", color: "#fff" },
      },
      cancelButtonProps: {
        style: { backgroundColor: "rgb(20, 184, 166)", color: "#fff" },
      },
      onOk() {
        localStorage.removeItem("user");
        message.success("Logged out successfully!");
        navigate("/landing");
      },
      onCancel() {
        message.info("Logout cancelled");
      },
    });
  };

  const userMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "logout") handleLogout();
        if (key === "settings") navigate("/app/settings");
      }}
      items={[
        { key: "settings", icon: <SettingOutlined />, label: "Settings" },
        { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
      ]}
    />
  );

  return (
    <Header className="header-bar">
      <Space align="center" className="header-logo">
        <img src={BrandLogo} alt="Logo" className="header-logo-img" />
        {!screens.xs && <Text className="header-logo-text">SWACHIFY</Text>}
      </Space>

      <Space size="middle" align="center" className="header-search">
        <AutoComplete
          options={searchSuggestions.map((item) => ({ value: item.label }))}
          value={searchValue}
          onSearch={handleSearch}
          onSelect={handleSelect}
          filterOption={false}
        >
          <Input
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Search pages..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            className="header-search-input"
          />
        </AutoComplete>
      </Space>

      <Space size="middle" align="center" className="header-avatar-space">
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Space className="header-avatar-dropdown">
            <div className="header-avatar-info">
              <Text className="header-user-name">
                {userData?.first_name || "Admin User"}
              </Text>
              <Text className="header-user-role">
                {userData?.role_id === 1
                  ? "Super Admin"
                  : userData?.role_id === 2
                  ? "Admin"
                  : "Employee"}
              </Text>
            </div>
            <Avatar className="header-avatar-circle">
              {(userData?.first_name
                ? userData.first_name.charAt(0)
                : "A"
              ).toUpperCase()}
            </Avatar>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
