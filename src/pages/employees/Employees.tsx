import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Select, Typography, Avatar, Tag, List, Divider, Button, Modal, Form, Input, message } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  name: string;
  services: string[];
  status: 'Available' | 'Assigned';
  phone: string;
  location: string;
}

const initialEmployeesData: Employee[] = [
  { id: 1, name: 'Arun Kumar', services: ['Home Cleaning', 'Kitchen', 'Bathroom'], status: 'Available', phone: '+91 98765 11111', location: 'Hyderabad' },
  { id: 2, name: 'Priya Sharma', services: ['Office Cleaning', 'Sofa & Carpet'], status: 'Available', phone: '+91 98765 22222', location: 'Bangalore' },
  { id: 3, name: 'Ravi Singh', services: ['Pest Control', 'Deep Cleaning'], status: 'Available', phone: '+91 98765 33333', location: 'Hyderabad' },
  { id: 4, name: 'Sunita Devi', services: ['Kitchen', 'Bathroom', 'Home Cleaning'], status: 'Available', phone: '+91 98765 44444', location: 'Delhi' },
  { id: 5, name: 'Anil Mehta', services: ['Painting', 'Home Cleaning'], status: 'Assigned', phone: '+91 98765 55555', location: 'Mumbai' },
  { id: 6, name: 'Geeta Gupta', services: ['AC Service', 'Appliance Repair'], status: 'Available', phone: '+91 98765 66666', location: 'Bangalore' },
  { id: 7, name: 'Sanjay Verma', services: ['Office Cleaning', 'Deep Cleaning'], status: 'Available', phone: '+91 98765 77777', location: 'Delhi' },
  { id: 8, name: 'Meena Kumari', services: ['Sofa & Carpet', 'Home Cleaning'], status: 'Assigned', phone: '+91 98765 88888', location: 'Mumbai' }
];

const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
const allServices = [
  'Home Cleaning', 'Kitchen', 'Bathroom', 'Office Cleaning', 'Sofa & Carpet', 'Pest Control', 'Deep Cleaning', 'Painting', 'AC Service', 'Appliance Repair'
];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeesData);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(employees[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let employeesToFilter = employees;
    if (locationFilter !== 'All Locations') {
      employeesToFilter = employees.filter(emp => emp.location === locationFilter);
    }
    setFilteredEmployees(employeesToFilter);
  }, [locationFilter, employees]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddEmployee = (values: any) => {
    const newEmployee: Employee = {
      id: Date.now(),
      ...values,
      status: 'Available',
    };
    setEmployees(prev => [...prev, newEmployee]);
    message.success('Employee added successfully!');
    handleCancel();
  };

  const EmployeeDetails = ({ employee }: { employee: Employee | null }) => {
    if (!employee) {
      return (
        <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <Paragraph type="secondary" style={{ marginTop: 16 }}>Select an employee to view details</Paragraph>
          </div>
        </Card>
      );
    }

    return (
      <Card style={{ height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={96} style={{ backgroundColor: '#14b8a6', marginBottom: 16, fontSize: 48 }}>
            {employee.name.charAt(0)}
          </Avatar>
          <Title level={3}>{employee.name}</Title>
          <Tag
            icon={employee.status === 'Available' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            color={employee.status === 'Available' ? 'success' : 'warning'}
          >
            {employee.status}
          </Tag>
        </div>
        <Divider />
        <div>
          <Paragraph>
            <PhoneOutlined style={{ marginRight: 8 }} /> {employee.phone}
          </Paragraph>
          <Paragraph>
            <EnvironmentOutlined style={{ marginRight: 8 }} /> {employee.location}
          </Paragraph>
        </div>
        <Divider />
        <Title level={5}>Specialties</Title>
        <div>
          {employee.services.map(service => (
            <Tag key={service} style={{ marginBottom: 8 }}>{service}</Tag>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div
      style={{
        height: '100vh',           
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        boxSizing: 'border-box',
        background: '#f5f7fa',
      }}
    >
     
      <div
        style={{
          flex: '0 0 auto',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>Employee Management</Title>
        <div style={{ display: 'flex', gap: 16 }}>
          <Select
            defaultValue="All Locations"
            style={{ width: 200 }}
            onChange={setLocationFilter}
            options={[{ label: 'All Locations', value: 'All Locations' }, ...locations.map(loc => ({ label: loc, value: loc }))]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            style={{
              background: "linear-gradient(90deg, #009688 0%, #00bcd4 100%)",
              border: "none",
              borderRadius: 20,
              fontWeight: "bold",
              height: 40,
              color: "#fff",
              fontSize: 16,
              padding: "0 24px",
            }}
          >
            Add Employee
          </Button>
        </div>
      </div>

     
      <Row
        gutter={24}
        style={{ flex: '1 1 auto', minHeight: 0 }}  
      >
        
        <Col
          xs={24}
          md={8}
          style={{
            height: '100%',
            overflowY: 'auto',
            paddingRight: 8,
          }}
        >
          <Card title="Employee List" style={{ height: '100%' }}>
            <List
              itemLayout="horizontal"
              dataSource={filteredEmployees}
              renderItem={(employee) => (
                <List.Item
                  onClick={() => setSelectedEmployee(employee)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: 8,
                    backgroundColor: selectedEmployee?.id === employee.id ? '#f0fdfa' : 'transparent',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#0d9488' }}>{employee.name.charAt(0)}</Avatar>}
                    title={<Text strong>{employee.name}</Text>}
                    description={employee.location}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        
        <Col xs={24} md={16} style={{ height: '100%' }}>
          <EmployeeDetails employee={selectedEmployee} />
        </Col>
      </Row>

      <Modal
        title="Add New Employee"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            style={{
              background: "linear-gradient(90deg, #009688 0%, #00bcd4 100%)",
              border: "none",
              borderRadius: 20,
              fontWeight: "bold",
              height: 40,
              color: "#fff",
              fontSize: 16,
              padding: "0 24px",
            }}
          >
            Add Employee
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter the name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter the phone number' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please select a location' }]}>
            <Select options={locations.map(loc => ({ label: loc, value: loc }))} />
          </Form.Item>
          <Form.Item name="services" label="Services" rules={[{ required: true, message: 'Please select at least one service' }]}>
            <Select mode="multiple" allowClear options={allServices.map(s => ({ label: s, value: s }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
