import React, { useState, useEffect } from "react";
import { Pagination } from "antd";

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
  Tag,
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
import moment from "moment";
import {
  assignEmployeeToBooking,
  getallBookingsinBookings,
  getAllUsers,
  deleteBookingById,
} from "../../app/services/auth";
import LoaderGif from "../../assets/SWACHIFY_gif.gif";
import { useLocation } from "react-router-dom"; 
import "./Bookings.css";

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

const getStatusClass = (raw?: string) => {
  const status = raw || "Unknown";
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Open":
      return "status-open";
    case "In Progress":
    case "In-Progress":
      return "status-inprogress";
    case "Completed":
      return "status-completed";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "status-unknown";
  }
};

const getStatusText = (raw?: string) => {
  const status = raw || "Unknown";
  if (status === "In Progress" || status === "In-Progress") return "In-Progress";
  return status;
};

const Bookings: React.FC = () => {
  const location = useLocation();
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
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [totalBookings, setTotalBookings] = useState(0);
  // const [assigningEmployee, setAssigningEmployee] = useState(false);

  const normalize = (b: any) => {
    const statusText = typeof b.status === "string" ? b.status : b.status?.status || "Unknown";

    let deptName = "Unknown Department";
    if (Array.isArray(b.services) && b.services.length > 0 && b.services[0].department_name) {
      deptName = b.services[0].department_name;
    }

    let serviceNames = "N/A";
    if (Array.isArray(b.services) && b.services.length > 0) {
      const names = b.services
        .map((s: any) => s.service_name)
        .filter(Boolean)
        .join(", ");
      if (names) {
        serviceNames = names;
      }
    }

    const slotText =
      b.slot_time ||
      (typeof b.slot_id === "number" ? Slots.find((s) => s.id === b.slot_id)?.slot_time : "") ||
      "N/A";

    return {
      ...b,
      status: statusText,
      deptName: deptName,
      serviceNames: serviceNames,
      bookingIdText: b.booking_id || b.id,
      slotText: slotText,
    };
  };
   const fetchBookings = async (page = 1, limit = 20) => {
  try {
    setLoadingBookings(true);
    const offset = (page - 1) * limit;

    const raw = await getallBookingsinBookings(limit, offset);

    if (raw && Array.isArray(raw)) {
      const normalized = raw.map(normalize).sort((a: any, b: any) => b.id - a.id);
      setBookings(normalized);

      
      const estimatedTotal =
        raw.length < limit
          ? (page - 1) * limit + raw.length
          : page * limit + 1;

      setTotalBookings(estimatedTotal);
    } else {
      setBookings([]);
      setTotalBookings(0);
    }
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    message.error("Failed to load bookings. Please try again.");
  } finally {
    setLoadingBookings(false);
  }
};


  useEffect(() => {
  fetchBookings(currentPage, pageSize);
}, [currentPage, pageSize, location.state]);

  

  if (loadingBookings) {
    return (
      <div className="loader-screen">
        <img src={LoaderGif} alt="Loading..." className="loader-gif" />
        <Text className="loader-text">Loading bookings...</Text>
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
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) return true;
      const data = await response.json();
      return data.available || data.isAvailable || true;
    } catch {
      return true;
    }
  };

  const checkAllEmployeesAvailability = async (bookingId: number, employeesList: Employee[]) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || employeesList.length === 0) return employeesList;

    setCheckingAvailability(true);
    try {
      const updatedEmployees: Employee[] = await Promise.all(
        employeesList.map(async (employee): Promise<Employee> => {
          try {
            const isAvailable = await checkEmployeeAvailability(
              employee.id,
              booking.preferred_date || booking.created_date,
              booking.slot_id
            );
            return {
              ...employee,
              is_available: isAvailable,
              availability_status: isAvailable ? "available" : "unavailable",
            };
          } catch {
            return {
              ...employee,
              is_available: true,
              availability_status: "available",
            };
          }
        })
      );
      return updatedEmployees;
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
        (user: any) => user.role_id === 3 && user.is_active === true && user.is_assigned === false
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
        availability_status: "checking",
        is_available: false,
      }));
      setEmployees(employeesWithStatus);
      setLoadingEmployees(false);
      message.success(`Found ${employeesList.length} available employee(s)`);

      const updatedEmployees = await checkAllEmployeesAvailability(bookingId, employeesWithStatus);
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
      if (result && "statusUpdated" in result && result.statusUpdated === false) {
        message.warning("Employee assigned, but booking status could not be updated.");
      } else {
        message.success("Employee assigned and booking updated.");
      }
      const refreshed = await getallBookingsinBookings();
      if (refreshed) {
        const normalized = refreshed
          .map(normalize)
          .sort((a: any, b: any) => b.id - a.id)
          .filter((b: any) => b.status == "Open");
        setBookings(normalized);
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
      setBookings((prev) =>
        prev
          .filter((b: any) => b.id !== selectedBookingId)
          .filter((b: any) => b.status == "Open")
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
    <div className="bookings-root">
      <Title className="bookings-title">BOOKINGS MANAGEMENT</Title>

      <div className="scrollable-content">
        <Row gutter={[20, 20]}>
          {bookings.length > 0 ? (
            bookings.map((item: any) => {
              const statusClass = getStatusClass(item.status);
              const statusText = getStatusText(item.status);
              const dateText =
                (item.preferred_date && moment(item.preferred_date).format("MMM D,  YYYY")) ||
                (item.created_date && moment(item.created_date).format("MMM D, YYYY")) ||
                "N/A";
              const slotText = item.slotText || getSlotTime(item.slot_id);

              return (
                <Col xs={24} key={item.id}>
                  <Card className="booking-card" hoverable>
                    <Space direction="horizontal" className="booking-space">
                      <Space direction="vertical" size={4} className="booking-left">
                        <div className="services-list">
                          {item.services.map((s: any, index: number) => (
                            <div className="service-row" key={index}>
                              <Text className="service-title">
                                {s.department_name} - {s.service_name}
                              </Text>

                              <Tag className="service-tag">{s.service_type || "Standard Plan"}</Tag>
                            </div>
                          ))}
                        </div>

                        <Space direction="vertical" size={2} className="booking-info">
                          <Text className="info-text">
                            <UserOutlined className="icon-teal" />
                            {item.full_name || "N/A"}
                          </Text>
                          <Text className="info-text">
                            <PhoneOutlined className="icon-teal" />
                            {item.phone || "N/A"}
                          </Text>
                          <Text className="info-text">
                            <EnvironmentOutlined className="icon-teal" />
                            {item.address || "N/A"}
                          </Text>
                          <Text className="info-text">
                            <CalendarOutlined className="icon-teal" />
                            {dateText} - {slotText}
                          </Text>
                        </Space>
                      </Space>

                      <Space direction="vertical" align="end" size={"middle"} className="booking-right">
                        <span className={`status-badge ${statusClass}`}>{statusText}</span>

                        <Button
                          type="primary"
                          className="assign-button"
                          onClick={() => openAssignModal(item.id)}
                          disabled={item.status !== "Open"}
                        >
                          Assign Employee
                        </Button>

                        <Button
                          type="primary"
                          danger
                          className="delete-button"
                          onClick={() => openDeleteModal(item.id)}
                        >
                          Delete Booking
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col xs={24} className="no-bookings-col">
              <Card className="no-bookings-card" bordered={false}>
                <CalendarOutlined className="empty-icon" />
                <Text strong className="empty-text">
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
            <Title level={4} className="modal-title">
              Assign Employee
            </Title>
            {selectedBooking && (
              <Text type="secondary" className="modal-subtitle">
                {(selectedBooking.preferred_date &&
                  moment(selectedBooking.preferred_date).format("MMM D, YYYY")) ||
                  (selectedBooking.created_date &&
                    moment(selectedBooking.created_date).format("MMM D, YYYY"))}{" "}
                -{" "}
                {selectedBooking.slotText ||
                  Slots.find((s) => s.id === selectedBooking.slot_id)?.slot_time ||
                  "N/A"}
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
            className="assign-confirm-button"
            disabled={!selectedEmployeeId || checkingAvailability}
          >
            Assign
          </Button>,
        ]}
        width={650}
        className="assign-modal"
      >
        {/* {assigningEmployee && (
  <div className="assigning-overlay">
    <img src={LoaderGif} alt="Assigning..." className="assigning-gif" />
    <Text className="assigning-text">Assigning employee...</Text>
  </div>
)} */}

        <div className="assign-modal-body">
          {loadingEmployees ? (
            <div className="employees-loading">
              <Spin size="large" />
              <Text className="loading-employees-text">Loading employees...</Text>
            </div>
          ) : employees.length === 0 ? (
            <div className="no-employees">
              <UserOutlined className="no-employees-icon" />
              <Text type="secondary" className="no-employees-title">
                No available employees to assign.
              </Text>
              <Text type="secondary" className="no-employees-sub">
                All employees are currently assigned to other bookings.
              </Text>
            </div>
          ) : (
            employees.map((employee: Employee) => {
              const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
              const firstLetter = employee.first_name?.[0]?.toUpperCase() || "U";
              const isAvailable = employee.is_available;
              const isChecking = employee.availability_status === "checking";

              const cardClass = [
                "employee-card",
                selectedEmployeeId === employee.id ? "employee-selected" : "",
                isAvailable ? "employee-available" : "employee-unavailable",
              ]
                .filter(Boolean)
                .join(" ");

              const avatarClass = isAvailable ? "avatar-available" : "avatar-unavailable";
              const availabilityClass = isChecking
                ? "availability-checking"
                : isAvailable
                ? "availability-available"
                : "availability-unavailable";

              return (
                <Card
                  key={employee.id}
                  hoverable={!!isAvailable}
                  className={cardClass}
                  onClick={() => isAvailable && setSelectedEmployeeId(employee.id)}
                >
                  <Space className="employee-space" align="center">
                    <Space size="middle" align="center">
                      <Badge
                        count={
                          isChecking ? (
                            <LoadingOutlined className="status-icon checking" />
                          ) : isAvailable ? (
                            <CheckCircleOutlined className="status-icon available" />
                          ) : (
                            <CloseCircleOutlined className="status-icon unavailable" />
                          )
                        }
                        offset={[-5, 5]}
                        className="employee-badge"
                      >
                        <Avatar className={avatarClass} size="large">
                          {firstLetter}
                        </Avatar>
                      </Badge>

                      <div className="employee-details">
                        <div className="employee-name">{fullName || "Unnamed Employee"}</div>
                        <div className="employee-email">{employee.email}</div>
                        {employee.mobile && <div className="employee-mobile">📞 {employee.mobile}</div>}
                      </div>
                    </Space>

                    <Tooltip
                      title={isAvailable ? "Available for assignment" : "Not available for this time slot"}
                    >
                      <span className={`availability-badge ${availabilityClass}`}>
                        {isChecking ? "Checking..." : isAvailable ? "Available" : "Assigned"}
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
          <Title level={3} className="delete-modal-title">
            Confirm Deletion
          </Title>
        }
        open={deleteModalVisible}
        onCancel={closeDeleteModal}
        footer={[
          <Button key="back" onClick={closeDeleteModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" danger loading={isDeleting} onClick={handleDeleteBooking}>
            Confirm Delete
          </Button>,
        ]}
        centered
        className="delete-modal"
      >
        <Text className="delete-text">Are you sure you want to delete this booking?</Text>
        {selectedBooking && (
          <div className="delete-warning">
            <Text strong>{selectedBooking.deptName}</Text>
            <br />
            <Text type="secondary" className="delete-detail">
              Status: {selectedBooking.status || "Unknown"}
            </Text>
            <br />
            <Text type="secondary" className="delete-detail">
              Plan: {selectedBooking.serviceNames || "N/A"}
            </Text>
            <br />
            <Text type="secondary" className="delete-detail">
              Date:{" "}
              {(selectedBooking.preferred_date &&
                moment(selectedBooking.preferred_date).format("MMM D, YYYY")) ||
                (selectedBooking.created_date &&
                  moment(selectedBooking.created_date).format("MMM D, YYYY")) ||
                "N/A"}{" "}
              -{" "}
              {selectedBooking.slotText ||
                Slots.find((s) => s.id === selectedBooking.slot_id)?.slot_time ||
                "N/A"}
            </Text>
          </div>
        )}
        <Text type="danger" className="delete-note">
          This action cannot be undone.
        </Text>
      </Modal>
      <div style={{ textAlign: "center", marginTop: 20 }}>
  <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={totalBookings}
    showSizeChanger
    showQuickJumper
    onChange={(page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    }}
  />
</div>


    </div>
  );
};

export default Bookings;