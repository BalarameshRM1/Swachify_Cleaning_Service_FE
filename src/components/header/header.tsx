import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Select,
  Dropdown,
  Typography,
  Space,
  AutoComplete,
  Avatar,
  Grid,
  message,
  Menu,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  EnvironmentFilled,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import BrandLogo from "../../assets/SWACHIFY_gif.gif";
import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "../../app/hooks";

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const HeaderBar: React.FC = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.user);

  const [userData, setUserData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
//   const [notifications] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("All Locations");

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user") || "null");
    if (userDetails) setUserData(userDetails);
  }, []);

  // Pages for global search
  const pages = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Services", path: "/app/services" },
    { label: "Tickets", path: "/app/tickets" },
    { label: "Employees", path: "/app/employees" },
    { label: "Bookings", path: "/app/bookings" },
    { label: "Settings", path: "/app/settings" },
  ];

  const handleSearch = (value: string) => {
    if (!value) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = pages.filter((page) =>
      page.label.toLowerCase().includes(value.toLowerCase())
    );
    setSearchSuggestions(filtered);
  };

  const handleSelect = ( option: any) => {
    navigate(option.path);
    setSearchValue("");
  };

  const userMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "logout") {
          localStorage.removeItem("user");
          message.success("Logged out successfully!");
          navigate("/landing");
        }
        if (key === "settings") {
          navigate("/app/settings");
        }
        if (key === "profile") {
          navigate("/app/profile");
        }
      }}
      items={[
        { key: "profile", icon: <UserOutlined />, label: "Profile" },
        { key: "settings", icon: <SettingOutlined />, label: "Settings" },
        { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
      ]}
    />
  );

  return (
    <Header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: screens.xs ? "0 12px" : "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "64px",
        lineHeight: "64px",
        flexWrap: "wrap",
      }}
    >
      {/* Logo */}
      <Space align="center" style={{ gap: screens.xs ? 8 : 12 }}>
        <img
          src={BrandLogo}
          alt="Logo"
          style={{
            width: screens.xs ? 36 : 48,
            height: screens.xs ? 36 : 48,
            paddingTop:8,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        {!screens.xs && (
          <Text
            style={{
              fontSize: screens.lg ? 28 : 24,
              fontWeight: 700,
              background: "linear-gradient(90deg, #0D9488, #14b8a6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Swachify
          </Text>
        )}
      </Space>

      {/* Search + Location */}
      <Space size="middle" align="center">
        {/* Search Bar */}
        <AutoComplete
          options={searchSuggestions.map((item) => ({
            value: item.label,
            label: item.label,
            path: item.path,
          }))}
          style={{ width: screens.xl ? 360 : screens.lg ? 320 : 280 }}
          onSearch={(value) => {
            setSearchValue(value);
            handleSearch(value);
          }}
          onSelect={handleSelect}
        >
          <Input
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Search pages..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            style={{
              borderRadius: 10,
              backgroundColor: "#f1f5f9",
              borderColor: "#e5e7eb",
              fontWeight: 500,
              color: "#334155",
              height: "36px",
            }}
          />
        </AutoComplete>

        {/* Location Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f5f9",
            borderRadius: 8,
            padding: "0 10px",
            height: "36px",
            border: "1px solid #e5e7eb",
          }}
        >
          <EnvironmentFilled style={{ color: "#ef4444", marginRight: 6 }} />
          <Select
            value={location}
            onChange={(value) => setLocation(value)}
            bordered={false}
            style={{
              width: screens.lg ? 150 : 120,
              fontWeight: 500,
              backgroundColor: "transparent",
            }}
            dropdownStyle={{ borderRadius: 8 }}
          >
            <Option value="All Locations">All Locations</Option>
            <Option value="Delhi">Delhi</Option>
            <Option value="Mumbai">Mumbai</Option>
            <Option value="Hyderabad">Hyderabad</Option>
            <Option value="Bangalore">Bangalore</Option>
          </Select>
        </div>
      </Space>

      {/* Notifications + Avatar */}
      <Space size="middle" align="center">
        <BellOutlined
          style={{ fontSize: 25, color: "#475569", cursor: "pointer" }}
        />

        {/* Avatar Dropdown */}
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Space
            style={{
              cursor: "pointer",
              gap: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                lineHeight: 1.1,
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: screens.md ? 14 : 12,
                  color: "#0f172a",
                }}
              >
                {userData?.first_name || "Admin User"}
              </Text>
              <Text type="secondary" style={{ fontSize: screens.md ? 12 : 10 }}>
                {userData?.role_id === 1
                  ? "Super Admin"
                  : userData?.role_id === 2
                  ? "Admin"
                  : "Employee"}
              </Text>
            </div>
            <Avatar
              style={{
                background: "linear-gradient(135deg, #0D9488, #14b8a6)",
                fontWeight: "bold",
              }}
            >
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
