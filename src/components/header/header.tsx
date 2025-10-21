import React, { useState, useEffect } from "react";
import {
    Layout,
    Input,
    Select,
    Dropdown,
    Menu,
    Typography,
    Space,
    AutoComplete,
    Avatar,
    Grid,
    Button,
} from "antd";
import {
    BellOutlined,
    SearchOutlined,
    EnvironmentFilled,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import BrandLogo from '../../assets/SWACHIFY_gif.gif';
import { useAppSelector } from "../../app/hooks";

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const HeaderBar: React.FC = () => {
    const [notifications] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const screens = useBreakpoint();
    const { user } = useAppSelector((state) => state.user);

    const [userData,setUserData] = useState<any>(user);

    useEffect(()=>{
        let userDetails = localStorage.getItem('user');
        if(userDetails){
            setUserData((userDetails));
        }
    },[])

    const fetchSearchSuggestions = async (value: string) => {
        if (!value) {
            setSearchSuggestions([]);
            return;
        }
        const mockData = [
            "Cleaning Services",
            "Room Painting",
            "Plumbing",
            "Car Wash",
            "Gardening",
        ].filter((item) => item.toLowerCase().includes(value.toLowerCase()));
        setSearchSuggestions(mockData);
    };

    const handleSearch = (value: string) => {
        console.log("Searching:", value);
    };

    const userMenu = (
        <Menu
            items={[
                { key: "profile", icon: <UserOutlined />, label: "Profile" },
                { key: "settings", icon: <SettingOutlined />, label: "Settings" },
                { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
            ]}
        />
    );

    const mobileMenu = (
        <Menu
            style={{ borderRadius: 8 }}
            items={[
                {
                    key: "location",
                    label: (
                        <Select
                            defaultValue="All Locations"
                            style={{ width: "100%", borderRadius: 6 }}
                            dropdownStyle={{ borderRadius: 8 }}
                            suffixIcon={null}
                        >
                            <Option value="All">All Locations</Option>
                            <Option value="Delhi">Delhi</Option>
                            <Option value="Mumbai">Mumbai</Option>
                            <Option value="Hyderabad">Hyderabad</Option>
                            <Option value="Bangalore">Bangalore</Option>
                        </Select>
                    ),
                },
                {
                    key: "user",
                    label: (
                        <div style={{ textAlign: "center" }}>
                            <Text strong>Admin User</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Administrator
                            </Text>
                        </div>
                    ),
                },
                { key: "divider", type: "divider" },
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
                lineHeight:"64px",
                flexWrap: "wrap",
            }}
        >
            {/* LEFT: Logo + Name */}
            {/* LEFT: Logo + Name */}
            <Space align="center" style={{ gap: screens.xs ? 8 : 12 }}>
                <img
                    src={BrandLogo}
                    alt="Logo"
                    style={{
                        width: screens.xs ? 36 : 48, // increased size
                        height: screens.xs ? 36 : 48, // increased size
                        borderRadius: "50%",
                        objectFit: "cover",
                        // marginTop: "15%",
                        verticalAlign:"middle",
                    }}
                />
        
                {!screens.xs && (
                    <Text
                        style={{
                            fontSize: screens.lg ? 28: 24, // increased font size
                            fontWeight: 700,
                            background: "linear-gradient(90deg, #0D9488, #14b8a6)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            // lineHeight: "1",
                            verticalAlign:"middle",
                        }}
                    >
                        Swachify
                    </Text>
                )}
            </Space>


            {/* MOBILE VIEW (320px–767px): Menu Icon only */}
            {screens.xs ? (
                <Dropdown
                    overlay={mobileMenu}
                    trigger={["click"]}
                    open={menuVisible}
                    onOpenChange={setMenuVisible}
                >
                    <Button
                        icon={<MenuOutlined />}
                        type="text"
                        style={{ fontSize: 22, color: "#334155" }}
                    />
                </Dropdown>
            ) : (
                // DESKTOP/TABLET VIEW (>=768px)
                <Space align="center" size="large">
                    {/* SEARCH BAR */}
                    <AutoComplete
                        options={searchSuggestions.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                        onSearch={(value) => {
                            setSearchValue(value);
                            fetchSearchSuggestions(value);
                        }}
                        onSelect={(value) => {
                            setSearchValue(value);
                            handleSearch(value);
                        }}
                        style={{
                            width: screens.xl ? 360 : screens.lg ? 320 : 280,
                            flexShrink: 0,
                        }}
                    >
                        <Input
                            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                            placeholder="Search services..."
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                fetchSearchSuggestions(e.target.value);
                            }}
                            style={{
                                borderRadius: 10,
                                backgroundColor: "#f1f5f9",
                                borderColor: "#e5e7eb",
                                fontWeight: 500,
                                color: "#334155",
                                height: "36px",
                                verticalAlign:"middle",
                            }}
                        />
                    </AutoComplete>

                    {/* LOCATION DROPDOWN WITH ICON INSIDE PLACEHOLDER */}
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
                            defaultValue="All Locations"
                            bordered={false}
                            style={{
                                width: screens.lg ? 150 : 120,
                                fontWeight: 500,
                                backgroundColor: "transparent",
                            }}
                            dropdownStyle={{ borderRadius: 8 }}
                        >
                            <Option value="All">All Locations</Option>
                            <Option value="Delhi">Delhi</Option>
                            <Option value="Mumbai">Mumbai</Option>
                            <Option value="Hyderabad">Hyderabad</Option>
                            <Option value="Bangalore">Bangalore</Option>
                        </Select>
                    </div>

                    {/* NOTIFICATION */}
                    <Dropdown
                        overlay={
                            <Menu
                                items={
                                    notifications.length > 0
                                        ? notifications.map((note, index) => ({
                                            key: index,
                                            label: note,
                                        }))
                                        : [{ key: "none", label: "No notifications" }]
                                }
                            />
                        }
                        trigger={["click"]}
                    >
                        <BellOutlined
                            style={{
                                fontSize: 20,
                                color: "#475569",
                                cursor: "pointer",
                                verticalAlign:"middle",
                            }}
                        />
                    </Dropdown>

                    {/* USER PROFILE */}
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
                                    {user?.first_name || "Admin User"}
                                </Text>
                                <Text type="secondary" style={{ fontSize: screens.md ? 12 : 10 }}>
                                    {userData?.role == 1 ? "Super Admin" : userData?.role == 2 ? "Admin" : "Employe"}
                                </Text>
                            </div>
                            <Avatar
                                style={{
                                    background: "linear-gradient(135deg, #0D9488, #14b8a6)",
                                    fontWeight: "bold",
                                }}
                            >
                                {(userData?.first_name ? userData.first_name.charAt(0) : "A").toUpperCase()}
                            </Avatar>
                        </Space>
                    </Dropdown>
                </Space>
            )}
        </Header>
    );
};

export default HeaderBar;
