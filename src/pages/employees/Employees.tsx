import React, { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';
import { Card, Col, Row, Select, Typography, Avatar, Tag, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { PhoneFilled, EnvironmentFilled, PlusOutlined } from '@ant-design/icons'; 

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  name: string;
  email: string;
  services: string[];
  status: 'Available' | 'Assigned';
  phone: string;
  location: string;
}

const initialEmployeesData: Employee[] = [
    { id: 1, name: 'Arun Kumar', email: 'arun.k@swachify.com', services: ['Home Cleaning', 'Kitchen', 'Bathroom'], status: 'Available', phone: '+91 98765 11111', location: 'Hyderabad' },
    { id: 2, name: 'Priya Sharma', email: 'priya.s@swachify.com', services: ['Office Cleaning', 'Sofa & Carpet'], status: 'Available', phone: '+91 98765 22222', location: 'Bangalore' },
    { id: 3, name: 'Ravi Singh', email: 'ravi.s@swachify.com', services: ['Pest Control', 'Deep Cleaning'], status: 'Available', phone: '+91 98765 33333', location: 'Hyderabad' },
    { id: 4, name: 'Sunita Devi', email: 'sunita.d@swachify.com', services: ['Kitchen', 'Bathroom'], status: 'Available', phone: '+91 98765 44444', location: 'Delhi' },
    { id: 5, name: 'Anil Mehta', email: 'anil.m@swachify.com', services: ['Painting', 'Home Cleaning'], status: 'Assigned', phone: '+91 98765 55555', location: 'Mumbai' },
    { id: 6, name: 'Geeta Gupta', email: 'geeta.g@swachify.com', services: ['AC Service', 'Appliance Repair'], status: 'Available', phone: '+91 98765 66666', location: 'Bangalore' },
    { id: 7, name: 'Sanjay Verma', email: 'sanjay.v@swachify.com', services: ['Office Cleaning', 'Deep Cleaning'], status: 'Available', phone: '+91 98765 77777', location: 'Delhi' },
    { id: 8, name: 'Meena Kumari', email: 'meena.k@swachify.com', services: ['Sofa & Carpet', 'Home Cleaning'], status: 'Assigned', phone: '+91 98765 88888', location: 'Mumbai' },
];

const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
const allServices = [
  'Home Cleaning', 'Kitchen', 'Bathroom', 'Office Cleaning', 'Sofa & Carpet', 'Pest Control', 'Deep Cleaning', 'Painting', 'AC Service', 'Appliance Repair'
];

const LocationPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);


const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => (
    <Card
        hoverable
        style={{
            borderRadius: '16px',
            border: '2px solid #dcfce7',
            height: '100%',
            transition: 'all 0.3s ease',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Avatar size={64} style={{ backgroundColor: '#14b8a6', fontSize: 24 }}>
                {employee.name.charAt(0)}
            </Avatar>
            <div>
                <Title level={5} style={{ margin: 0 }}>{employee.name}</Title>
                <Tag
                    color={employee.status === 'Available' ? 'success' : 'warning'}
                    style={{ marginTop: 4 }}
                >
                    {employee.status}
                </Tag>
            </div>
        </div>
        
        <Divider style={{ margin: '12px 0' }}/>

        <div>
            <Text strong>Specialties:</Text>
            <div style={{ marginTop: 4, marginBottom: 12 }}>
                {employee.services.slice(0, 2).map(service => (
                    <Text key={service} style={{ color: '#0d9488', display: 'block' }}>{service}</Text>
                ))}
            </div>
            <Paragraph style={{ margin: 0, color: '#6b7280' }}>
                <EnvironmentFilled style={{ marginRight: 8, color: '#ef4444' }} /> {employee.location}
            </Paragraph>
            <Paragraph style={{ margin: 0, color: '#6b7280' }}>
                <PhoneFilled style={{ marginRight: 8, color: '#ef4444' }} /> {employee.phone}
            </Paragraph>
        </div>
    </Card>
);

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeesData);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let employeesToFilter = employees;
    if (locationFilter !== 'All Locations') {
      employeesToFilter = employees.filter(emp => emp.location === locationFilter);
    }
    setFilteredEmployees(employeesToFilter);
  }, [locationFilter, employees]);

  const showModal = () => setIsModalVisible(true);
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
    setEmployees(prev => [newEmployee, ...prev]);
    message.success('Employee added successfully!');
    handleCancel();
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
                        style={{ width: 180 }}
                        onChange={setLocationFilter}
                        options={locationOptions} 
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Add Employee
                    </Button>
                </Space>
            </Col>
        </Row>

        <div className="scrollable-grid" style={{ flex: 1, overflowY: 'auto' }}>
            <Row gutter={[24, 24]}>
                {filteredEmployees.map(employee => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={employee.id}>
                        <EmployeeCard employee={employee} />
                    </Col>
                ))}
            </Row>
        </div>

        <Modal
            title="Add New Employee"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>Add Employee</Button>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                    <Input placeholder="Enter full name"/>
                </Form.Item>
                 <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="Enter email address"/>
                </Form.Item>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                    <Input placeholder="Enter phone number" />
                </Form.Item>
                <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                    <Select options={locations.map(loc => ({ label: loc, value: loc }))} placeholder="Select location"/>
                </Form.Item>
                <Form.Item name="services" label="Services" rules={[{ required: true }]}>
                    <Select mode="multiple" allowClear options={allServices.map(s => ({ label: s, value: s }))} placeholder="Select services"/>
                </Form.Item>
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