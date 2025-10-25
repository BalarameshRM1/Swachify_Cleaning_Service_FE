
import React, { useEffect, useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Spin, 
  message, 
  Tag,
  Space 
} from "antd";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getAllUsers, getAllDepartments, getallBookings } from "../../app/services/auth";
import * as XLSX from "xlsx";

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

// interface User {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email?: string;
//   phone?: string;
//   role_id?: number;
// }

interface Department {
  id: number;
  department_name: string;
  is_active?: boolean;
}

interface StatusInfo {
  id: number;
  status: string;
  is_active: boolean;
}

interface DepartmentInfo {
  id: number;
  department_name: string;
  is_active: boolean;
}

interface Booking {
  id: number;
  dept_id: number;
  service_id: number;
  slot_id: number;
  created_by: number;
  created_by_name: string;
  created_date: string;
  modified_by: number | null;
  modified_date: string;
  is_active: boolean;
  preferred_date: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  status_id: number;
  assign_to: number | null;
  assign_to_name: string | null;
  is_regular: boolean | null;
  is_premium: boolean | null;
  is_ultimate: boolean | null;
  status: StatusInfo;
  department: DepartmentInfo;
}

// Status color mapping
const STATUS_COLOR_MAP: { [key: string]: string } = {
  "Pending": "orange",
  "Confirmed": "blue",
  "Completed": "green",
  "Cancelled": "red",
  "In-Progress": "cyan",
};

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

 // const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [selectedCustomerName, setSelectedCustomerName] = useState<string | undefined>();
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>();

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [usersData, deptData, bookingsData] = await Promise.all([
        getAllUsers(),
        getAllDepartments(),
        getallBookings(),
      ]);

      console.log("=== RAW API RESPONSES ===");
      console.log("Total Bookings:", bookingsData?.length);
      console.log("Users:", usersData?.length);
      console.log("Departments:", deptData?.length);
      console.log("Sample Booking:", bookingsData?.[0]);

     // setUsers(usersData || []);
      setDepartments(deptData || []);
      setBookings(bookingsData || []);
      setFilteredBookings(bookingsData || []);

      message.success(`Loaded ${bookingsData?.length || 0} bookings successfully`);

    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Get unique customer names from bookings
  const getUniqueCustomers = (): string[] => {
    const names = bookings.map(b => b.full_name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  };

  // Handle date range
  const handleDateChange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (values && values[0] && values[1]) {
      setDateRange([values[0], values[1]]);
    } else {
      setDateRange(null);
    }
  };

  // Reset filters
  const handleReset = () => {
    setDateRange(null);
    setSelectedCustomerName(undefined);
    setSelectedDeptId(undefined);
    setFilteredBookings(bookings);
    message.info("Filters reset - Showing all bookings");
  };

  // Apply filters
  const handleFilter = () => {
    let filtered = [...bookings];
    let filterCount = 0;

    // Date range filter (using preferred_date)
    if (dateRange) {
      const [from, to] = dateRange;
      filtered = filtered.filter((b) => {
        if (!b.preferred_date) return false;
        const bookingDate = dayjs(b.preferred_date);
        return (
          bookingDate.isSameOrAfter(from, "day") &&
          bookingDate.isSameOrBefore(to, "day")
        );
      });
      filterCount++;
    }

    // Customer filter (using full_name)
    if (selectedCustomerName) {
      filtered = filtered.filter((b) => b.full_name === selectedCustomerName);
      filterCount++;
    }

    // Department filter
    if (selectedDeptId !== undefined) {
      filtered = filtered.filter((b) => b.dept_id === selectedDeptId);
      filterCount++;
    }

    console.log(`Applied ${filterCount} filter(s), found ${filtered.length} result(s)`);
    setFilteredBookings(filtered);

    if (filterCount > 0) {
      message.success(`Found ${filtered.length} booking(s) matching your filters`);
    } else {
      message.info("No filters applied - Showing all bookings");
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredBookings.map((booking, index) => ({
        "S.No": index + 1,
        "Booking ID": booking.id,
        "Customer Name": booking.full_name || "N/A",
        "Phone": booking.phone || "N/A",
        "Email": booking.email || "N/A",
        "Department": booking.department?.department_name || "N/A",
        "Address": booking.address || "N/A",
        "Assigned Employee": booking.assign_to_name || "Not Assigned",
        "Preferred Date": booking.preferred_date 
          ? dayjs(booking.preferred_date).format("MMM DD, YYYY") 
          : "N/A",
        "Status": booking.status?.status || "Unknown",
        "Created By": booking.created_by_name || "N/A",
        "Created Date": booking.created_date 
          ? dayjs(booking.created_date).format("MMM DD, YYYY HH:mm") 
          : "N/A",
        "Service Type": booking.is_regular ? "Regular" : booking.is_premium ? "Premium" : booking.is_ultimate ? "Ultimate" : "N/A"
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const wscols = [
        { wch: 6 },  
        { wch: 12 }, 
        { wch: 20 }, 
        { wch: 15 }, 
        { wch: 25 }, 
        { wch: 20 }, 
        { wch: 30 }, 
        { wch: 20 }, 
        { wch: 15 }, 
        { wch: 12 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 15 }, 
      ];
      ws['!cols'] = wscols;

     
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Booking Reports");

      
      const fileName = `Booking_Reports_${dayjs().format("YYYY-MM-DD_HHmm")}.xlsx`;

    
      XLSX.writeFile(wb, fileName);

      message.success(`Exported ${exportData.length} bookings to Excel successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    }
  };

  
  const handleExportCSV = () => {
    try {
      
      const headers = [
        "S.No",
        "Booking ID",
        "Customer Name",
        "Phone",
        "Email",
        "Department",
        "Address",
        "Assigned Employee",
        "Preferred Date",
        "Status",
        "Created By",
        "Created Date",
        "Service Type"
      ];

      const csvData = filteredBookings.map((booking, index) => [
        index + 1,
        booking.id,
        booking.full_name || "N/A",
        booking.phone || "N/A",
        booking.email || "N/A",
        booking.department?.department_name || "N/A",
        booking.address || "N/A",
        booking.assign_to_name || "Not Assigned",
        booking.preferred_date ? dayjs(booking.preferred_date).format("MMM DD, YYYY") : "N/A",
        booking.status?.status || "Unknown",
        booking.created_by_name || "N/A",
        booking.created_date ? dayjs(booking.created_date).format("MMM DD, YYYY HH:mm") : "N/A",
        booking.is_regular ? "Regular" : booking.is_premium ? "Premium" : booking.is_ultimate ? "Ultimate" : "N/A"
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Booking_Reports_${dayjs().format("YYYY-MM-DD_HHmm")}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success(`Exported ${csvData.length} bookings to CSV successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    }
  };

  // Table columns
  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 200,
      render: (dept: DepartmentInfo) => dept?.department_name || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      title: "Assigned Employee",
      dataIndex: "assign_to_name",
      key: "assign_to_name",
      width: 200,
      render: (text) => (
        text ? (
          <span>{text}</span>
        ) : (
          <span style={{ color: "#999", fontStyle: "italic" }}>Not Assigned</span>
        )
      ),
    },
    {
      title: "Preferred Date",
      dataIndex: "preferred_date",
      key: "preferred_date",
      width: 150,
      render: (date) => date ? dayjs(date).format("MMM DD, YYYY") : "N/A",
      sorter: (a, b) => dayjs(a.preferred_date).unix() - dayjs(b.preferred_date).unix(),
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      key: "created_date",
      width: 180,
      render: (date) => date ? dayjs(date).format("MMM DD, YYYY HH:mm") : "N/A",
      sorter: (a, b) => dayjs(a.created_date).unix() - dayjs(b.created_date).unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      
      render: (status: StatusInfo) => {
        const statusText = status?.status || "Unknown";
        const color = STATUS_COLOR_MAP[statusText] || "default";
        return <Tag color={color}>{statusText}</Tag>;
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Confirmed", value: "Confirmed" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
        { text: "In-Progress", value: "In-Progress" },
      ],
      onFilter: (value, record) => record.status?.status === value,
    },
  ];

  return (
    <div 
      style={{ 
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "hidden"
      }}
    >
      <Spin spinning={loading} style={{ height: "100%" }}>
        <Card
          title={<span style={{ fontSize: "20px", fontWeight: 600 }}>Booking Reports</span>}
          bordered={false}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          bodyStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Filters Section - Fixed at top */}
          <div style={{ flexShrink: 0 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <RangePicker
                  onChange={handleDateChange}
                  style={{ width: "100%" }}
                  placeholder={["Start Date", "End Date"]}
                  value={dateRange}
                  format="MMM DD, YYYY"
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Select Customer"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  value={selectedCustomerName}
                  onChange={setSelectedCustomerName}
                  filterOption={(input, option) => {
                    const label = String(option?.children || "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {getUniqueCustomers().map((name) => (
                    <Option key={name} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Select Department"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  value={selectedDeptId}
                  onChange={setSelectedDeptId}
                  filterOption={(input, option) => {
                    const label = String(option?.children || "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {departments.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.department_name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {/* Filter and Export Buttons */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col xs={12} sm={6} md={4}>
                <Button type="primary" block onClick={handleFilter}>
                  Apply Filters
                </Button>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Button block onClick={handleReset}>
                  Reset Filters
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space style={{ width: "100%" }}>
                  <Button 
                    icon={<FileExcelOutlined />} 
                    onClick={handleExportExcel}
                    style={{ background: "#52c41a", color: "white" }}
                  >
                    Export Excel
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />} 
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* Summary */}
            <Row style={{ marginTop: 16, marginBottom: 16 }}>
              <Col span={24}>
                <Card 
                  size="small" 
                  style={{ 
                    background: "#e6f7ff", 
                    border: "1px solid #91d5ff",
                    borderRadius: "8px"
                  }}
                >
                  <strong>Showing {filteredBookings.length}</strong> of{" "}
                  <strong>{bookings.length}</strong> total bookings
                </Card>
              </Col>
            </Row>
          </div>

          {/* Table - Scrollable */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="id"
              scroll={{ x: 1800, y: "calc(100vh - 450px)" }}
              pagination={false}
              locale={{
                emptyText: (
                  <div style={{ padding: "40px 0" }}>
                    <p style={{ fontSize: "16px", color: "#999" }}>
                      No bookings found
                    </p>
                    <p style={{ fontSize: "14px", color: "#bbb" }}>
                      Try adjusting your filters or reset to see all bookings
                    </p>
                  </div>
                ),
              }}
              bordered
              sticky={{ offsetHeader: 0 }}
              size="middle"
            />
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default Reports;