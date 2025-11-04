import React from "react";
import { Card, Row, Col, Typography, Empty, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getallBookings, getallBookingsByUserId, getAllUsers } from "../../app/services/auth";
import { getUserDetails } from "../../utils/helpers/storage";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
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
      className="dashboard-wrap dashboard-padding-1"
    >
      <Title
        level={2}
        className="dashboard-margin-2"
      >
        WELCOME SWACHIFY!
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover gradient-card dashboard-color-3"
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
              className="dashboard-layout-4"
            >
              <Text
                className="dashboard-color-5"
              >
                Available Services
              </Text>
              <CheckCircleOutlined
                className="icon-bounce dashboard-color-6"
              />
            </div>
            <div>
              <Title
                level={1}
                className="dashboard-color-7"
              >
                4
              </Title>
            </div>
          </Card>
        </Col>

        {/* Pending */}
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover dashboard-style-8"
            bodyStyle={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div
              className="dashboard-layout-9"
            >
              <Text className="dashboard-color-10">
                Pending Active Bookings
              </Text>
              <ClockCircleOutlined
                className="icon-bounce dashboard-color-11"
              />
            </div>
            <div>
              <Title
                level={1}
                className="dashboard-color-12"
              >
                {dashboardTasks?.pending?.length}
              </Title>
            </div>
          </Card>
        </Col>

        {/* Open */}
        <Col xs={24} sm={12} lg={userData?.role_id !== 3 ? 6 : 8}>
          <Card
            className="stat-card-hover dashboard-style-13"
            bodyStyle={{
              padding: "28px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              className="dashboard-layout-14"
            >
              <Text className="dashboard-color-15">
                In-Progress Open Tickets
              </Text>
              <FileTextOutlined
                className="icon-bounce dashboard-color-16"
              />
            </div>
            <div>
              <Title
                level={1}
                className="dashboard-color-17"
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
              className="stat-card-hover dashboard-style-18"
              bodyStyle={{
                padding: "28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                className="dashboard-layout-19"
              >
                <Text className="dashboard-color-20">
                  Available Employees
                </Text>
                <TeamOutlined
                  className="icon-bounce dashboard-color-21"
                />
              </div>
              <div>
                <Title
                  level={1}
                  className="dashboard-color-22"
                >
                  {userList?.length}
                </Title>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Row gutter={[24, 24]} className="dashboard-margin-23">
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={4} className="dashboard-margin-24">
                Recent Bookings
              </Title>
            }
            className="dashboard-padding-25"
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
              className="dashboard-padding-26"
            >
              {dashboardTasks?.recent?.length > 0 ? (
                <div className="dashboard-layout-27">
                  {dashboardTasks.recent.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="booking-item dashboard-padding-28"
                    >
                      <div className="dashboard-style-29">
                        <Text strong className="dashboard-color-30">
                          {booking.department?.department_name
                            || (Array.isArray(booking.services) && booking.services.length > 0
                              ? booking.services.map((s: any) => `${s.department_name} - ${s.service_name}`).join(", ")
                              : `Booking #${String(booking.id ?? "").toString().slice(-6)}`)}
                        </Text>

                        <div
                          className="dashboard-layout-31"
                        >
                          <Text className="dashboard-color-32">
                            Customer:{" "}
                            <span className="dashboard-color-33">
                              {booking.full_name || "Unknown"}
                            </span>
                          </Text>
                          <Text className="dashboard-color-34">
                            Date:{" "}
                            <span className="dashboard-color-35">
                              {moment(booking?.preferred_date).format("MMMM D, YYYY")}

                              {/* {booking.preferred_date || "N/A"} */}
                            </span>
                          </Text>
                        </div>
                      </div>

                      {/* CLICKABLE TAG */}
                      <div className="dashboard-style-36">
                        <Tag
                          color={
                            booking.normalizedStatus === "Pending"
                              ? "orange"
                              : booking.normalizedStatus === "In-Progress"
                                ? "blue"
                                : "green"
                          }
                          className="dashboard-style-37"
                          onClick={() => navigate("../tickets")}
                        >
                          {booking.normalizedStatus}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="dashboard-layout-38"
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
            title={<Title level={4} className="dashboard-margin-39">Active Tickets</Title>}
            className="active-tickets-card dashboard-padding-40"
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
              className="dashboard-padding-41"
            >
              {dashboardTasks?.pending?.length > 0 ? (
                <div className="dashboard-layout-42">
                  {dashboardTasks.pending.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="booking-item dashboard-padding-43"
                    >
                      <div className="dashboard-style-44">
                        <Text strong className="dashboard-color-45">
                          {/* {booking.department?.department_name || `Booking #${booking.id.toString().slice(-6)}`} */}
                          {booking.department?.department_name
                            || (Array.isArray(booking.services) && booking.services.length > 0
                              ? booking.services.map((s: any) => `${s.department_name} - ${s.service_name}`).join(", ")
                              : `Booking #${String(booking.id ?? "").toString().slice(-6)}`)}
                        </Text>
                        <div className="dashboard-layout-46">
                          <Text className="dashboard-color-47">
                            Customer: <span className="dashboard-color-48">{booking.full_name || "Unknown"}</span>
                          </Text>
                          <Text className="dashboard-color-49">
                            Date: <span className="dashboard-color-50">
                              {moment(booking?.preferred_date).format("MMMM D, YYYY")}
                              {/* {booking.created_date || "N/A"} */}
                            </span>
                          </Text>
                        </div>
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
                          className="dashboard-style-51"
                          onClick={() => navigate("../tickets")}
                        >
                          {booking.normalizedStatus}
                        </Tag>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No active tickets"
                />
              )
              }
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
