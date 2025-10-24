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
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  getallBookings,
  getAllUsers,
  deleteBookingById,
} from "../../app/services/auth"; //
import moment from "moment";

const { Title, Text } = Typography;

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const Slots = [
  { id: 1, slot_time: "9AM - 11AM" },
  { id: 2, slot_time: "11AM - 1 PM" },
  { id: 3, slot_time: "1PM - 3PM" },
  { id: 4, slot_time: "3PM - 5 PM" },
];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getallBookings(); //
        if (bookingsData) {
          bookingsData.sort((a: any, b: any) => b.id - a.id);
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const getAllEmployeesApi = async () => {
    setLoadingEmployees(true);
    try {
      const data = await getAllUsers(); //
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
    if (employees.length === 0) {
      getAllEmployeesApi();
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
    try {
      await assignEmployeeToBooking(selectedBookingId, selectedEmployeeId); //
      message.success("Employee assigned successfully!");
      const bookingsData = await getallBookings(); //
      if (bookingsData) {
        bookingsData.sort((a: any, b: any) => b.id - a.id);
        setBookings(bookingsData || []);
      }
      closeAssignModal();
    } catch (error: any) {
      console.error("Assign failed:", error);
      message.error(error.message || "Failed to assign employee.");
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
      await deleteBookingById(selectedBookingId); //
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
    const slot = Slots.find(s => s.id === slotId);
    return slot ? slot.slot_time : 'No Time';
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
                   bodyStyle={{ padding: '20px 24px' }}
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
                             item.status?.status === 'Pending' ? "#fef3c7" :
                             item.status?.status === 'Open' ? "#e0f2fe" :
                             item.status?.status === 'Completed' ? "#dcfce7" :
                             item.status?.status === 'In-Progress' ? "#ccfbf1" :
                             "#f3f4f6",
                          color:
                             item.status?.status === 'Pending' ? "#b45309" :
                             item.status?.status === 'Open' ? "#0284c7" :
                             item.status?.status === 'Completed' ? "#15803d" :
                             item.status?.status === 'In-Progress' ? "#0f766e" :
                             "#4b5563",
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
                        disabled={!item.status || item.status.status !== 'Open'}
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
             <Col xs={24} style={{ textAlign: 'center', marginTop: 40 }}>
              <Card variant="outlined" style={{ borderRadius: 16, padding: "40px 0", borderColor: "#e5e7eb" }}>
                <CalendarOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 16 }} />
                <br/>
                <Text strong type="secondary" style={{ fontSize: 16, color: "#9ca3af" }}>
                  No bookings found.
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
             style={{ backgroundColor: "#0D9488", borderColor: '#0D9488' }}
             disabled={!selectedEmployeeId}
           >
             Assign
           </Button>,
         ]}
         width={600}
         bodyStyle={{ padding: "16px 24px" }}
       >
         <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 16, paddingRight: 8, }}>
              {loadingEmployees ? (
             <Text>Loading employees...</Text>
           ) : employees.length === 0 ? (
              <Text type="secondary">No employees available to assign.</Text>
           ) : (
             employees.map((employee: Employee) => {
               const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
               const firstLetter = employee.first_name?.[0]?.toUpperCase() || "U";
               return (
                 <Card key={employee.id} hoverable style={{ marginBottom: 12, borderRadius: 12, border: selectedEmployeeId === employee.id ? "2px solid #14b8a6" : "1px solid #e8e8e8", cursor: "pointer", transition: "border 0.2s", boxShadow: selectedEmployeeId === employee.id ? "0 0 0 2px rgba(20, 184, 166, 0.2)" : "none", userSelect: "none",}} onClick={() => setSelectedEmployeeId(employee.id)} bodyStyle={{ padding: 16 }}>
                   <Space size="middle" align="center">
                     <Avatar style={{ backgroundColor: "#14b8a6", verticalAlign: "middle", }} size="large"> {firstLetter} </Avatar>
                     <div>
                       <div style={{ fontSize: 16, lineHeight: 1.2, fontWeight: 500 }}> {fullName || 'Unnamed Employee'} </div>
                       <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}> {employee.email} </div>
                     </div>
                   </Space>
                 </Card>
               );
             })
           )}
         </div>
       </Modal>


       <Modal
         title={<Title level={3} style={{ color: "#ef4444" }}>Confirm Deletion</Title>}
         open={deleteModalVisible}
         onCancel={closeDeleteModal}
         footer={[
           <Button key="back" onClick={closeDeleteModal}>
             Cancel
           </Button>,
           <Button key="submit" type="primary" danger loading={isDeleting} onClick={handleDeleteBooking} >
             Confirm Delete
           </Button>,
         ]}
         centered
       >
          <Text style={{ fontSize: 15 }}>Are you sure you want to delete this booking?</Text>
            {selectedBooking && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: "#fff1f2", borderRadius: 8, border: "1px solid #ffccc7" }}>
                    <Text strong>{selectedBooking.department?.department_name || "N/A"}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Plan: {selectedBooking.services || "N/A"}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Customer: {selectedBooking.full_name || "N/A"}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Date: {moment(selectedBooking.preferred_date).format("MMM D, YYYY") || "N/A"} - {getSlotTime(selectedBooking.slot_id)}
                    </Text>
                </div>
            )}
         <Text type="danger" style={{ display: "block", marginTop: 16, fontWeight: "600" }}>
           This action cannot be undone.
         </Text>
       </Modal>
    </div>
  );
};

export default Bookings;