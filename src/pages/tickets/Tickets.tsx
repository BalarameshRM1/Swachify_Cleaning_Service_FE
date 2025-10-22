import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Empty,
  message,
  Modal,
  Input,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { getallBookings } from "../../app/services/auth";
import moment from "moment";

const { Text, Title } = Typography;

interface Ticket {
  id: number;
  service: string;
  employee: string;
  customerName: string;
  address: string;
  time: string;
  status: "open" | "Pending" | "In-Progress" | "Completed";
}

const Tickets: React.FC = () => {
  const [filter, setFilter] = useState<
    "all" | "Open" | "Pending" | "In-Progress" | "Completed"
  >("all");
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

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
      const response = await getallBookings();
      response?.sort((a: any, b: any) => b.id - a.id);
      setFilteredTickets(response);
      setAllTickets(response);
      console.log("Bookings API Response:", response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleOpenOtpModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setOtpModalVisible(true);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 4) {
      message.warning("Please enter a 4-digit OTP");
      return;
    }

    try {
      // TODO: Call API to verify OTP and update status to "In-Progress"
      // Example: await verifyOtp(selectedTicketId, otpValue);

      message.success("OTP verified successfully! Service started.");
      setOtpModalVisible(false);
      setOtpValue("");
      await getallBookingsApi();
    } catch (error) {
      message.error("Failed to verify OTP");
      console.error(error);
    }
  };

  const handleCompleteService = async (ticketId: number) => {
    try {
      // TODO: Call your API to update status to "Completed"
      message.success("Service completed successfully!");
      await getallBookingsApi();
    } catch (error) {
      message.error("Failed to complete service");
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "Service Tickets - Swachify Admin Panel";
    getallBookingsApi();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTickets(allTickets);
    } else {
      setFilteredTickets(
        allTickets.filter((ticket) => ticket.status.status === filter)
      );
    }
  }, [filter, allTickets]);

  return (
    <>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
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

        {/* Tickets List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 24px 24px 24px",
            minHeight: 0,
          }}
        >
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
                            backgroundColor: "#d1fae5",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: "#065f46",
                            fontWeight: 500,
                          }}
                        >
                          {ticket?.status?.status || "Pending"}
                        </Text>{" "}
                        <Text style={{ marginLeft: 8, color: "#374151" }}>
                          Ticket #{ticket?.id?.toString()?.slice(-6)}
                        </Text>
                      </Col>
                      {ticket?.status?.status === "Completed" && (
                        <Text
                          style={{ color: "#065f46", fontWeight: 500 }}
                        >
                          ✓ Completed
                        </Text>
                      )}
                    </Row>

                    <Title level={4} style={{ marginTop: "8px" }}>
                      {ticket?.department?.department_name || "Service"}
                    </Title>

                    <Text>
                      <UserOutlined /> {ticket?.full_name}
                    </Text>
                    <br />
                    <Text>
                      🧑 Assigned to:{" "}
                      <span style={{ color: "#0D9488" }}>
                        {ticket?.employee || "Not assigned"}
                      </span>
                    </Text>
                    <br />
                    <Text>
                      <EnvironmentOutlined /> {ticket?.address}
                    </Text>
                    <br />
                    <Text>
                      <CalendarOutlined />{" "}
                      {moment(ticket?.created_date).format("LLL") ||
                        "No Date Provided"}
                    </Text>

                    {/* Action buttons */}
                    <Row justify="end" style={{ marginTop: 12, gap: 8 }}>
                      {ticket?.status?.status === "Pending" && (
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "rgb(20, 184, 166)",
                            borderColor: "#ffffff",
                            fontWeight: 600,
                            minWidth: 140,
                          }}
                          onClick={() => handleOpenOtpModal(ticket.id)}
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
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        title={<b>Verify Start OTP</b>}
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>
            Enter the 4-digit OTP provided by the customer to proceed.
          </p>
          <Input.OTP
            length={4}
            size="large"
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
            style={{
              marginTop: 10,
              marginBottom: 20,
              justifyContent: "center",
            }}
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
    </>
  );
};

export default Tickets;
