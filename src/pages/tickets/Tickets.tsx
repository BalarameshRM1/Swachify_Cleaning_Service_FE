import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Pagination } from "antd";

import {
  Card,
  Row,
  Col,
  message,
  Button,
  Typography,
  Empty,
  Input,
  Modal,
  Tag,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  getallBookingsinBookings,
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
import "./Tickets.css";

const { Text, Title } = Typography;

const Slots = [
  { id: 1, slot_time: "9AM - 12PM" },
  { id: 2, slot_time: "1PM - 4PM" },
  { id: 3, slot_time: "5PM - 8PM" },
  { id: 4, slot_time: "9PM - 12AM" },
];

const Tickets: React.FC = () => {
  const location = useLocation();
  const initialFilterFromState = location.state?.initialFilter;

  const [filter, setFilter] = useState<
    "all" | "Open" | "Pending" | "In-Progress" | "Completed"
  >(
    initialFilterFromState &&
    ["Open", "Pending", "In-Progress", "Completed"].includes(initialFilterFromState)
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
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [totalTickets, setTotalTickets] = useState(0);

  

  const tabButton = (tab: typeof filter, label: string) => (
    <Button
      type={filter === tab ? "primary" : "default"}
      className={`tab-btn ${filter === tab ? "active" : ""}`}
      onClick={() => setFilter(tab)}
    >
      {label}
    </Button>
  );
  const handlePageChange = (page: number, size?: number) => {
  setCurrentPage(page);
  if (size) setPageSize(size);
};
useEffect(() => {
  const loadPagedData = async () => {
    setLoading(true);
    await getallBookingsApi();
    setLoading(false);
  };
  loadPagedData();
}, [currentPage, pageSize]);


 const getallBookingsApi = async () => {
  try {
    // still call your API the same way
    const res = await getallBookingsinBookings(pageSize, (currentPage - 1) * pageSize);

    // ✅ backend returns an array (not object)
    const response = Array.isArray(res) ? res : [];

    response.sort((a: any, b: any) => b.id - a.id);

    const normalized = response.map((b: any) => ({
      ...b,
      normalizedStatus:
        typeof b.status === "string" ? b.status : b.status?.status || "Unknown",
    }));

    const finalTickets = normalized.filter((b: any) => b.normalizedStatus !== "Open");
    setAllTickets(finalTickets);

    // ✅ temporary: use response.length until backend provides total
    setTotalTickets(1000);
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};




  const getallBookingsByUserApi = async (id: any) => {
    try {
      const response = await getallBookingsByUserId(id);
      if (!response) return;
      response.sort((a: any, b: any) => b.id - a.id);
      const normalized = response.map((b: any) => ({
        ...b,
        normalizedStatus:
          typeof b.status === "string" ? b.status : b.status?.status || "Unknown",
      }));
      setAllTickets(normalized.filter((b: any) => b.normalizedStatus !== "Open"));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    document.title = "Service Tickets - Swachify Admin Panel";
    const user = getUserDetails("user");

    const loadData = async () => {
      setLoading(true);
      try {
        if (user?.role_id === 3) {
          await getallBookingsByUserApi(user.id);
        } else {
          await getallBookingsApi();
        }
        await getAllUsers().then((res) => setEmployees(res || []));
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadData();
    if (initialFilterFromState) window.history.replaceState({}, document.title);
  }, []);

  useEffect(() => {
    if (filter === "all") setFilteredTickets(allTickets);
    else
      setFilteredTickets(
        allTickets.filter((ticket) => ticket.normalizedStatus === filter)
      );
  }, [filter, allTickets]);

  const handleOpenOtpModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setOtpModalVisible(true);
  };

  const handleVerifyOtp = async () => {
    if (!otpValue) return message.error("Please enter the OTP.");

    try {
      const selected = allTickets.find((t) => t.id === selectedTicketId);
      if (!selected) return message.error("Ticket not found!");

      const response = await otpSendAPi(selected.phone, otpValue);
      if (
        typeof response === "string" &&
        (response.toLowerCase().includes("verified") ||
          response.toLowerCase().includes("success"))
      ) {
        message.success("OTP verified successfully!");
        await updateTicketByEmployeeInprogress(selected.id);
        setOtpModalVisible(false);
        setOtpValue("");
        const user = getUserDetails("user");
        user?.role_id === 3
          ? await getallBookingsByUserApi(user.id)
          : await getallBookingsApi();
      } else message.error("Invalid OTP. Try again.");
    } catch (err) {
      console.error("OTP verification failed:", err);
      message.error("Failed to verify OTP.");
    }
  };

  const getEmployeeName = (id: any) => {
    if (!id) return "Not Assigned";
    const emp = employees.find((e) => Number(e.id) === Number(id));
    return emp ? emp.first_name : "Not Assigned";
  };

  const handleCompleteService = async (ticketId: number) => {
    try {
      await updateTicketByEmployeeCompleted(ticketId);
      message.success("Service completed successfully!");
      const user = getUserDetails("user");
      user?.role_id === 3
        ? await getallBookingsByUserApi(user.id)
        : await getallBookingsApi();
    } catch {
      message.error("Failed to complete service");
    }
  };

  if (loading)
    return (
      <div className="tickets-loading">
        <img src={LoaderGif} alt="Loading..." width={220} />
      </div>
    );

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <Title level={2} className="tickets-title">
          SERVICE TICKETS
        </Title>
        <Row gutter={[8, 8]} className="tickets-tabs">
          <Col>{tabButton("all", "All")}</Col>
          <Col>{tabButton("Pending", "Pending")}</Col>
          <Col>{tabButton("In-Progress", "In-Progress")}</Col>
          <Col>{tabButton("Completed", "Completed")}</Col>
        </Row>
      </div>

      <div className="tickets-list">
        {filteredTickets.length === 0 ? (
          <Empty description="No tickets found for this filter" />
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="ticket-card">
              <Row justify="space-between" align="middle">
                <Col>
                  <Text
                    className={`ticket-status ${ticket.normalizedStatus.toLowerCase()}`}
                  >
                    {ticket.normalizedStatus}
                  </Text>
                </Col>
              </Row>

              <div className="ticket-services">
                {ticket.services.map((s: any, index: number) => (
                
                  <Text className="service-title">
                    {s.service_name}-{s.department_name} {index === ticket.services.length - 1? "-" : "/"}
                  </Text>
              ))}
                  <Tag className="service-tag">{ticket.services[0].service_type || "Standard Plan"}</Tag>
              </div>

              <Text>
                <UserOutlined /> {ticket.full_name}
              </Text>
              <br />
              <Text>
                🧑 Assigned to:{" "}
                <span className="employee-name">
                  {getEmployeeName(
                    ticket.employee_id ||
                      ticket.assign_to ||
                      ticket.assigned_to
                  )}
                </span>
              </Text>
              <br />
              <Text>
                <EnvironmentOutlined /> {ticket.address}
              </Text>
              <br />
              <Text>
                <CalendarOutlined />{" "}
                {moment(ticket.preferred_date).format("LL")} -{" "}
                {Slots.find((s) => s.id === ticket.slot_id)?.slot_time}
              </Text>

              {getUserDetails("user")?.role_id === 3 && (
                <Row justify="end" className="ticket-actions">
                  {ticket.normalizedStatus === "Pending" && (
                    <Button
                      type="primary"
                      className="btn-start"
                      onClick={async () => {
                        const phone = ticket.phone;
                        if (!phone)
                          return message.error("No customer phone number!");
                        try {
                          await otpSend(phone);
                          message.success(`OTP sent to ${phone}`);
                          handleOpenOtpModal(ticket.id);
                        } catch {
                          message.error("Failed to send OTP");
                        }
                      }}
                    >
                      Start Service
                    </Button>
                  )}

                  {ticket.normalizedStatus === "In-Progress" && (
                    <Button
                      type="primary"
                      className="btn-complete"
                      onClick={() => handleCompleteService(ticket.id)}
                    >
                      Complete Service
                    </Button>
                  )}
                </Row>
              )}
            </Card>
          ))
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
  <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={totalTickets}
    showSizeChanger
    onChange={handlePageChange}
   // showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} tickets`}
  />
</div>


      <Modal
        title={<b>Verify Start OTP</b>}
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <div className="otp-modal">
          <p>Enter the 6-digit OTP provided by the customer.</p>
          <Input.OTP
            length={6}
            size="large"
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
            className="otp-input"
          />
          <Button type="primary" block className="otp-btn" onClick={handleVerifyOtp}>
            Verify & Proceed
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
