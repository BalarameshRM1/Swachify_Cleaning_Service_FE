import React, { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';
import { Card, Col, Row, Select, Typography, Avatar, Tag, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { PhoneFilled, EnvironmentFilled, PlusOutlined } from '@ant-design/icons'; 
import { createEmployee, getAllUsers, getAllLocations,getAllDepartments,getAllRoles } from "../../app/services/auth";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteEmployeeById } from '../../app/services/auth';
import LoaderGif from "../../assets/SWACHIFY_gif.gif"; 
import "./Employees.css"

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  name: string;
  email: string;
  services: string[];
  status: 'Available' | 'Assigned';
  phone: string;
  location: string;
  depts: string[];
}

//const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];

//const Role = ['Employee','Admin','Super Admin'];

const EmployeeCard: React.FC<{ employee: Employee; onDelete: (id: number) => void }> = ({ employee, onDelete }) => (
 <Card hoverable className="employee-card">
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
      className="delete-button"
    />
  </Popconfirm>

  <div className="employee-header">
    <Avatar size={30} className="employee-avatar">
      {employee.name.charAt(0)}
    </Avatar>
    <div className="employee-info">
      <Title level={5} className="employee-name">
        {employee.name}
      </Title>
      <Tag
        color={employee.status === "Available" ? "success" : "warning"}
        className="employee-status"
      >
        {employee.status}
      </Tag>
    </div>
  </div>

  <Divider className="employee-divider" />

  <div className="employee-departments">
    <Text strong>Departments:</Text>
    <div className="department-tags">
      {employee.depts?.length ? (
        employee.depts.map((dept) => (
          <Tag key={dept} color="#0d9488" className="dept-tag">
            {dept}
          </Tag>
        ))
      ) : (
        <Text type="secondary">No departments assigned</Text>
      )}
    </div>
  </div>

  <div className="employee-footer">
    <Paragraph className="employee-location">
      <EnvironmentFilled className="icon" /> {employee.location || "Unknown"}
    </Paragraph>
    <Paragraph className="employee-phone">
      <PhoneFilled className="icon" /> {employee.phone || "+1 999-9999-99"}
    </Paragraph>
  </div>
</Card>

);


const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<any>([]);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [locationsData, setLocationsData] = useState<any>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true); 
  const[departmentsdata,setdepartmentsdata]=useState<any>([]);
  const [rolesData, setRolesData] = useState<SelectProps['options']>([]);
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
    console.log("Raw users from API:", res);

    const usersWithFullName = res.map((user: any) => ({
      ...user,
      name: `${user.first_name} ${user.last_name}`,
      status: user.is_assigned ? "Assigned" : "Available",
      phone: user.mobile || "N/A",
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
    console.log("Fetched locations:", res);

    if (res && Array.isArray(res)) {
      const locationNames = res.map((loc: any) => ({
        label: loc.locationName,  
        value: loc.locationId, 
      }));
      setLocationsData(locationNames);
    } else {
      console.warn("Invalid location data format:", res);
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};
const getAllDepartmentsApi = async () => {
  try {
    const res = await getAllDepartments();
    console.log("Fetched departments:", res);

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

      const uniqueDepartments = Array.from(uniqueDepartmentsMap.values());
      setdepartmentsdata(uniqueDepartments);
      console.log("Mapped departments:", uniqueDepartments);
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};
const getAllRolesApi = async () => {
  try {
    const roles = await getAllRoles();
    console.log("Fetched roles:", roles);
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







  useEffect(()=>{
    const fetchData = async () => {
      await Promise.all([getAllUsersApi(), getAllLocationsApi(),getAllDepartmentsApi (), getAllRolesApi(),]);
      setLoading(false);
    };
    fetchData();
  },[]);
 useEffect(() => {
  if (!employees.length || !locationsData.length) return;

  // Step 1️⃣: Map location_id → readable name
  const mappedEmployees = employees.map((emp: any) => {
    const locationObj = locationsData.find(
      (loc: any) => Number(loc.value) === Number(emp.location_id)
    );

    return {
      ...emp,
      location: locationObj ? locationObj.label : emp.location || "Unknown",
    };
  });

  // Step 2️⃣: Apply location filter
  const employeesToShow =
    locationFilter === "All Locations"
      ? mappedEmployees
      : mappedEmployees.filter(
          (emp: any) => emp.location === locationFilter
        );

  // Step 3️⃣: Update grid
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

    console.log("Corrected Payload to API:", payload);

    const res = await createEmployee(payload);
    console.log("Employee created successfully:", res);
    message.success("Employee added successfully!");

  
    setEmployees((prev: any) => [
  {
    ...payload,
    id: Date.now(),
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
    console.error("Error creating employee:", error);
    message.error("Failed to create employee");
  } finally {
    setLoading(false);
  }
};

  
// const locationOptions: SelectProps['options'] = [
//   {
//     value: 'All Locations',
//     label: (
//       <div className="location-option">
//         <EnvironmentFilled className="location-icon" />
//         <span>All Locations</span>
//       </div>
//     ),
//   },
//   ...locations.map((loc) => ({
//     label: loc,
//     value: loc,
//   })),
// ];


 const handleDeleteEmployee = async (id: number) => {
  try {
    await deleteEmployeeById(id);
    setEmployees((prev: any) => prev.filter((emp: any) => emp.id !== id));
    message.success("Employee deleted successfully!");
  } catch (error) {
    console.error("Error deleting employee:", error);
    message.error("Failed to delete employee!");
  }
};


if (loading) {
  return (
    <div className="loader-container">
      <img src={LoaderGif} alt="Loading..." className="loader-image" />
    </div>
  );
}


 return (
  <div className="employees-container">
    <Row justify="space-between" align="middle" className="employees-header">
      <Col>
        <Title level={2} className="employees-title">
          EMPLOYEES
        </Title>
      </Col>
      <Col>
        <Space wrap>
          <Select
            value={locationFilter}
            style={{ width: 180 }}
            onChange={setLocationFilter}
            options={locationOptions}
          />
          <Button className="color" icon={<PlusOutlined />} onClick={showModal}>
            Add User
          </Button>
        </Space>
      </Col>
    </Row>

    <div className="scrollable-grid content-grid">
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
    </div>

    <Modal
      title="Add New User"
      open={isModalVisible}
      width={1000}
      onCancel={handleCancel}
      className="employee-modal"
      footer={[
        <Button
          key="back"
          className="cancel-btn"
          onClick={handleCancel}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          className="submit-btn"
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
        className="employee-form"
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
                  message: "Enter valid full name",
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

          {/* Phone */}
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
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
              />
            </Form.Item>
          </Col>

          {/* Location */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please select a location" }]}
            >
              <Select
                options={locationsData}
                placeholder="Select location"
                showSearch={false}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          {/* Departments */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="services"
              label="Departments"
              rules={[{ required: true, message: "Please select a department" }]}
            >
              <Select
                mode="multiple"
                allowClear
                options={departmentsdata}
                placeholder="Select department"
                showSearch={false}
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
  </div>
);

};

export default Employees;