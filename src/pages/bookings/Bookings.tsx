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
import {
  ClockCircleOutlined,
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  getallBookings,
  getAllUsers,
  deleteBookingById,
} from "../../app/services/auth";

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
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getAllBookingsApi = async () => {
    try {
      const data = await getallBookings();
      setBookings(data || []);
    } catch (error) {
      console.error(error);
    }
  };

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

  const openDeleteModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedBookingId(null);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBookingId) return;

    setIsDeleting(true);
    try {
      await deleteBookingById(selectedBookingId);
      message.success(`Booking #${selectedBookingId} deleted successfully.`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== selectedBookingId)
      );
      closeDeleteModal();
    } catch (error: any) {
      console.error("Failed to delete booking:", error);
      message.error(error.message || "Failed to delete booking.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    getAllBookingsApi();
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
                  variant="outlined"
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
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        {item.bookingId || "Unknown Service"}
                      </Text>

                      {/* --- ICONS FIXED BELOW --- */}
                      <Text>
                        <UserOutlined
                          style={{ marginRight: 8, color: "#0D9488" }}
                        />{" "}
                        {item.full_name || "Unknown Name"}
                      </Text>
                      <Text>
                        <PhoneOutlined
                          style={{ marginRight: 8, color: "#0D9488" }}
                        />{" "}
                        {item.phone || "Not Provided"}
                      </Text>
                      <Text>
                        <EnvironmentOutlined
                          style={{ marginRight: 8, color: "#0D9488" }}
                        />{" "}
                        {item.address || "Not Provided"}
                      </Text>
                      <Text>
                        <CalendarOutlined
                          style={{ marginRight: 8, color: "#0D9488" }}
                        />{" "}
                        {item.preferredDate || "No Date Provided"}
                      </Text>
                      {/* --- END OF FIX --- */}
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
                              className="sw-action-btn sw-assign"
                              onClick={() => openAssignModal(item.id)}
                            >
                              Assign Employee
                            </Button>

                            <Button
                              type="primary"
                              danger
                              className="sw-action-btn"
                              onClick={() => openDeleteModal(item.id)}
                            >
                              Delete Booking
                            </Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <Card
                variant="outlined"
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
        open={assignModalVisible}
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

      <Modal
        title={
          <Title level={3} style={{ color: "#d32f2f" }}>
            Confirm Deletion
          </Title>
        }
        open={deleteModalVisible}
        onCancel={closeDeleteModal}
        footer={[
          <Button key="back" onClick={closeDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={isDeleting}
            onClick={handleDeleteBooking}
          >
            Confirm Delete
          </Button>,
        ]}
      >
        <Text>Are you sure you want to delete this booking?</Text>
        {selectedBooking && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <Text strong>{selectedBooking.bookingId}</Text>
            <br />
            <Text type="secondary">
              Customer: {selectedBooking.full_name}
            </Text>
            <br />
            <Text type="secondary">Date: {selectedBooking.preferredDate}</Text>
          </div>
        )}
        <Text
          type="danger"
          style={{ display: "block", marginTop: 16, fontWeight: "bold" }}
        >
          This action cannot be undone.
        </Text>
      </Modal>
    </div>
  );
};

export default Bookings;