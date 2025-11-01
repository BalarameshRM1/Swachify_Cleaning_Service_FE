import React, { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';
import { Card, Col, Row, Select, Typography, Avatar, Tag, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { PhoneFilled, EnvironmentFilled, PlusOutlined } from '@ant-design/icons'; 
import { createEmployee, getAllUsers, getAllLocations,getAllDepartments } from "../../app/services/auth";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteEmployeeById } from '../../app/services/auth';
import LoaderGif from "../../assets/SWACHIFY_gif.gif"; 

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

const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];

const Role = ['Employee','Admin','Super Admin'];

const EmployeeCard: React.FC<{ employee: Employee; onDelete: (id: number) => void }> = ({ employee, onDelete }) => (
  <Card
    hoverable
    style={{
      borderRadius: '10px',
      border: '1px solid #dcfce7',
      height: '220px',
      
      transition: 'all 0.3s ease',
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

    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
      <Avatar
        size={30}
        style={{
          backgroundColor: '#14b8a6',
          fontSize: 24,
          color: '#fff',
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
            maxWidth: 120,
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
  const [employees, setEmployees] = useState<any>([]);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [locationsData, setLocationsData] = useState<any>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true); 
  const[departmentsdata,setdepartmentsdata]=useState<any>([]);

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




  useEffect(()=>{
    const fetchData = async () => {
      await Promise.all([getAllUsersApi(), getAllLocationsApi(),getAllDepartmentsApi (),]);
      setLoading(false);
    };
    fetchData();
  },[]);
  useEffect(() => {
  if (employees.length && locationsData.length) {
    const updated = employees.map((emp: any) => ({
      ...emp,
      location:
        locationsData.find(
          (loc: any) => Number(loc.value) === Number(emp.location_id)
        )?.label || "Unknown",
    }));
    setFilteredEmployees(updated);
  }
}, [employees, locationsData]);


  useEffect(() => {
  let employeesToFilter = filteredEmployees;
  if (locationFilter !== "All Locations") {
    employeesToFilter = filteredEmployees.filter(
      (emp: any) => emp.location === locationFilter
    );
  }
  setFilteredEmployees(employeesToFilter);
}, [locationFilter]);


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
      dept_id: [values.services],     
      

      role_id:
        values.Role === "Employee"
          ? 3 
          : values.Role === "Admin"
          ? 2
          : 1,
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

  
  const locationOptions: SelectProps['options'] = [
    {
        value: 'All Locations',
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <EnvironmentFilled style={{ color: '#ef4444', fontSize: '16px' }} />
                <span>All Locations</span>
            </div>
        )
    },
    ...locations.map(loc => ({ label: loc, value: loc }))
  ];

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <img src={LoaderGif} alt="Loading..." style={{ width: "150px" }} />
    </div>
  );
}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', animation: 'fadeIn 0.5s' }}>
        <Row justify="space-between" align="middle" style={{ paddingBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <Col>
                <Title level={2} style={{ margin: 0 }}>Employees</Title>
            </Col>
            <Col>
                <Space wrap>
                    <Select
                        defaultValue="All Locations"
                        style={{ width: 150 }}
                        onChange={setLocationFilter}
                        options={locationOptions} 
                    />
                    <Button className='color' icon={<PlusOutlined />} onClick={showModal}>
                        Add User
                    </Button>
                </Space>
            </Col>
        </Row>

        <div className="scrollable-grid" style={{ flex: 1, overflowY: 'auto' }}>
            <Row gutter={[24, 24]}>
                {filteredEmployees.map(employee => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={employee.id}>
                      <EmployeeCard employee={employee} onDelete={handleDeleteEmployee} />
                    </Col>
                ))}
            </Row>
        </div>

      <Modal
      title="Add New User"
      open={isModalVisible}
      width={1000} 
      onCancel={handleCancel}
         style={{
        height: "90vh", 
        bottom:80,
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
                  pattern:/^[A-Za-z]{2,}(?:\s[A-Za-z]{1,})+$/,
                  message:
                    "Enter valid full name ",
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
                {
                  pattern: /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/,
                  message: "Email must be a valid Gmail address",
                },
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

          {/* Services */}
          <Col xs={24} sm={12}>
           <Form.Item
              name="services"
              label="Departments"
              rules={[{ required: true, message: "Please select a department" }]}
            >
              <Select
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
              name="Role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                allowClear
                options={Role.map((s: string) => ({
                  label: s,
                  value: s,
                }))}
                placeholder="Select Role"
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>

        <style>
        {`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ant-card-hoverable:hover {
                border-color: #14b8a6 !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            }
            .scrollable-grid::-webkit-scrollbar {
                display: none;
            }
            .scrollable-grid {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}
        </style>
    </div>
  );
};

export default Employees;