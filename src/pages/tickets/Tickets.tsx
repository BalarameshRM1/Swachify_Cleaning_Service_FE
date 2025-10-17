import  { useState } from "react";
import { Card, Row, Col, Button, Typography, Empty } from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Ticket {
  id: number;
  service: string;
  employee: string;
  customerName: string;
  address: string;
  time: string;
  status: "open" | "in-progress" | "completed";
}

const sampleTickets: Ticket[] = [
  {
    id: 101356,
    service: "Cleaning & Pest Control - Bedroom Cleaning (Regular)",
    employee: "Arun Kumar",
    customerName: "Uma",
    address: "H No 33-251/3/A/1 SHARANYA GREEN HOMES, MIRYALAGUDA",
    time: "16/10/2025 at 9:00 AM - 11:00 AM",
    status: "completed",
  },
  {
    id: 101358,
    service: "Window Cleaning",
    employee: "Sara",
    customerName: "Bob",
    address: "H No 89-22/4, Sunrise Apartments, Miryalaguda",
    time: "18/10/2025 at 11:00 AM - 1:00 PM",
    status: "in-progress",
  },
];


const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const Tickets: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "open" | "in-progress" | "completed">("all");

  const filteredTickets =
    filter === "all" ? sampleTickets : sampleTickets.filter(ticket => ticket.status === filter);

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

  return (
    <div style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Title level={2}>Service Tickets</Title>
      <Row gutter={[8, 8]} style={{ marginBottom: "24px" }}>
        <Col>{tabButton("all", "All")}</Col>
        <Col>{tabButton("open", "Open")}</Col>
        <Col>{tabButton("in-progress", "In Progress")}</Col>
        <Col>{tabButton("completed", "Completed")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        {filteredTickets.length === 0 ? (
          <Col span={24}>
            <Empty description="No tickets found for this filter" />
          </Col>
        ) : (
          filteredTickets.map(ticket => (
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
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Text>{" "}
                    <Text style={{ marginLeft: 8, color: "#374151" }}>
                      Ticket #{ticket.id.toString().slice(-6)}
                    </Text>
                  </Col>
                  {ticket.status === "completed" && (
                    <Text style={{ color: "#065f46", fontWeight: 500 }}>✓ Completed</Text>
                  )}
                </Row>

                <Title level={4} style={{ marginTop: "8px" }}>
                  {ticket.service}
                </Title>

                <Text>
                  <UserOutlined /> {ticket.customerName}
                </Text>
                <br />
                <Text>
                  🧑 Assigned to: <span style={{ color: "#0D9488" }}>{ticket.employee}</span>
                </Text>
                <br />
                <Text>
                  <EnvironmentOutlined /> {ticket.address}
                </Text>
                <br />
                <Text>
                  <CalendarOutlined /> {ticket.time}
                </Text>

                {/* OTP card under completed ticket, right side */}
                {ticket.status === "completed" && (
                  <Row justify="end" style={{ marginTop: 12 }}>
                    <Col>
                      <Card
                        size="small"
                        style={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: 6,
                          width: 180,
                          textAlign: "center",
                        }}
                      >
                        <Text style={{ fontWeight: 500 }}>Customer's OTP</Text>
                        <br />
                        <Text style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
                          {generateOTP()}
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Tickets;
