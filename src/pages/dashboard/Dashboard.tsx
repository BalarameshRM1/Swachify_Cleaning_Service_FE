import React from "react";
import { Card, Row, Col, Typography, Space, Empty } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getallBookings, getAllUsers } from "../../app/services/auth";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {

  // const [allBookings, setAllBookings] = React.useState<any>([]);
  const [userList, setUserList] = React.useState<any>([]);
  const [dashboardTasks, setDashboardTasks] = React.useState<any>({
    pending: [],
    inProgress: 0,
    recent: [],
  });

  const getallBookingsApi = async () => {
    try {
      const response = await getallBookings()
      if(response) {
        // console.log("Bookings API Response:", response);
        const pendingTsk = response.filter((booking: any) => booking?.status?.status === "Pending");
        const inProgressTsk = response.filter((booking: any) => booking?.status?.status === "In Progress");
        const recentTsk = response?.slice(0, 5);
      setDashboardTasks({
        pending: pendingTsk,
        inProgress: inProgressTsk.length,
        recent: recentTsk,
      });
      // console.log("Bookings API Response:", {
      //   pending: pendingTsk,
      //   inProgress: inProgressTsk.length,
      //   recent: recentTsk,
      // });
      // return setAllBookings(response.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

    const getAllUsersApi = async () => {
    try {
      const response = await getAllUsers()
      // if (!response.ok) {
      //   throw new Error("Failed to fetch bookings");
      // }
      return setUserList(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  React.useEffect(() => {
    document.title = "Dashboard - Swachify Admin Panel";

    getallBookingsApi();
    getAllUsersApi();

    ()=> {
      getallBookingsApi();
      getAllUsersApi();
    }
    
  }, []);

  return (
    <div className="dashboard-wrap">
      <Title level={2} style={{ marginTop: 0 }}>Welcome Back! 👋</Title>

      
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(to bottom right, #14b8a6, #06b6d4)",
              color: "white",
              borderRadius: "16px",
            }}
            bordered={false}
          >
            <Space
              align="start"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#ccfbf1" }}>Total Services</Text>
              <CheckCircleOutlined style={{ fontSize: 28, color: "white" }} />
            </Space>
            <Title level={2} style={{ color: "white", marginTop: "8px" }}>
              4
            </Title>
            <Text style={{ color: "#ccfbf1", fontSize: 12 }}>All time</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderColor: "#bfdbfe",
              borderRadius: "16px",
            }}
          >
            <Space
              align="start"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text type="secondary">Active Bookings</Text>
              <ClockCircleOutlined style={{ fontSize: 28, color: "#2563eb" }} />
            </Space>
            <Title level={2} style={{ color: "#2563eb", marginTop: "8px" }}>
              {dashboardTasks?.pending?.length}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Pending assignment
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderColor: "#a7f3d0",
              borderRadius: "16px",
            }}
          >
            <Space
              align="start"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text type="secondary">Open Tickets</Text>
              <FileTextOutlined style={{ fontSize: 28, color: "#059669" }} />
            </Space>
            <Title level={2} style={{ color: "#059669", marginTop: "8px" }}>
              {dashboardTasks?.inProgress}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              In progress
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderColor: "#ddd6fe",
              borderRadius: "16px",
            }}
          >
            <Space
              align="start"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text type="secondary">Employees</Text>
              <TeamOutlined style={{ fontSize: 28, color: "#7c3aed" }} />
            </Space>
            <Title level={2} style={{ color: "#7c3aed", marginTop: "8px" }}>
              {userList?.length}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Available staff
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12} >
          <Card
            title={<Title level={4}>Recent Bookings</Title>}
            bordered
            style={{ borderRadius: "16px",height: "350px", overflowY: "auto"}}
          >{
            dashboardTasks?.recent?.length > 0 ? (
              dashboardTasks?.recent?.map((booking: any) => (
                <div key={booking.id} style={{ marginBottom: "12px", }}>
                  <Text strong>Booking #{booking.id.toString().slice(-6)}</Text>
                  <Text type="secondary">{booking.serviceName}</Text>
                  <br />
                  <Text type="secondary">
                    Status: {booking?.status?.status}
                  </Text>
                </div>
              ))
            ) : <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No recent bookings"
            />
          }
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={<Title level={4}>Active Tickets</Title>}
            bordered
            style={{ borderRadius: "16px", height: "350px", overflowY: "auto" }}
          >
            {
            dashboardTasks?.pending?.length > 0 ? (
              dashboardTasks?.pending?.map((booking: any) => (
                <div key={booking.id} style={{ marginBottom: "12px", }}>
                  <Text strong>Booking #{booking.id.toString().slice(-6)}</Text>
                  <Text type="secondary">{booking.serviceName}</Text>
                  <br />
                  <Text type="secondary">
                    Status: {booking?.status?.status}
                  </Text>
                </div>
              ))
            ) :  <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No active tickets"
            />
          }
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
