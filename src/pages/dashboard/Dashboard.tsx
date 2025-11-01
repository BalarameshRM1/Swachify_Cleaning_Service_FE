import React from "react";
import { Card, Row, Col, Typography, Empty, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getallBookings,
  getallBookingsByUserId,
  getAllUsers,
} from "../../app/services/auth";
import { getUserDetails } from "../../utils/helpers/storage";
import "./Dashboard.css";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userData = getUserDetails("user");
  const [userList, setUserList] = React.useState<any>([]);
  const [dashboardTasks, setDashboardTasks] = React.useState<any>({
    pending: [],
    inProgress: 0,
    recent: [],
  });

  const getallBookingsApi = async () => {
    try {
      if (!userData) return;
      const response =
        userData.role_id === 3
          ? await getallBookingsByUserId(userData.id)
          : await getallBookings();

      if (response) {
        const bookingsWithServiceName = response.map((b: any) => ({
          ...b,
          serviceName: b.service_name || "Unknown Service",
          normalizedStatus:
            typeof b.status === "string"
              ? b.status
              : b.status?.status || "Unknown",
        }));

        const pendingTsk = bookingsWithServiceName.filter(
          (b: any) =>
            b?.status?.status === "Pending" || b?.status === "Pending"
        );
        const inProgressTsk = bookingsWithServiceName.filter(
          (b: any) =>
            b?.status?.status === "In Progress" ||
            b?.status?.status === "In-Progress" ||
            b?.status === "In Progress" ||
            b?.status === "In-Progress"
        );
        const recentTsk = bookingsWithServiceName.slice(0, 5);

        setDashboardTasks({
          pending: pendingTsk,
          inProgress: inProgressTsk.length,
          recent: recentTsk,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getAllUsersApi = async () => {
    try {
      const response = await getAllUsers();
      return setUserList(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  React.useEffect(() => {
    document.title = "Dashboard - Swachify Admin Panel";
    getallBookingsApi();
    getAllUsersApi();
  }, []);

  return (
    <div
      className="dashboard-wrap"
      style={{
        padding: "2px",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Title
        level={2}
        style={{ marginTop: 0, marginBottom: 32, fontWeight: 700 }}
      >
        Welcome Swachify!
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover gradient-card"
            style={{
              background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
              color: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(20, 184, 166, 0.25)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              height: "160px",
            }}
            bordered={false}
            bodyStyle={{
              padding: "28px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Available Services
              </Text>
              <CheckCircleOutlined
                className="icon-bounce"
                style={{ fontSize: 36, color: "white", opacity: 0.9 }}
              />
            </div>
            <div>
              <Title
                level={1}
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                4
              </Title>
            </div>
          </Card>
        </Col>

        {/* Pending */}
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover"
            style={{
              borderRadius: "20px",
              border: "2px solid #dbeafe",
              boxShadow: "0 2px 12px rgba(37, 99, 235, 0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              height: "160px",
              background: "white",
            }}
            bodyStyle={{
              padding: "28px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: "#6b7280", fontSize: 16, fontWeight: 500 }}>
                Pending Active Bookings
              </Text>
              <ClockCircleOutlined
                className="icon-bounce"
                style={{ fontSize: 36, color: "#2563eb" }}
              />
            </div>
            <div>
              <Title
                level={1}
                style={{
                  color: "#2563eb",
                  margin: 0,
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                {dashboardTasks?.pending?.length}
              </Title>
            </div>
          </Card>
        </Col>

        {/* Open */}
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover"
            style={{
              borderRadius: "20px",
              border: "2px solid #bbf7d0",
              boxShadow: "0 2px 12px rgba(5, 150, 105, 0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              height: "160px",
              background: "white",
            }}
            bodyStyle={{
              padding: "28px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: "#6b7280", fontSize: 16, fontWeight: 500 }}>
                In-Progress Open Tickets
              </Text>
              <FileTextOutlined
                className="icon-bounce"
                style={{ fontSize: 36, color: "#059669" }}
              />
            </div>
            <div>
              <Title
                level={1}
                style={{
                  color: "#059669",
                  margin: 0,
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                {dashboardTasks?.inProgress}
              </Title>
            </div>
          </Card>
        </Col>

        {/* Employees */}
        {userData?.role_id !== 3 && (
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="stat-card-hover"
              style={{
                borderRadius: "20px",
                border: "2px solid #e9d5ff",
                boxShadow: "0 2px 12px rgba(124, 58, 237, 0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                height: "160px",
                background: "white",
              }}
              bodyStyle={{
                padding: "28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ color: "#6b7280", fontSize: 16, fontWeight: 500 }}>
                  Available Employees
                </Text>
                <TeamOutlined
                  className="icon-bounce"
                  style={{ fontSize: 36, color: "#7c3aed" }}
                />
              </div>
              <div>
                <Title
                  level={1}
                  style={{
                    color: "#7c3aed",
                    margin: 0,
                    fontSize: 48,
                    fontWeight: 700,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  {userList?.length}
                </Title>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "32px" }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                Recent Bookings
              </Title>
            }
            style={{
              borderRadius: "20px",
              height: "480px",
              border: "none",
              boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              background: "white",
            }}
            bodyStyle={{
              padding: 0,
              flex: 1,
              overflow: "hidden",
            }}
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "20px 24px",
              background: "white",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <div
              style={{
                height: "100%",
                overflowY: "auto",
                padding: "20px 24px 60px",
                background: "#fafafa",
              }}
            >
              {dashboardTasks?.recent?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {dashboardTasks.recent.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="booking-item"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px",
                        border: "none",
                        borderRadius: 12,
                        background: "white",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        gap: "20px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 10, color: '#1f2937' }}>
                          {booking.department?.department_name
                            || (Array.isArray(booking.services) && booking.services.length > 0
                                ? booking.services.map((s: any) => `${s.department_name} - ${s.service_name}`).join(", ")
                                : `Booking #${String(booking.id ?? "").toString().slice(-6)}`)}
                        </Text>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <Text style={{ fontSize: 14, color: "#6b7280" }}>
                            Customer:{" "}
                            <span style={{ color: "#374151" }}>
                              {booking.full_name || "Unknown"}
                            </span>
                          </Text>
                          <Text style={{ fontSize: 14, color: "#6b7280" }}>
                            Date:{" "}
                            <span style={{ color: "#374151" }}>
                              {booking.preferred_date || "N/A"}
                            </span>
                          </Text>
                        </div>
                      </div>

                      {/* CLICKABLE TAG */}
                      <div style={{ flexShrink: 0 }}>
                        <Tag
                          className="status-tag"
                          color={
                            booking.normalizedStatus === "Pending"
                              ? "orange"
                              : booking.normalizedStatus === "In-Progress" ||
                                booking.normalizedStatus === "In Progress"
                              ? "blue"
                              : "green"
                          }
                          style={{
                            fontWeight: "600",
                            minWidth: 110,
                            textAlign: "center",
                            padding: "8px 16px",
                            fontSize: "14px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("../bookings")}

                        >
                          {booking.normalizedStatus}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No recent bookings"
                  />
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Active Tickets Section */}
        <Col xs={24} lg={12}>
          <Card
            title={<Title level={4}>Active Tickets</Title>}
            bordered
            style={{
              borderRadius: "16px",
              height: "350px",
              overflowY: "auto",
            }}
          >
            {dashboardTasks?.pending?.length > 0 ? (
              dashboardTasks.pending.map((booking: any) => (
                <div
                  key={booking.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: "#fafafa",
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {booking.department?.department_name ||
                        `Booking #${booking.id.toString().slice(-6)}`}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Customer: {booking.full_name || "Unknown"}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Date: {booking.preferred_date || "N/A"}
                    </Text>
                  </div>

                  <div>
                  <Tag
  color={
    booking.normalizedStatus === "Pending"
      ? "orange"
      : booking.normalizedStatus === "In-Progress"
      ? "blue"
      : "green"
  }
  style={{
    fontWeight: "bold",
    minWidth: 100,
    textAlign: "center",
    cursor: "pointer",
  }}
  onClick={() => navigate("../tickets")}
>
  {booking.normalizedStatus}
</Tag>

                  </div>
                </div>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No active tickets"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
