import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Typography, Empty } from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
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
  status: "open" | "pPending" | "In-Progress" | "Completed";
}

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const Tickets: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "Open" | "Pending" | "In-Progress" | "Completed">("all");
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(
    filter === "all" ? allTickets : allTickets.filter((ticket) => ticket.status.status === filter)
  );

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

    console.log("🔍 Raw Bookings:", response);

    
    const assignedOnly = response.filter((booking: any) => booking.assign_to !== null);

    assignedOnly.sort((a: any, b: any) => b.id - a.id);

    setFilteredTickets(assignedOnly);
    setAllTickets(assignedOnly);

    console.log("✅ Bookings with assigned employees:", assignedOnly);
  } catch (error) {
    console.error(" Error fetching bookings:", error);
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
      setFilteredTickets(allTickets.filter((ticket) => ticket.status.status === filter));
    }
  }, [filter]);

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
                        {/* {ticket?.status?.charAt(0)?.toUpperCase() + ticket?.status?.slice(1)} */}
                      </Text>{" "}
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        Ticket #{ticket?.id?.toString()?.slice(-6)}
                      </Text>
                    </Col>
                    {ticket?.status?.status === "completed" && (
                      <Text style={{ color: "#065f46", fontWeight: 500 }}>✓ Completed</Text>
                    )}
                  </Row>

                  <Title level={4} style={{ marginTop: "8px" }}>
                    {/* {ticket?.service} */}
                    {ticket?.department?.department_name}
                  </Title>

                  <Text>
                    <UserOutlined /> {ticket?.full_name}
                  </Text>
                  <br />
                  <Text>
                    🧑 Assigned to: <span style={{ color: "#0D9488" }}>{ticket?.assign_to_name || "Unassigned"}</span>

                  </Text>
                  <br />
                  <Text>
                    <EnvironmentOutlined /> {ticket?.address}
                  </Text>
                  <br />
                  <Text>
                    <CalendarOutlined />                         {moment(ticket?.created_date).format("LLL") || "No Date Provided"}
                    {/* {ticket?.created_date} */}
                  </Text>
                  {ticket?.status?.status === "Completed" && (
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
    </div>
  );
};

export default Tickets;
