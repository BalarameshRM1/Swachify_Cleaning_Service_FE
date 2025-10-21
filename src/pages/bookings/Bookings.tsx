import React, { use, useState } from "react";
import { Card, Typography, Row, Col, Space, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getallBookings } from "../../app/services/auth";

const { Title, Text } = Typography;

interface Booking {
  id: number;
  service: string;
  customerName: string;
  phone: string;
  address: string;
  dateTime: string;
  status: string;
}

const sampleBookings: Booking[] = [
  {
    id: 1,
    service: "Kitchen Cleaning",
    customerName: "Raj",
    phone: "+91 8956412359",
    address: "Gachibowli",
    dateTime: "8/11/2025 at 1:00 PM - 3:00 PM",
    status: "Pending",
  },
  {
    id: 2,
    service: "Room Painting",
    customerName: "Alice Smith",
    phone: "+91 9876501234",
    address: "456 Business Ave, vij",
    dateTime: "2025/10/21 at 02:00 PM - 04:00 PM",
    status: "Pending",
  },
];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any>([]);

  const getallBookingsApi = async () => {
    try {
      const data = await getallBookings();
      console.log("Bookings data from API:", data);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  React.useEffect(() => {
    getallBookingsApi();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ fontWeight: "bold", color: "#0a0b0bff" }}>
        Bookings Management
      </Title>
      {/* <div
      style={{
        flex: 1,
        overflowY: "auto",
        paddingRight: 4,
      }}
    > */}

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        {bookings.length > 0 ? (
          bookings.map((item:any) => (
            <Col xs={24} key={item.id}>
              <Card
                hoverable
                bordered
                style={{
                  borderRadius: "16px",
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
                  target.style.boxShadow = "0 4px 15px rgba(13, 148, 136, 0.3)";
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
                  {/* Left Side Details */}
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: 16, color: "#000" }}>
                      {item.service}
                    </Text>
                    <Text strong>👤 {item.customerName}</Text>
                    <Text strong>📞 {item.phone}</Text>
                    <Text strong>📍 {item.address}</Text>
                    <Text strong>🗓️ {item.dateTime}</Text>
                  </Space>

                  {/* Right Side: Status + Button */}
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
                    Pending
                    </span>

                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#0D9488",
                        borderColor: "#0D9488",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
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
                borderRadius: "16px",
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
    // </div>
  );
};

export default Bookings;
