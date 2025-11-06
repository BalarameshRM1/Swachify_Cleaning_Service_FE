import React, { useState, useEffect } from "react";
// import type { SelectProps } from "antd";
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
  EditOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  getAllLocations,
  getAllDepartments,
  getAllRoles,
  deleteEmployeeById,
  createEmployee,
  editEmployee
} from "../../app/services/auth";
import LoaderGif from "../../assets/SWACHIFY_gif.gif";

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  code?: string;
  name: string;
  email: string;
  services?: string[];
  status: "Available" | "Assigned";
  phone: string;
  location: string;
  location_id?: number;
  depts?: string[];
  role_id?: number;
}

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: number) => void;
  onEdit: (emp: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onDelete, onEdit }) => (
 <Card
    hoverable
    style={{
      borderRadius: '10px',
      border: '1px solid #dcfce7',
      // maxHeight: '280px',
      transition: 'all 0.3s ease',
      // position: 'relative', // <-- REMOVED
    }}
    bodyStyle={{ padding: '16px' }} // <-- UPDATED PADDING
  >
    {/* NEW FLEX HEADER WRAPPER */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>

      {/* LEFT SIDE: Avatar, Name, Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
        <Avatar
          size={30}
          style={{
            backgroundColor: '#14b8a6',
            fontSize: 24,
            color: '#fff',
            flexShrink: 0
          }}
        >
          {employee.name.charAt(0)}
        </Avatar>
        <div style={{ overflow: 'hidden' }}>
          <Title
            level={5}
            style={{
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 120, // This matches your image's truncated names
            }}
          >
            {employee.name}
          </Title>
          <Tag
            color={employee.status === 'Available' ? 'success' : 'warning'}
            style={{ marginTop: 4 }}
          >
            {employee.status}
          </Tag>
        </div>
      </div>

      {/* RIGHT SIDE: Icons (Moved from .card-actions) */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <Button
          type="text"
          icon={<EditOutlined />}
          aria-label="Edit employee"
          onClick={() => onEdit(employee)}
        />
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
            aria-label="Delete employee"
          />
        </Popconfirm>
      </div>
    </div>

    {/* The rest of the card content remains the same */}
    <Divider style={{ margin: '12px 0' }} />

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
      <Paragraph style={{ margin: 0, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
        <EnvironmentFilled style={{ color: '#ef4444' }} /> {employee.location || 'Unknown'}
      </Paragraph>

      <Paragraph style={{ margin: 0, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
        <PhoneFilled style={{ color: '#ef4444' }} />
        {employee.phone || '+1 999-9999-99'}
      </Paragraph>
    </div>
  </Card>
);

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locationsData, setLocationsData] = useState<any["options"]>([]);
  const [departmentsdata, setdepartmentsdata] = useState<any["options"]>([]);
  const [rolesData, setRolesData] = useState<any["options"]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>("All Locations");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [form] = Form.useForm();
  const [viewType, setViewType] = useState<'grid' | 'card'>('grid');

  const locationOptions = [
    { label: "All Locations", value: "All Locations" },
    ...locationsData,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, locations, departments, roles] = await Promise.all([
          getAllUsers(),
          getAllLocations(),
          getAllDepartments(),
          getAllRoles(),
        ]);

        setLocationsData(locations.map((l: any) => ({ label: l.locationName, value: l.locationId })));
        setdepartmentsdata(Array.from(new Map(departments.map((d: any) => [d.departmentId, { label: d.departmentName, value: d.departmentId }])).values()));
        setRolesData(roles.map((r: any) => ({ label: r.roleName, value: r.roleId })));

        const mappedUsers = users.map((u: any) => ({
          ...u,
          id: u.id,
          code: u.code || `EMP${u.id}`,
          name: `${u.first_name} ${u.last_name}`,
          status: u.is_assigned ? "Assigned" : "Available",
          phone: u.mobile || "N/A",
          email: u.email || "N/A",
          depts: u.depts || [],
          location_id: u.location_id,
        }));

        setEmployees(mappedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const mappedEmployees = employees.map(emp => {
      const loc = locationsData.find((l:any) => Number(l.value) === Number(emp.location_id));
      return { ...emp, location: loc?.label || emp.location || "Unknown" };
    });
    setFilteredEmployees(locationFilter === "All Locations" ? mappedEmployees : mappedEmployees.filter(emp => emp.location === locationFilter));
  }, [employees, locationsData, locationFilter]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const createEmployeeApi = async(data:any) =>{
    try {
      await createEmployee(data);      
    } catch (error) {
      console.log('err',error) 
    }
  }

  const updateEmployeeApi = async(data:any) =>{
    try {
      await editEmployee(data)      
    } catch (error) {
      console.log('err',error) 
    }
  }

  const handleSubmitEmployee = (values: any) => {
    if (editingEmployee) {
      // Edit employee
      const updatedEmp: Employee = {
        ...editingEmployee,
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: locationsData.find((l:any) => l.value === values.location)?.label || "Unknown",
        location_id: values.location,
        depts: values.services.map((v: any) => departmentsdata.find((d:any) => d.value === v)?.label || ""),
        role_id: values.role_id,
      };
      const payload = {
        id: updatedEmp.id,
        first_name: values.name?.split(' ')[0],
        last_name: values.name?.split(' ')[1],
        email: values.email,
        mobile: values.phone,
        location_id: values.location,   
        dept_id: values.services,
        role_id: values.role_id,
      };
      updateEmployeeApi(payload)
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? updatedEmp : emp));
      message.success("Employee updated successfully!");
    } else {
      // Add new employee
      const newEmp: Employee = {
        id: Date.now(),
        code: `EMP${Date.now()}`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: locationsData.find((l:any) => l.value === values.location)?.label || "Unknown",
        location_id: values.location,
        depts: values.services.map((v: any) => departmentsdata.find((d:any) => d.value === v)?.label || ""),
        status: "Available",
        services: [],
        role_id: values.role_id,
      };

      const payload = {
        first_name: values.name?.split(' ')[0],
        last_name: values.name?.split(' ')[1],
        email: values.email,
        mobile: values.phone,
        location_id: values.location,   
        dept_id: values.services,
        role_id: values.role_id,
      };
      createEmployeeApi(payload)
      setEmployees(prev => [newEmp, ...prev]);
      message.success("Employee added successfully!");
    }
    handleCancel();
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await deleteEmployeeById(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      message.success("Employee deleted successfully!");
    } catch (err) {
      message.error("Failed to delete employee!");
    }
  };

  const handleEditEmployee = (emp: any) => {
    setEditingEmployee(emp);
    form.setFieldsValue({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      location: emp.location_id,
      services: emp.depts.map((d:any) => departmentsdata.find((dep:any) => dep.label === d)?.value),
      role_id: emp.role_id,
    });
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <img src={LoaderGif} alt="Loading..." className="loader-image" />
      </div>
    );
  }

  const columns = [
    { title: "S.NO", key: "sno", render: (_: any, __: any, idx: number) => idx + 1, width: 60 },
    { title: "Emp No", dataIndex: "code", key: "code", width: 150, render: (code:any) => <span style={{ fontWeight: "bold", color: "#0d9488" }}>{code}</span> },
    { title: "Emp Name", dataIndex: "name", key: "name", width: 200 },
    { title: "Mobile", dataIndex: "phone", key: "phone", render: (phone:any) => <><PhoneFilled style={{ color: "#ef4444" }} /> {phone}</> },
    { title: "Location", dataIndex: "location", key: "location", render: (loc:any) => <><EnvironmentFilled style={{ color: "#ef4444" }} /> {loc}</> },
    { title: "Email ID", dataIndex: "email", key: "email", render: (email:any) => <><MailOutlined style={{ color: "#ef4444" }} /> {email}</> },
    { title: "Status", dataIndex: "status", key: "status", render: (status:any) => <Tag color={status === "Available" ? "success" : "warning"}>{status}</Tag> },
    { title: "Action", key: "action", render: (_: any, record: Employee) => (
      <Space>
        <Button type="text" icon={<EditOutlined />} onClick={() => handleEditEmployee(record)} />
        <Popconfirm title="Delete?" onConfirm={() => handleDeleteEmployee(record.id)} okText="Yes" cancelText="No">
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ) }
  ];

  return (
    <div className="employees-container">
      <Row justify="space-between" align="middle" className="employees-header">
        <Col><Title level={2} className="employees-title">EMPLOYEES</Title></Col>
        <Col>
          <Space wrap>
            <Button
              onClick={() => setViewType(viewType === "grid" ? "card" : "grid")}
              type={viewType === "grid" ? "primary" : "default"}
              style={{ backgroundColor: "#14B8A6", borderColor: "#14B8A6", color: "white" }}
            >
              {viewType === "grid" ? "Grid View" : "Card View"}
            </Button>
            <Select value={locationFilter} style={{ width: 180 }} onChange={setLocationFilter} options={locationOptions} />
            <Button icon={<PlusOutlined />} onClick={() => { setEditingEmployee(null); setIsModalVisible(true); }}>Add User</Button>
          </Space>
        </Col>
      </Row>

      <div className="scrollable-grid">
        {viewType === "grid" ? (
          <Table dataSource={filteredEmployees} columns={columns} pagination={false} rowKey="id" scroll={{ x: 800, y: 520 }} />
        ) : (
          <Row gutter={[24, 24]} className="content-grid">
            {filteredEmployees.map(emp => (
              <Col xs={24} sm={12} lg={8} xl={6} key={emp.id}>
                <EmployeeCard employee={emp} onDelete={handleDeleteEmployee} onEdit={handleEditEmployee} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Modal
        title={editingEmployee ? "Edit User" : "Add New User"}
        open={isModalVisible}
        width={1000}
        onCancel={handleCancel}
        className="employee-modal"
        footer={[
          <Button key="back" className="cancel-btn" onClick={handleCancel}>Cancel</Button>,
          <Button key="submit" className="submit-btn" onClick={() => form.submit()}>
            {editingEmployee ? "Update User" : "Add User"}
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitEmployee} className="employee-form">
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter full name" }]}>
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter valid email" }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Enter phone number" }]}>
                <Input placeholder="Enter phone" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: "Select location" }]}>
                <Select options={locationsData} placeholder="Select location" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="services" label="Departments">
                <Select mode="multiple" options={departmentsdata} placeholder="Select departments" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="role_id" label="Role">
                <Select options={rolesData} placeholder="Select role" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
