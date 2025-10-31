import React, { useState, useEffect } from "react";
import { Card, Row, Col,message, Button, Typography, Empty, Input, Modal } from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { getallBookings, getallBookingsByUserId, otpSend, otpSendAPi, updateTicketByEmployeeCompleted, updateTicketByEmployeeInprogress } from "../../app/services/auth";
import moment from "moment";
import { getUserDetails } from "../../utils/helpers/storage";
import { getAllUsers } from "../../app/services/auth";
import LoaderGif from "../../assets/SWACHIFY_gif.gif";

const { Text, Title } = Typography;

// interface Ticket {
//   id: number;
//   service: string;
//   employee: string;
//   customerName: string;
//   address: string;
//   time: string;
//   status: "open" | "Pending" | "In-Progress" | "Completed";
// }

const Slots = [
  {
    "id": 1,
    "slot_time": "9AM - 11AM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 2,
    "slot_time": "11AM - 1 PM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 3,
    "slot_time": "1PM - 3PM",
    "is_active": true,
    "service_bookings": []
  },
  {
    "id": 4,
    "slot_time": "3PM - 5 PM",
    "is_active": true,
    "service_bookings": []
  }
]

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const Tickets: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "Open" | "Pending" | "In-Progress" | "Completed">("all");
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>(
    filter === "all" ? allTickets : allTickets.filter((ticket) => ticket.status.status === filter)
  );

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
      const latestReps = response?.filter((booking:any) => booking?.status?.status !== "Open" || booking.status_id === 1);

      console.log("Filtered Bookings:", latestReps);

      setFilteredTickets(latestReps);
      setAllTickets(latestReps);
      console.log("Bookings API Response:", latestReps);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getallBookingsByUserApi = async (id:any) => {
    try {
      const response = await getallBookingsByUserId(id);
      if(!response) return;
      response?.sort((a:any, b:any) => b.id - a.id);
      const latestReps = response?.filter((booking:any) => booking?.status?.status !== "Open" || booking.status_id === 1);

      console.log("Filtered Bookings:", latestReps);

      setFilteredTickets(latestReps);
      setAllTickets(latestReps);
      console.log("Bookings API Response:", latestReps);
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
      setTimeout(() => setLoading(false), 800); // small delay for smoother transition
    }
  };

  loadData();
}, []);


  useEffect(() => {
    if (filter === "all") {
      setFilteredTickets(allTickets);
    } else {
      setFilteredTickets(allTickets.filter((ticket) => ticket.status.status === filter));
    }
  }, [filter]);

    const handleOpenOtpModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setOtpModalVisible(true);
  };
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


   useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, usersData] = await Promise.all([
          getallBookings(),
          getAllUsers(),
        ]);

        console.log("Fetched bookings data:", bookingsData);

       
        setEmployees(usersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
    const getEmployeeName = (id: any) => {
  console.log("🔍 Checking employee assignment:", {
    employee_id_from_ticket: id,
    allEmployees: employees?.length,
    sampleEmployee: employees?.[0],
  });

  if (!id) {
    console.warn("⚠️ Ticket has no assigned employee_id");
    return "Not Assigned";
  }

  const emp = employees.find((e) => {
    const match = Number(e.id) === Number(id);
    if (match) console.log("✅ Found employee match:", e);
    return match;
  });

  if (!emp) {
    console.error("❌ No employee found for ID:", id);
    console.table(employees.map(e => ({ id: e.id, name: e.first_name })));
  }

  return emp ? emp.first_name : "Not Assigned";
};


  const handleCompleteService = async (ticketId: number) => {
    try {
      // TODO: Call your API to update status to "Completed"
      await updateTicketByEmployeeCompleted(ticketId);
      message.success("Service completed successfully!");
      await getallBookingsApi();
      window.location.reload();
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
                          backgroundColor: ticket?.status=== "Completed" ? "#d1fae5" : "#fef3c7",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color: ticket?.status=== "Completed" ? "#065f46" : "#d97706",
                          fontWeight: 500
                        }}
                      >
                        {ticket?.status.charAt(0)?.toUpperCase() + ticket?.status.slice(1)}
                      </Text>{" "}
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        Ticket #{ticket?.id?.toString()?.slice(-6)}
                      </Text>
                    </Col>
                    {ticket?.status=== "Completed" && (
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
                    <CalendarOutlined /> {moment(ticket?.preferred_date).format("LLL") || "No Date Provided"} - {Slots.find((slot) => slot.id === ticket?.slot_id)?.slot_time}
                    {/* {ticket?.created_date} */}
                  </Text>

                                      {/* Action buttons */}

                  {getUserDetails('user')?.role_id === 3 && (
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


                  {/* {ticket?.status?.status === "Completed" && (
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
                  )} */}
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