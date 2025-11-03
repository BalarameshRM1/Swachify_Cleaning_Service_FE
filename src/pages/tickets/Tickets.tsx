import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { Card, Row, Col,message, Button, Typography, Empty, Input, Modal, Tag } from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { getallBookings, getallBookingsByUserId, otpSend, otpSendAPi, updateTicketByEmployeeCompleted, updateTicketByEmployeeInprogress } from "../../app/services/auth";
import moment from "moment";
import { getUserDetails } from "../../utils/helpers/storage";
import { getAllUsers } from "../../app/services/auth";
import LoaderGif from "../../assets/SWACHIFY_gif.gif";

const { Text, Title } = Typography;

const Slots = [
  {
    "id": 1,
    "slot_time": "9AM - 12PM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 2,
    "slot_time": "1PM - 4PM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 3,
    "slot_time": "5PM - 8PM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 4,
    "slot_time": "9PM - 12AM",
    "is_active": true,
    "service_bookings": []
  }
];

const Tickets: React.FC = () => {
  const location = useLocation(); 
  
  const initialFilterFromState = location.state?.initialFilter;
  
  const [filter, setFilter] = useState<"all" | "Open" | "Pending" | "In-Progress" | "Completed">(
    initialFilterFromState && ["Open", "Pending", "In-Progress", "Completed"].includes(initialFilterFromState) 
      ? initialFilterFromState 
      : "all"
  );
  
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
      const response = await getallBookings();
      if(!response) return;
      response?.sort((a:any, b:any) => b.id - a.id);

      const normalizedBookings = response.map((b: any) => ({
        ...b,
        normalizedStatus: typeof b.status === "string" ? b.status : b.status?.status || "Unknown"
      }));

      const latestReps = normalizedBookings.filter((booking:any) => booking.normalizedStatus !== "Open");

      console.log("Filtered Bookings:", latestReps);
      setAllTickets(latestReps); 
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getallBookingsByUserApi = async (id:any) => {
    try {
      const response = await getallBookingsByUserId(id);
      if(!response) return;
      response?.sort((a:any, b:any) => b.id - a.id);

      const normalizedBookings = response.map((b: any) => ({
        ...b,
        normalizedStatus: typeof b.status === "string" ? b.status : b.status?.status || "Unknown"
      }));
      
      const latestReps = normalizedBookings.filter((booking:any) => booking.normalizedStatus !== "Open");

      console.log("Filtered Bookings:", latestReps);
      setAllTickets(latestReps);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  useEffect(() => {
    document.title = "Service Tickets - Swachify Admin Panel";
    const data = getUserDetails("user");

    const loadData = async () => {
      setLoading(true);
      try {
        if (data?.role_id === 3) {
          await getallBookingsByUserApi(data.id);
        } else {
          await getallBookingsApi();
        }
        await getAllUsers().then((res) => setEmployees(res || []));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadData();

    if (initialFilterFromState) {
      window.history.replaceState({}, document.title)
    }

  }, []); 


  useEffect(() => {
    if (filter === "all") {
      setFilteredTickets(allTickets);
    } else {
      setFilteredTickets(allTickets.filter((ticket) => ticket.normalizedStatus === filter));
    }
  }, [filter, allTickets]);

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
      const selectedTicket = allTickets.find(t => t.id === selectedTicketId);
      if (!selectedTicket) {
        message.error("Ticket not found!");
        return;
      }

      const customerPhone = selectedTicket?.phone;
      if (!customerPhone) {
        message.error("Customer phone number not found for this booking!");
        return;
      }

      const response = await otpSendAPi(customerPhone, otpValue);
      console.log("OTP Verify Response:", response);

      
      if (
        typeof response === "string" &&
        (response.toLowerCase().includes("otp verified") ||
         response.toLowerCase().includes("verified successfully"))
      ) {
        message.success("OTP verified successfully!");

        await updateTicketByEmployeeInprogress(selectedTicket.id);

        setOtpModalVisible(false);
        setOtpValue("");

        let data = getUserDetails('user');
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


  const getEmployeeName = (id: any) => {
    if (!id) {
      return "Not Assigned";
    }
    const emp = employees.find((e) => Number(e.id) === Number(id));
    return emp ? emp.first_name : "Not Assigned";
  };


  const handleCompleteService = async (ticketId: number) => {
    try {
      await updateTicketByEmployeeCompleted(ticketId);
      message.success("Service completed successfully!");
      let data = getUserDetails('user');
      if (data?.role_id === 3) {
        await getallBookingsByUserApi(data.id);
      } else {
        await getallBookingsApi();
      }
    } catch (error) {
      message.error("Failed to complete service");
      console.error(error);
    }
  };

  if (loading) {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={LoaderGif} alt="Loading..." width={220} />
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
                          backgroundColor: ticket.normalizedStatus === "Completed" ? "#d1fae5" : ticket.normalizedStatus === "In-Progress" ? "#ccfbf1" : "#fef3c7",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color: ticket.normalizedStatus === "Completed" ? "#065f46" : ticket.normalizedStatus === "In-Progress" ? "#0f766e" : "#d97706",
                          fontWeight: 500
                        }}
                      >
                        {ticket.normalizedStatus.charAt(0)?.toUpperCase() + ticket.normalizedStatus.slice(1)}
                      </Text>
                    </Col>
                    {ticket.normalizedStatus === "Completed" && (
                      <Text style={{ color: "#065f46", fontWeight: 500 }}>✓ Completed</Text>
                    )}
                  </Row>

                  <div style={{ marginTop: 12, marginBottom: 8 }}>
                    {ticket.services.map((s: any, index: number) => (
                      <div key={index} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", marginRight: 8 }}>
                          {s.department_name} - {s.service_name}
                        </Text>
                        
                        <Tag 
                          style={{ 
                            backgroundColor: "#e0f2fe", 
                            color: "#0284c7", 
                            borderColor: "#bfdbfe",
                            fontWeight: 500,
                            marginRight: 0 
                          }}
                        >
                          {s.service_type || 'Standard Plan'}
                        </Tag>
                      </div>
                    ))}
                  </div>

                  <Text>
                    <UserOutlined /> {ticket?.full_name}
                  </Text>
                  <br />
                <Text>
  🧑 Assigned to:{" "}
  <span className="text-teal-600 font-medium">
    {getEmployeeName(ticket.employee_id || ticket.assign_to || ticket.assigned_to)}
  </span>
</Text>


                  <br />
                  <Text>
                    <EnvironmentOutlined /> {ticket?.address}
                  </Text>
                  <br />
                  <Text>
                    <CalendarOutlined /> {moment(ticket?.preferred_date).format("LL") || "No Date Provided"} -
                    {Slots.find(slot => slot.id === ticket?.slot_id)?.slot_time}
                  </Text>

                                      {/* Action buttons */}

                  {getUserDetails('user')?.role_id === 3 && (
                    <Row justify="end" style={{ marginTop: 12, gap: 8 }}>
                      {/* <-- UPDATED --> */}
                      {ticket.normalizedStatus === "Pending" && (
  <Button
    type="primary"
    style={{
      backgroundColor: "rgb(20, 184, 166)",
      borderColor: "#ffffff",
      fontWeight: 600,
      minWidth: 140,
    }}
    onClick={async () => {
     
      const customerPhone = ticket?.phone;

      if (!customerPhone) {
        message.error("Customer phone number not available for this booking!");
        return;
      }

      try {
        await otpSend(customerPhone); 
        message.success(`OTP sent to customer's number (${customerPhone})`);
        handleOpenOtpModal(ticket.id);
      } catch (error) {
        console.error("Error sending OTP:", error);
        message.error("Failed to send OTP to customer");
      }
    }}
  >
    Start Service
  </Button>
)}

                      {/* <-- UPDATED --> */}
                      {ticket.normalizedStatus === "In-Progress" && (
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


                  {/* ... (rest of your card JSX) ... */}
                </Card>
              </Col>
            ))
          )}
        </Row>
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
            Enter the 6-digit OTP provided by the customer to proceed.
          </p>
          <Input.OTP
            length={6}
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
    </div>
  );
};

export default Tickets;
