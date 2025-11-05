import React, { useState, useEffect } from "react";
import type { SelectProps } from "antd";
import {
  Card,
  Col,
  Row,
  Select,
  Typography,
  Avatar,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Divider,
  Table,
  Popconfirm,
} from "antd";
import {
  PhoneFilled,
  EnvironmentFilled,
  PlusOutlined,
  DeleteOutlined,
  // ArrowRightOutlined,
  MailOutlined
} from "@ant-design/icons";
import {
  // createEmployee,
  getAllUsers,
  getAllLocations,
  getAllDepartments,
  getAllRoles,
  deleteEmployeeById,
} from "../../app/services/auth";
import LoaderGif from "../../assets/SWACHIFY_gif.gif";

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  code?: string; // Add employee code if available
  name: string;
  email: string;
  services: string[];
  status: "Available" | "Assigned";
  phone: string;
  location: string;
  depts: string[];
}

const EmployeeCard: React.FC<{
  employee: Employee;
  onDelete: (id: number) => void;
}> = ({ employee, onDelete }) => (
  <Card
    hoverable
    style={{
      borderRadius: "10px",
      border: "1px solid #dcfce7",
      height: "220px",
      transition: "all 0.3s ease",
    }}
  >
    <Popconfirm
      title="Are you sure you want to delete this employee?"
      onConfirm={() => onDelete(employee.id)}
      okText="Yes"
      cancelText="No"
    >
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          borderRadius: "8px",
        }}
      />
    </Popconfirm>

    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}>
      <Avatar
        size={30}
        style={{
          backgroundColor: "#14b8a6",
          fontSize: 24,
          color: "#fff",
        }}
      >
        {employee.name.charAt(0)}
      </Avatar>
      <div style={{ overflow: "hidden" }}>
        <Title
          level={5}
          style={{
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 120,
          }}
        >
          {employee.name}
        </Title>
        <Tag
          color={employee.status === "Available" ? "success" : "warning"}
          style={{ marginTop: 4 }}
        >
          {employee.status}
        </Tag>
      </div>
    </div>
    <Divider style={{ margin: "12px 0" }} />
    <div style={{ marginBottom: 12 }}>
      <Text strong>Departments:</Text>
      <div style={{ marginTop: 4 }}>
        {employee.depts?.length ? (
          employee.depts.map((dept: string) => (
            <Tag key={dept} color="#0d9488" style={{ marginBottom: 4 }}>
              {dept}
            </Tag>
          ))
        ) : (
          <Text type="secondary">No departments assigned</Text>
        )}
      </div>
    </div>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
      }}
    >
      <Paragraph
        style={{
          margin: 0,
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <EnvironmentFilled style={{ color: "#ef4444" }} />{" "}
        {employee.location || "Unknown"}
      </Paragraph>
      <Paragraph
        style={{
          margin: 0,
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <PhoneFilled style={{ color: "#ef4444" }} />
        {employee.phone || "+1 999-9999-99"}
      </Paragraph>
    </div>
  </Card>
);

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>("All Locations");
  const [locationsData, setLocationsData] = useState<any>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [departmentsdata, setdepartmentsdata] = useState<any>([]);
  const [rolesData, setRolesData] = useState<SelectProps["options"]>([]);
  const [viewType, setViewType] = useState<'grid' | 'card'>('grid'); // <-- VIEW MODE state
  

  const locationOptions = [
    { label: "All Locations", value: "All Locations" },
    ...locationsData.map((loc: any) => ({
      label: loc.label,
      value: loc.label,
    })),
  ];

  const getAllUsersApi = async () => {
    try {
      const res = await getAllUsers();
      const usersWithFullName = res.map((user: any) => ({
        ...user,
        id: user.id, // ensure id
        code: user.code || `EMP${user.id}`, // add Employee Code if present, otherwise generate
        name: `${user.first_name} ${user.last_name}`,
        status: user.is_assigned ? "Assigned" : "Available",
        phone: user.mobile || "N/A",
        email: user.email || "N/A",
        depts: user.depts || [],
        location_id: user.location_id,
      }));
      setEmployees(usersWithFullName);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAllLocationsApi = async () => {
    try {
      const res = await getAllLocations();
      if (res && Array.isArray(res)) {
        const locationNames = res.map((loc: any) => ({
          label: loc.locationName,
          value: loc.locationId,
        }));
        setLocationsData(locationNames);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const getAllDepartmentsApi = async () => {
    try {
      const res = await getAllDepartments();
      if (res && Array.isArray(res)) {
        const uniqueDepartmentsMap = new Map();
        res.forEach((item) => {
          if (!uniqueDepartmentsMap.has(item.departmentId)) {
            uniqueDepartmentsMap.set(item.departmentId, {
              label: item.departmentName,
              value: item.departmentId,
            });
          }
        });
        setdepartmentsdata(Array.from(uniqueDepartmentsMap.values()));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const getAllRolesApi = async () => {
    try {
      const roles = await getAllRoles();
      if (Array.isArray(roles)) {
        setRolesData(
          roles.map((r: any) => ({
            label: r.roleName,
            value: r.roleId,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAllUsersApi(),
        getAllLocationsApi(),
        getAllDepartmentsApi(),
        getAllRolesApi(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!employees.length || !locationsData.length) return;
    // Map location_id → readable name
    const mappedEmployees = employees.map((emp: any) => {
      const locationObj = locationsData.find(
        (loc: any) => Number(loc.value) === Number(emp.location_id)
      );
      return {
        ...emp,
        location: locationObj ? locationObj.label : emp.location || "Unknown",
      };
    });
    // Apply location filter
    const employeesToShow =
      locationFilter === "All Locations"
        ? mappedEmployees
        : mappedEmployees.filter((emp: any) => emp.location === locationFilter);
    setFilteredEmployees(employeesToShow);
  }, [employees, locationsData, locationFilter]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddEmployee = async (values: any) => {
    try {
      setLoading(true);
      const [firstName, ...rest] = values.name.trim().split(" ");
      const lastName = rest.join(" ") || firstName;
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: values.email,
        mobile: values.phone,
        location_id: values.location,
        dept_id: values.services,
        role_id: values.role_id,
      };
      // const res = await createEmployee(payload);
      message.success("Employee added successfully!");
      setEmployees((prev: any) => [
        {
          ...payload,
          id: Date.now(),
          code: `EMP${Date.now()}`,
          name: values.name,
          status: "Available",
          location:
            locationsData.find(
              (loc: any) => Number(loc.value) === Number(values.location)
            )?.label || "Unknown",
          depts: [
            departmentsdata.find(
              (d: any) => Number(d.value) === Number(values.services)
            )?.label || "",
          ],
          phone: values.phone,
        },
        ...prev,
      ]);
      handleCancel();
    } catch (error) {
      message.error("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await deleteEmployeeById(id);
      setEmployees((prev: any) => prev.filter((emp: any) => emp.id !== id));
      message.success("Employee deleted successfully!");
    } catch (error) {
      message.error("Failed to delete employee!");
    }
  };

  // Table columns for Grid view
  const columns = [
    {
  title: "S.NO",
  key: "sno",
  render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
  width: 60,
},

    {
      title: (
        <span>
          Emp No 
        </span>
      ),
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span style={{ fontWeight: "bold", color: "#0d9488" }}>
          {code}
        </span>
      ),
      width: 150,
    },
    {
      title: " Emp Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Available" ? "success" : "warning"}>
          {status}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Departments",
      dataIndex: "depts",
      key: "depts",
      render: (depts: string[]) =>
        depts?.length
          ? depts.map((dept: string) => (
              <Tag key={dept} color="#0d9488">
                {dept}
              </Tag>
            ))
          : <Text type="secondary">No departments assigned</Text>,
      width: 200,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc: string) => (
        <span>
          <EnvironmentFilled style={{ color: "#ef4444" }} /> {loc}
        </span>
      ),
      width: 120,
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span>
          <PhoneFilled style={{ color: "#ef4444" }} /> {phone}
        </span>
      ),
      width: 140,
    },
      {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span>
          <MailOutlined style={{ color: "#ef4444" }} /> {email}
        </span>
      ),
      width: 140,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Employee) => (
        <Space>
        
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDeleteEmployee(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <img src={LoaderGif} alt="Loading..." style={{ width: "150px" }} />
      </div>
    );
  }

  return (
    <div
      className="employees-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 150px)",
        animation: "fadeIn 0.5s",
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{ paddingBottom: 24, flexWrap: "wrap", gap: 16 }}
      >
        <Col>
          <Title level={2} style={{ fontWeight: "bold", color: "#0a0b0bff", margin: 0 }}>
            EMPLOYEES
          </Title>
        </Col>
        <Col>
          <Space wrap>
            <Button
              onClick={() => setViewType(viewType === "grid" ? "card" : "grid")}
              type={viewType === "grid" ? "primary" : "default"}
              style={{ marginLeft: 4, marginRight: 330, backgroundColor: "#14B8A6", borderColor: "#14B8A6", color: "white" }}
            >
             {viewType == "grid" ? "Grid View" : "Card View"}
            </Button>
            <Select
              value={locationFilter}
              style={{ width: 180 }}
              onChange={setLocationFilter}
              options={locationOptions}
            />
            <Button
              className="color"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add User
            </Button>
            {/* View Switch */}
          
            {/* <Button
              onClick={() => setViewType("card")}
              type={viewType === "card" ? "primary" : "default"}
            >
              Card View
            </Button> */}
          </Space>
        </Col>
      </Row>
      {/* Content */}
      <div className="scrollable-grid" style={{ flex: 1, overflowY: "auto" }}>
        {viewType === "grid" ? (
          <Table
            dataSource={filteredEmployees}
            columns={columns}
            pagination={false}
            rowKey="id"
            rowClassName={(_, idx) =>
              idx % 2 === 0 ? "even-row" : "odd-row"
            }
            style={{ background: "#fff" }}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredEmployees.map((employee) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={employee.id}>
                <EmployeeCard
                  employee={employee}
                  onDelete={handleDeleteEmployee}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
      {/* Modal */}
      <Modal
        title="Add New User"
        open={isModalVisible}
        width={1000}
        onCancel={handleCancel}
        style={{
          height: "90vh",
          bottom: 80,
        }}
        footer={[
          <Button
            key="back"
            style={{ borderColor: "#14B8A6", color: "black" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            style={{
              backgroundColor: "#14B8A6",
              color: "#ffffff",
              borderColor: "#14B8A6",
            }}
            onClick={() => form.submit()}
          >
            Add User
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEmployee}
          style={{ marginTop: 28 }}
        >
         <Row gutter={24}>
            {/* Full Name */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter full name" },
                  {
                    pattern: /^[A-Za-z]{2,}(?:\s[A-Za-z]{1,})+$/,
                    message: "Enter valid full name ",
                  },
                ]}
                getValueFromEvent={(e) => e.target.value.trimStart()}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>


            {/* Email */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                normalize={(value) => value?.trim()}
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>


            {/* Phone Number */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Phone number is required" },
                  {
                    pattern: /^\d{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                ]}
              >
                <Input
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>


            {/* Location */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[
                  { required: true, message: "Please select a location" },
                ]}
              >
                <Select
                  options={locationsData}
                  placeholder="Select location"
                  showSearch={false}
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>


            {/* Services */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="services"
                label="Departments"
                rules={[
                  { required: true, message: "Please select a department" },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  options={departmentsdata}
                  placeholder="Select department"
                  showSearch={false} // <-- Re-applying this fix
                />
              </Form.Item>
            </Col>


            {/* Role */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="role_id"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select
                  allowClear
                  placeholder="Select role"
                  options={rolesData}
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* Styles */}
      <style>
        {`
        .even-row { background-color: #f9fafb !important; }
        .odd-row { background-color: #ffffff !important; }
        `}
      </style>
    </div>
  );
};

export default Employees;
