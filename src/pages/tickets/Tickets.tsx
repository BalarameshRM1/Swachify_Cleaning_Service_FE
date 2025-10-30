import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Button, Typography, Empty, Input, Modal} from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  getallBookings,
  getallBookingsByUserId,
  otpSend,
  otpSendAPi,
  updateTicketByEmployeeCompleted,
  updateTicketByEmployeeInprogress,
  getAllUsers,
} from "../../app/services/auth";
import moment from "moment";
import { getUserDetails } from "../../utils/helpers/storage";


import LoaderGif from "../../assets/SWACHIFY_gif.gif";

const { Text, Title } = Typography;

const Slots = [
  { id: 1, slot_time: "9AM - 11AM","is_active": true, "service_bookings": [] },
  { id: 2, slot_time: "11AM - 1 PM","is_active": true, "service_bookings": [] },
  { id: 3, slot_time: "1PM - 3PM","is_active": true, "service_bookings": [] },
  { id: 4, slot_time: "3PM - 5 PM","is_active": true, "service_bookings": [] },
];

const Tickets: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "Open" | "Pending" | "In-Progress" | "Completed">("all");
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 

  const tabButton = (tab: typeof filter, label: string) => (
    <Button
      type={filter === tab ? "primary" : "default"}
      style={{
        backgroundColor: filter === tab ? "#0D9488" : "#e5e7eb",
        color: filter === tab ? "white" : "#1f2937",
        border: "none",
        fontWeight: 500,
        minWidth: 100,
      }}
      onClick={() => setFilter(tab)}
    >
      {label}
    </Button>
  );

  const getallBookingsApi = async () => {
    try {
      setLoading(true);
      const response = await getallBookings();
      if (!response) return;
      response?.sort((a: any, b: any) => b.id - a.id);
      const latestReps = response?.filter(
        (booking: any) => booking?.status?.status !== "Open" || booking.status_id === 1
      );
      setAllTickets(latestReps);
      setFilteredTickets(latestReps);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getallBookingsByUserApi = async (id: any) => {
    try {
      setLoading(true);
      const response = await getallBookingsByUserId(id);
      if (!response) return;
      response?.sort((a: any, b: any) => b.id - a.id);
      const latestReps = response?.filter(
        (booking: any) => booking?.status?.status !== "Open" || booking.status_id === 1
      );
      setAllTickets(latestReps);
      setFilteredTickets(latestReps);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Service Tickets - Swachify Admin Panel";
    let data = getUserDetails("user");
    if (data?.role_id === 3) {
      getallBookingsByUserApi(data.id);
    } else {
      getallBookingsApi();
    }
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTickets(allTickets);
    } else {
      setFilteredTickets(allTickets.filter((ticket) => ticket.status.status === filter));
    }
  }, [filter, allTickets]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllUsers();
        setEmployees(res || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleOpenOtpModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setOtpModalVisible(true);
  };

  const handleVerifyOtp = async () => {
    if (!otpValue) {
      message.error("Please enter the OTP.");
      return;
    }

    try {
      const selectedTicket = allTickets.find((t) => t.id === selectedTicketId);
      if (!selectedTicket) {
        message.error("Ticket not found!");
        return;
      }

      const customerPhone = selectedTicket?.phone;
      if (!customerPhone) {
        message.error("Customer phone number not found!");
        return;
      }

      const response = await otpSendAPi(customerPhone, otpValue);
      if (
        typeof response === "string" &&
        (response.toLowerCase().includes("otp verified") ||
          response.toLowerCase().includes("verified successfully"))
      ) {
        message.success("OTP verified successfully!");
        await updateTicketByEmployeeInprogress(selectedTicket.id);
        setOtpModalVisible(false);
        setOtpValue("");

        let data = getUserDetails("user");
        if (data?.role_id === 3) {
          await getallBookingsByUserApi(data.id);
        } else {
          await getallBookingsApi();
        }
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleCompleteService = async (ticketId: number) => {
    try {
      await updateTicketByEmployeeCompleted(ticketId);
      message.success("Service completed successfully!");
      await getallBookingsApi();
    } catch (error) {
      message.error("Failed to complete service");
      console.error(error);
    }
  };

  const getEmployeeName = (id: any) => {
    const emp = employees.find((e) => Number(e.id) === Number(id));
    return emp ? emp.first_name : "Not Assigned";
  };

  
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          flexDirection: "column",
        }}
      >
        <img
          src={LoaderGif}
          alt="Loading..."
          style={{ width: 120, height: 120, marginBottom: 16 }}
        />
        <Title level={4} style={{ color: "rgb(20,184,166)" }}>
          Loading tickets...
        </Title>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#f9fafb",
          padding: "24px 24px 0 24px",
        }}
      >
        <Title level={2}>Service Tickets</Title>
        <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
          <Col>{tabButton("all", "All")}</Col>
          <Col>{tabButton("Pending", "Pending")}</Col>
          <Col>{tabButton("In-Progress", "In-Progress")}</Col>
          <Col>{tabButton("Completed", "Completed")}</Col>
        </Row>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>
        <Row gutter={[16, 16]}>
          {filteredTickets.length === 0 ? (
            <Col span={24}>
              <Empty description="No tickets found for this filter" />
            </Col>
          ) : (
            filteredTickets.map((ticket: any) => (
              <Col span={24} key={ticket.id}>
                <Card
                  style={{
                    backgroundColor: "white",
                    border: "3px solid #0D9488",
                    borderRadius: "8px",
                    padding: 16,
                  }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text
                        style={{
                          backgroundColor:
                            ticket?.status?.status === "Completed" ? "#d1fae5" : "#fef3c7",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color:
                            ticket?.status?.status === "Completed"
                              ? "#065f46"
                              : "#d97706",
                          fontWeight: 500,
                        }}
                      >
                        {ticket?.status?.status}
                      </Text>
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        Ticket #{ticket?.id?.toString()?.slice(-6)}
                      </Text>
                    </Col>
                  </Row>

                  <Title level={4} style={{ marginTop: "8px" }}>
                    {ticket?.department?.department_name}
                  </Title>

                  <Text>
                    <UserOutlined /> {ticket?.full_name}
                  </Text>
                  <br />
                  <Text>
                    🧑 Assigned to:{" "}
                    <span style={{ color: "rgb(20,184,166)", fontWeight: 500 }}>
                      {getEmployeeName(ticket.employee_id)}
                    </span>
                  </Text>
                  <br />
                  <Text>
                    <EnvironmentOutlined /> {ticket?.address}
                  </Text>
                  <br />
                  <Text>
                    <CalendarOutlined />{" "}
                    {moment(ticket?.preferred_date).format("LLL")} -{" "}
                    {Slots.find((slot) => slot.id === ticket?.slot_id)?.slot_time}
                  </Text>

                  {getUserDetails("user")?.role_id === 3 && (
                    <Row justify="end" style={{ marginTop: 12, gap: 8 }}>
                      {ticket?.status?.status === "Pending" && (
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "rgb(20,184,166)",
                            borderColor: "rgb(20,184,166)",
                            fontWeight: 600,
                            minWidth: 140,
                          }}
                          onClick={async () => {
                            const customerPhone = ticket?.phone;
                            if (!customerPhone) {
                              message.error("Customer phone not available!");
                              return;
                            }
                            try {
                              await otpSend(customerPhone);
                              message.success(`OTP sent to ${customerPhone}`);
                              handleOpenOtpModal(ticket.id);
                            } catch (error) {
                              console.error("Error sending OTP:", error);
                              message.error("Failed to send OTP");
                            }
                          }}
                        >
                          Start Service
                        </Button>
                      )}

                      {ticket?.status?.status === "In-Progress" && (
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "#059669",
                            borderColor: "#059669",
                            fontWeight: 600,
                            minWidth: 140,
                          }}
                          onClick={() => handleCompleteService(ticket.id)}
                        >
                          Complete Service
                        </Button>
                      )}
                    </Row>
                  )}
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      <Modal
        title={<b>Verify Start OTP</b>}
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>
            Enter the 6-digit OTP provided by the customer to proceed.
          </p>
          <Input.OTP
            length={6}
            size="large"
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
            style={{ marginTop: 10, marginBottom: 20, justifyContent: "center" }}
          />
          <Button
            type="primary"
            block
            style={{
              background: "linear-gradient(to right, #06b6d4, #0d9488)",
              border: "none",
              fontWeight: 600,
              height: 45,
            }}
            onClick={handleVerifyOtp}
          >
            Verify & Proceed
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
