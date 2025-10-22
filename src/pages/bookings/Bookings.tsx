import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Space,
  Button,
  Modal,
  Avatar,
  Tag,
  message,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getAllUsers } from "../../app/services/auth";

const { Title, Text } = Typography;

interface Booking {
  id: number;
  bookingId: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  preferredDate: string;
  status_id: number | null;
}

interface Employee {
  id: number;
  full_name: string;
  email: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // const getAllBookingsApi = async () => {
  //   try {
  //     const data = await getallBookings();
  //     setBookings(data || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getAllEmployeesApi = async () => {
    setLoadingEmployees(true);
    try {
      const data = await getAllUsers();
      setEmployees(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const openAssignModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setAssignModalVisible(true);
    setSelectedEmployeeId(null);
    getAllEmployeesApi();
  };

  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setSelectedBookingId(null);
    setSelectedEmployeeId(null);
  };

  const handleAssignEmployee = () => {
    if (selectedEmployeeId && selectedBookingId) {
      const employee = employees.find((emp) => emp.id === selectedEmployeeId);
      if (employee) {
        message.success(
          `Assigned ${employee.full_name} to booking #${selectedBookingId}`
        );
      }
      closeAssignModal();
    } else {
      message.error("Please select an employee.");
    }
  };

  useEffect(() => {
    // getAllBookingsApi();
  }, []);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ fontWeight: "bold", color: "#0a0b0bff" }}>
        Bookings Management
      </Title>

      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: 8,
          marginTop: 16,
        }}
      >
        <Row gutter={[16, 16]}>
          {bookings.length > 0 ? (
            bookings.map((item) => (
              <Col xs={24} key={item.id}>
                <Card
                  hoverable
                  bordered
                  style={{
                    borderRadius: 16,
                    transition: "all 0.3s",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.borderColor = "#0D9488";
                    target.style.borderWidth = "2px";
                    target.style.boxShadow =
                      "0 4px 15px rgba(13, 148, 136, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.borderColor = "#e5e7eb";
                    target.style.borderWidth = "1px";
                    target.style.boxShadow = "none";
                  }}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space direction="vertical">
                      <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                        {item.bookingId || "Unknown Service"}
                      </Text>
                      <Text>👤 {item.full_name || "Unknown Name"}</Text>
                      <Text>📞 {item.phone || "Not Provided"}</Text>
                      <Text>📍 {item.address || "Not Provided"}</Text>
                      <Text>🗓️ {item.preferredDate || "No Date Provided"}</Text>
                    </Space>

                    <Space direction="vertical" align="end">
                      <span
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#b45309",
                          fontWeight: "bold",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          textAlign: "center",
                        }}
                      >
                        {item.status_id === 1
                          ? "Completed"
                          : item.status_id === 2
                          ? "In Progress"
                          : "Pending"}
                      </span>

                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#0D9488",
                          borderColor: "#0D9488",
                          borderRadius: 8,
                          fontWeight: "bold",
                          marginTop: 8,
                        }}
                        onClick={() => openAssignModal(item.id)}
                      >
                        Assign Employee
                      </Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <Card
                bordered
                style={{
                  borderRadius: 16,
                  padding: "40px 0",
                  textAlign: "center",
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: 48, color: "#94a3b8", opacity: 0.5 }}
                />
                <Text strong type="secondary">
                  No pending bookings
                </Text>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      <Modal
        title={<Title level={4}>Assign Employee</Title>}
        visible={assignModalVisible}
        onCancel={closeAssignModal}
        footer={[
          <Button key="back" onClick={closeAssignModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAssignEmployee}
            style={{ backgroundColor: "#0D9488" }}
          >
            Assign
          </Button>,
        ]}
        width={600}
      >
        {selectedBooking && (
          <div>
            <Text strong>Booking Details:</Text>
            <p>
              {selectedBooking.bookingId} - {selectedBooking.full_name}
            </p>
          </div>
        )}
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            marginTop: "16px",
            paddingRight: "8px",
          }}
        >
          {loadingEmployees ? (
            <Text>Loading employees...</Text>
          ) : (
            employees.map((employee) => (
              <Card
                key={employee.id}
                hoverable
                style={{
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border:
                    selectedEmployeeId === employee.id
                      ? "2px solid #14b8a6"
                      : "1px solid #e8e8e8",
                  cursor: "pointer",
                  transition: "border 0.2s",
                  boxShadow:
                    selectedEmployeeId === employee.id
                      ? "0 0 0 2px rgba(20, 184, 166, 0.2)"
                      : "none",
                }}
                onClick={() => setSelectedEmployeeId(employee.id)}
                bodyStyle={{ padding: "12px" }}
              >
                <Row align="middle" gutter={16} wrap={false}>
                  <Col>
                    <Avatar size="large" style={{ backgroundColor: "#14b8a6" }}>
                      {(employee.full_name ?? "?").charAt(0)}
                    </Avatar>
                  </Col>
                  <Col flex="auto">
                    <Text strong>{employee.full_name || "Unknown"}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {employee.email || "No email"}
                    </Text>
                  </Col>
                  <Col>
                    <Tag color="green">Available</Tag>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;
