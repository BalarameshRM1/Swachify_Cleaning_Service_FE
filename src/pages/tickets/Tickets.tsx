import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, message, Button, Typography, Empty, Input, Modal, Tag } from "antd";
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

/**
 * Helper: Normalize any dept value into an array<number>.
 * Use this when constructing payloads elsewhere (user create/update/assign),
 * so backend consistently receives dept_id: number[]
 */
export const toDeptArray = (
  value: number | string | Array<number | string> | null | undefined
): number[] => {
  if (value == null) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map((v) => (typeof v === "string" ? v.trim() : v))
    .filter((v) => v !== "" && v !== null && v !== undefined)
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));
};

// OTP sanitization helpers
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const normalizeOtpInput = (value: string | string[] | number | undefined | null) => {
  const str = Array.isArray(value) ? value.join("") : String(value ?? "");
  return onlyDigits(str).slice(0, 6);
};

const { Text, Title } = Typography;

const Slots = [
  { id: 1, slot_time: "9AM - 11AM", is_active: true, service_bookings: [] },
  { id: 2, slot_time: "11AM - 1 PM", is_active: true, service_bookings: [] },
  { id: 3, slot_time: "1PM - 3PM", is_active: true, service_bookings: [] },
  { id: 4, slot_time: "3PM - 5 PM", is_active: true, service_bookings: [] },
];

type TicketStatus = "all" | "Open" | "Pending" | "In-Progress" | "Completed";

type LocationState = {
  initialFilter?: TicketStatus;
};

const Tickets: React.FC = () => {
  // Typed location state to avoid TS issues when opening directly without state
  const location = useLocation() as { state?: LocationState };

  const initialFilterFromState = location.state?.initialFilter;

  const [filter, setFilter] = useState<TicketStatus>(
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

  const tabButton = (tab: TicketStatus, label: string) => (
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
      if (!response) return;
      response?.sort((a: any, b: any) => b.id - a.id);

<<<<<<< Updated upstream
      console.log("Filtered Bookings:", latestReps);

      setFilteredTickets(latestReps);
      setAllTickets(latestReps);
      console.log("Bookings API Response:", latestReps);
=======
      const normalizedBookings = response.map((b: any) => {
        let planType: string | null = null;
        if (Array.isArray(b.services) && b.services.length > 0 && b.services[0]?.service_type) {
          const serviceType = b.services[0].service_type;
          if (serviceType === "Deep Cleaning") {
            planType = "Deep Cleaning";
          } else if (serviceType === "Normal Cleaning") {
            planType = "Normal Cleaning";
          }
        }

        return {
          ...b,
          normalizedStatus: typeof b.status === "string" ? b.status : b.status?.status || "Unknown",
          planType,
        };
      });

      setAllTickets(normalizedBookings);
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getallBookingsByUserApi = async (id: any) => {
    try {
      const response = await getallBookingsByUserId(id);
      if (!response) return;
      response?.sort((a: any, b: any) => b.id - a.id);

      const normalizedBookings = response.map((b: any) => {
        let planType: string | null = null;
        if (Array.isArray(b.services) && b.services.length > 0 && b.services[0]?.service_type) {
          const serviceType = b.services[0].service_type;
          if (serviceType === "Deep Cleaning") {
            planType = "Premium";
          } else if (serviceType === "Normal Cleaning") {
            planType = "Regular";
          }
        }

        return {
          ...b,
          normalizedStatus: typeof b.status === "string" ? b.status : b.status?.status || "Unknown",
          planType,
        };
      });

      setAllTickets(normalizedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
<<<<<<< Updated upstream
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
=======
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
        const users = await getAllUsers();
        setEmployees(users || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadData();

    if (initialFilterFromState) {
      window.history.replaceState({}, document.title);
>>>>>>> Stashed changes
    }
  };

  loadData();
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
      const selectedTicket = allTickets.find((t) => t.id === selectedTicketId);
      if (!selectedTicket) {
        message.error("Ticket not found!");
        return;
      }

      const customerPhone = selectedTicket?.phone;
      if (!customerPhone) {
        message.error("Customer phone number not found for this booking!");
        return;
      }

      const code = normalizeOtpInput(otpValue);
      if (code.length !== 6) {
        message.error("Please enter a valid 6-digit OTP.");
        return;
      }

      const response = await otpSendAPi(customerPhone, code);

      if (
        typeof response === "string" &&
        (response.toLowerCase().includes("otp verified") || response.toLowerCase().includes("verified successfully"))
      ) {
        message.success("OTP verified successfully!");

        await updateTicketByEmployeeInprogress(selectedTicket.id);

        setOtpModalVisible(false);
        setOtpValue("");

        const data = getUserDetails("user");
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
      const data = getUserDetails("user");
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
<<<<<<< Updated upstream
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

      
=======
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
          <Col>{tabButton("Open", "Open")}</Col>
          <Col>{tabButton("Pending", "Pending")}</Col>
          <Col>{tabButton("In-Progress", "In-Progress")}</Col>
          <Col>{tabButton("Completed", "Completed")}</Col>
        </Row>
      </div>

>>>>>>> Stashed changes
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
              <Empty description={`No tickets found for "${filter}" status`} />
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
                            ticket.normalizedStatus === "Completed"
                              ? "#d1fae5"
                              : ticket.normalizedStatus === "Open"
                              ? "#e0f2fe"
                              : "#fef3c7",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color:
                            ticket.normalizedStatus === "Completed"
                              ? "#065f46"
                              : ticket.normalizedStatus === "Open"
                              ? "#0284c7"
                              : "#d97706",
                          fontWeight: 500,
                        }}
                      >
                        {ticket.normalizedStatus.charAt(0)?.toUpperCase() + ticket.normalizedStatus.slice(1)}
                      </Text>{" "}
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
<<<<<<< Updated upstream
                        {/* Ticket #{ticket?.id?.toString()?.slice(-6)} */}
                          {ticket.services.map((s:any)=>`${s.department_name} - ${s.service_name}`).join(", ")}
=======
                        {ticket.services.map((s: any) => `${s.department_name} - ${s.service_name}`).join(", ")}
>>>>>>> Stashed changes
                      </Text>

                      {ticket.planType && (
                        <Tag
                          color={
                            ticket.planType === "Premium"
                              ? "gold"
                              : ticket.planType === "Ultimate"
                              ? "purple"
                              : "cyan"
                          }
                          style={{ marginLeft: 8, fontWeight: 500 }}
                        >
                          {ticket.planType} Plan
                        </Tag>
                      )}
                    </Col>
<<<<<<< Updated upstream
                    {ticket?.status=== "Completed" && (
=======
                    {ticket.normalizedStatus === "Completed" && (
>>>>>>> Stashed changes
                      <Text style={{ color: "#065f46", fontWeight: 500 }}>✓ Completed</Text>
                    )}
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
                    <CalendarOutlined />{" "}
                    {moment(ticket?.preferred_date).format("LLL") || "No Date Provided"} -{" "}
                    {Slots.find((slot) => slot.id === ticket?.slot_id)?.slot_time}
                  </Text>

                  {getUserDetails("user")?.role_id === 3 && (
                    <Row justify="end" style={{ marginTop: 12, gap: 8 }}>
<<<<<<< Updated upstream
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
=======
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

                      {ticket.normalizedStatus === "In-Progress" && (
>>>>>>> Stashed changes
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

      {/* OTP Modal */}
      <Modal
        title={<b>Verify Start OTP</b>}
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>Enter the 6-digit OTP provided by the customer to proceed.</p>
          <Input.OTP
            length={6}
            size="large"
            value={otpValue}
            // Guard for AntD OTP value variations; normalize to numeric 6 chars
            onChange={(value) => setOtpValue(normalizeOtpInput(value as any))}
            // Optional: enforce numeric keyboard on mobile
            inputMode="numeric"
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
