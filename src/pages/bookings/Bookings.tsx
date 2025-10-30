import React, { useState, useEffect } from "react";
import { assignEmployeeToBooking } from "../../app/services/auth";
import {
  Card,
  Typography,
  Row,
  Col,
  Space,
  Button,
  Modal,
  Avatar,
  message,
  Spin,
  Badge,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  getallBookings,
  getAllUsers,
  deleteBookingById,
} from "../../app/services/auth";
import moment from "moment";
import LoaderGif from "../../assets/SWACHIFY_gif.gif"; 

const { Title, Text } = Typography;

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  mobile: string | null;
  age: number | null;
  gender_id: number | null;
  is_active: boolean;
  is_assigned: boolean;
  dept_id: number | null;
  location_id: number;
  depts: any[];
  is_available?: boolean;
  availability_status?: "available" | "unavailable" | "checking";
}

const Slots = [
  { id: 1, slot_time: "9AM - 11AM" },
  { id: 2, slot_time: "11AM - 1 PM" },
  { id: 3, slot_time: "1PM - 3PM" },
  { id: 4, slot_time: "3PM - 5 PM" },
];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true); 
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true); 
        const bookingsData = await getallBookings();
        if (bookingsData) {
          bookingsData.sort((a: any, b: any) => b.id - a.id);
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoadingBookings(false); 
      }
    };
    fetchBookings();
  }, []);

  
  if (loadingBookings) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
        }}
      >
        <img
          src={LoaderGif}
          alt="Loading..."
          style={{ width: 180, height: 180, marginBottom: 16 }}
        />
        <Text style={{ fontSize: 16, color: "#0D9488" }}>Loading bookings...</Text>
      </div>
    );
  }

  
  const checkEmployeeAvailability = async (
    employeeId: number,
    bookingDate: string,
    slotId: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://swachifyapi-fpcub9f8dcgjbzcq.centralindia-01.azurewebsites.net/api/check-availability?employeeId=${employeeId}&date=${bookingDate}&slotId=${slotId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.warn(`Availability check failed for employee ${employeeId}`);
        return true;
      }
      const data = await response.json();
      return data.available || data.isAvailable || true;
    } catch (error) {
      console.error("Error checking availability:", error);
      return true;
    }
  };

  const checkAllEmployeesAvailability = async (
    bookingId: number,
    employeesList: Employee[]
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || employeesList.length === 0) {
      return employeesList;
    }
    setCheckingAvailability(true);
    try {
      const updatedEmployees: Employee[] = await Promise.all(
        employeesList.map(async (employee): Promise<Employee> => {
          try {
            const isAvailable = await checkEmployeeAvailability(
              employee.id,
              booking.preferred_date,
              booking.slot_id
            );
            return {
              ...employee,
              is_available: isAvailable,
              availability_status: isAvailable
                ? ("available" as const)
                : ("unavailable" as const),
            };
          } catch (error) {
            console.error(`Error checking availability for employee ${employee.id}:`, error);
            return {
              ...employee,
              is_available: true,
              availability_status: "available" as const,
            };
          }
        })
      );
      return updatedEmployees;
    } catch (error) {
      console.error("Error in checkAllEmployeesAvailability:", error);
      return employeesList;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const openAssignModal = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setAssignModalVisible(true);
    setSelectedEmployeeId(null);
    setLoadingEmployees(true);

    try {
      const data = await getAllUsers();
      if (!data || data.length === 0) {
        setEmployees([]);
        message.warning("No users found in the system");
        setLoadingEmployees(false);
        return;
      }
      const employeesList = data.filter(
        (user: any) =>
          user.role_id === 3 && user.is_active === true && user.is_assigned === false
      );
      if (employeesList.length === 0) {
        setEmployees([]);
        message.warning("No available employees. All employees are currently assigned.");
        setLoadingEmployees(false);
        return;
      }
      const employeesWithStatus: Employee[] = employeesList.map((emp: any) => ({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        role_id: emp.role_id,
        mobile: emp.mobile,
        age: emp.age,
        gender_id: emp.gender_id,
        is_active: emp.is_active,
        is_assigned: emp.is_assigned,
        dept_id: emp.dept_id,
        location_id: emp.location_id,
        depts: emp.depts || [],
        availability_status: "checking" as const,
        is_available: false,
      }));
      setEmployees(employeesWithStatus);
      setLoadingEmployees(false);
      message.success(`Found ${employeesList.length} available employee(s)`);
      const updatedEmployees = await checkAllEmployeesAvailability(
        bookingId,
        employeesWithStatus
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error in openAssignModal:", error);
      message.error("Failed to load employees");
      setEmployees([]);
      setLoadingEmployees(false);
    }
  };

  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setSelectedBookingId(null);
    setSelectedEmployeeId(null);
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployeeId || !selectedBookingId) {
      message.error("Please select an employee.");
      return;
    }
    const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);
    if (selectedEmployee && selectedEmployee.is_assigned) {
      message.error("This employee is already assigned to another booking.");
      return;
    }
    try {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === selectedEmployeeId ? { ...e, is_assigned: true, is_available: false } : e
        )
      );
      const result = await assignEmployeeToBooking(selectedBookingId, selectedEmployeeId);
      if (result && result.statusUpdated === false) {
        message.warning("Employee assigned, but booking status could not be updated.");
      } else {
        message.success("Employee assigned and booking updated.");
      }
      const bookingsData = await getallBookings();
      if (bookingsData) {
        bookingsData.sort((a: any, b: any) => b.id - a.id);
        setBookings(bookingsData || []);
      }
      closeAssignModal();
    } catch (error: any) {
      console.error("Assign failed:", error);
      setEmployees((prev) =>
        prev.map((e) => (e.id === selectedEmployeeId ? { ...e, is_assigned: false } : e))
      );
      message.error(error?.message || "Failed to assign employee.");
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
      setBookings((prevBookings: any[]) =>
        prevBookings.filter((booking: any) => booking.id !== selectedBookingId)
      );
      closeDeleteModal();
    } catch (error: any) {
      console.error("Failed to delete booking:", error);
      message.error(error.message || "Failed to delete booking.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSlotTime = (slotId: number): string => {
    const slot = Slots.find((s) => s.id === slotId);
    return slot ? slot.slot_time : "No Time";
  };

  const selectedBooking = bookings.find((b: any) => b.id === selectedBookingId);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ fontWeight: "bold", color: "#0a0b0bff", marginBottom: 24 }}>
        Bookings Management
      </Title>

      <div
        className="scrollable-content"
        style={{
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          paddingRight: 12,
          paddingLeft: 4,
          paddingBottom: 60,
        }}
      >
        <Row gutter={[20, 20]}>
          {bookings.length > 0 ? (
            bookings.map((item: any) => (
              <Col xs={24} key={item.id}>
                <Card
                  hoverable
                  variant="outlined"
                  style={{
                    borderRadius: 16,
                    transition: "all 0.3s",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cursor: "default",
                  }}
                  bodyStyle={{ padding: "20px 24px  " }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.borderColor = "#0D9488";
                    target.style.borderWidth = "2px";
                    target.style.boxShadow = "0 4px 15px rgba(13, 148, 136, 0.3)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
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
                    <Space direction="vertical" size={4}>
                      <Title
                        level={5}
                        style={{
                          fontSize: 16,
                          color: "#115e59",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {item.department?.department_name || "Unknown Department"}
                      </Title>

                      <Text
                        type="secondary"
                        style={{ fontSize: 13, fontWeight: 500, paddingBottom: 4 }}
                      >
                        Plan:{" "}
                        {item.is_premium
                          ? "Premium"
                          : item.is_ultimate
                          ? "Ultimate"
                          : item.is_regular
                          ? "Regular"
                          : "N/A"}
                      </Text>

                      <Space direction="vertical" size={2} style={{ paddingTop: 8 }}>
                        <Text style={{ fontSize: 14 }}>
                          <UserOutlined style={{ marginRight: 6, color: "#14b8a6" }} />
                          {item.full_name || "N/A"}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          <PhoneOutlined style={{ marginRight: 6, color: "#14b8a6" }} />
                          {item.phone || "N/A"}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          <EnvironmentOutlined style={{ marginRight: 6, color: "#14b8a6" }} />
                          {item.address || "N/A"}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          <CalendarOutlined style={{ marginRight: 6, color: "#14b8a6" }} />
                          {item.preferred_date
                            ? moment(item.preferred_date).format("MMM D, YYYY")
                            : "N/A"}{" "}
                          - {getSlotTime(item.slot_id)}
                        </Text>
                      </Space>
                    </Space>

                    <Space direction="vertical" align="end" size={"middle"}>
                      <span
                        style={{
                          backgroundColor:
                            item.status?.status === "Pending"
                              ? "#fef3c7"
                              : item.status?.status === "Open"
                              ? "#e0f2fe"
                              : item.status?.status === "Completed"
                              ? "#dcfce7"
                              : item.status?.status === "In-Progress"
                              ? "#ccfbf1"
                              : "#f3f4f6",
                          color:
                            item.status?.status === "Pending"
                              ? "#b45309"
                              : item.status?.status === "Open"
                              ? "#0284c7"
                              : item.status?.status === "Completed"
                              ? "#15803d"
                              : item.status?.status === "In-Progress"
                              ? "#0f766e"
                              : "#4b5563",
                          fontWeight: "bold",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          textAlign: "center",
                          minWidth: 100,
                          fontSize: 12,
                        }}
                      >
                        {item.status?.status || "Unknown"}
                      </span>
                      <Button
                        type="primary"
                        className="sw-action-btn sw-assign"
                        onClick={() => openAssignModal(item.id)}
                        disabled={!item.status || item.status.status !== "Open"}
                        style={{
                          backgroundColor: "#0D9488",
                          borderColor: "#0D9488",
                        }}
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
            <Col xs={24} style={{ textAlign: "center", marginTop: 40 }}>
              <Card
                variant="outlined"
                style={{
                  borderRadius: 16,
                  padding: "40px 0",
                  borderColor: "#e5e7eb",
                }}
              >
                <CalendarOutlined
                  style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 16 }}
                />
                <br />
                <Text strong type="secondary" style={{ fontSize: 16, color: "#9ca3af" }}>
                  No bookings found.
                </Text>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      {/* Assign Employee Modal */}
      <Modal
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>Assign Employee</Title>
            {selectedBooking && (
              <Text type="secondary" style={{ fontSize: 13 }}>
                {moment(selectedBooking.preferred_date).format("MMM D, YYYY")} -{" "}
                {getSlotTime(selectedBooking.slot_id)}
              </Text>
            )}
          </div>
        }
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
            style={{ backgroundColor: "#0D9488", borderColor: "#0D9488" }}
            disabled={!selectedEmployeeId || checkingAvailability}
          >
            Assign
          </Button>,
        ]}
        width={650}
        bodyStyle={{ padding: "16px 24px" }}
      >
        {checkingAvailability && (
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              background: "#f0f9ff",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <Text style={{ display: "block", marginTop: 12, color: "#0284c7" }}>
              Checking employee availability...
            </Text>
          </div>
        )}

        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
            marginTop: 16,
            paddingRight: 8,
          }}
        >
          {loadingEmployees ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" />
              <Text style={{ display: "block", marginTop: 12 }}>Loading employees...</Text>
            </div>
          ) : employees.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <UserOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 16 }} />
              <br />
              <Text type="secondary" style={{ fontSize: 15 }}>
                No available employees to assign.
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 8 }}>
                All employees are currently assigned to other bookings.
              </Text>
            </div>
          ) : (
            employees.map((employee: Employee) => {
              const fullName = `${employee.first_name || ""} ${
                employee.last_name || ""
              }`.trim();
              const firstLetter = employee.first_name?.[0]?.toUpperCase() || "U";
              const isAvailable = employee.is_available;
              const isChecking = employee.availability_status === "checking";

              return (
                <Card
                  key={employee.id}
                  hoverable={isAvailable}
                  style={{
                    marginBottom: 12,
                    borderRadius: 12,
                    border:
                      selectedEmployeeId === employee.id
                        ? "2px solid #14b8a6"
                        : isAvailable
                        ? "1px solid #e8e8e8"
                        : "1px solid #fca5a5",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    boxShadow:
                      selectedEmployeeId === employee.id
                        ? "0 0 0 2px rgba(20, 184, 166, 0.2)"
                        : "none",
                    userSelect: "none",
                    opacity: isAvailable ? 1 : 0.6,
                    background: isAvailable ? "#ffffff" : "#fef2f2",
                  }}
                  onClick={() => isAvailable && setSelectedEmployeeId(employee.id)}
                  bodyStyle={{ padding: 16 }}
                >
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                    align="center"
                  >
                    <Space size="middle" align="center">
                      <Badge
                        count={
                          isChecking ? (
                            <LoadingOutlined style={{ color: "#14b8a6" }} />
                          ) : isAvailable ? (
                            <CheckCircleOutlined
                              style={{ color: "#22c55e", fontSize: 18 }}
                            />
                          ) : (
                            <CloseCircleOutlined
                              style={{ color: "#ef4444", fontSize: 18 }}
                            />
                          )
                        }
                        offset={[-5, 5]}
                      >
                        <Avatar
                          style={{
                            backgroundColor: isAvailable ? "#14b8a6" : "#9ca3af",
                            verticalAlign: "middle",
                          }}
                          size="large"
                        >
                          {firstLetter}
                        </Avatar>
                      </Badge>
                      <div>
                        <div style={{ fontSize: 16, lineHeight: 1.2, fontWeight: 500 }}>
                          {fullName || "Unnamed Employee"}
                        </div>
                        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                          {employee.email}
                        </div>
                        {employee.mobile && (
                          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                            📞 {employee.mobile}
                          </div>
                        )}
                      </div>
                    </Space>

                    <Tooltip
                      title={
                        isAvailable
                          ? "Available for assignment"
                          : "Not available for this time slot"
                      }
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: isAvailable ? "#dcfce7" : "#fee2e2",
                          color: isAvailable ? "#15803d" : "#991b1b",
                        }}
                      >
                        {isChecking
                          ? "Checking..."
                          : isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </Tooltip>
                  </Space>
                </Card>
              );
            })
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title={
          <Title level={3} style={{ color: "#ef4444" }}>
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
        centered
      >
        <Text style={{ fontSize: 15 }}>
          Are you sure you want to delete this booking?
        </Text>
        {selectedBooking && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#fff1f2",
              borderRadius: 8,
              border: "1px solid #ffccc7",
            }}
          >
            <Text strong>
              {selectedBooking.department?.department_name || "N/A"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Plan: {selectedBooking.services || "N/A"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Customer: {selectedBooking.full_name || "N/A"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Date:{" "}
              {moment(selectedBooking.preferred_date).format("MMM D, YYYY") ||
                "N/A"}{" "}
              - {getSlotTime(selectedBooking.slot_id)}
            </Text>
          </div>
        )}
        <Text
          type="danger"
          style={{ display: "block", marginTop: 16, fontWeight: "600" }}
        >
          This action cannot be undone.
        </Text>
      </Modal>
    </div>
  );
};

export default Bookings;