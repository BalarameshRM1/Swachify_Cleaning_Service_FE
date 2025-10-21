import React, { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';
import { Card, Col, Row, Select, Typography, Avatar, Tag, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { PhoneFilled, EnvironmentFilled, PlusOutlined } from '@ant-design/icons'; 
import { getAllUsers } from "../../app/services/auth";

const { Title, Text, Paragraph } = Typography;

interface Employee {
  id: number;
  name: string;
  email: string;
  services?: string[];
  status: 'Available' | 'Assigned';
  phone?: string;
  location?: string;
}

const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
const allServices = [
  'Home Cleaning', 'Kitchen', 'Bathroom', 'Office Cleaning', 'Sofa & Carpet', 'Pest Control', 'Deep Cleaning', 'Painting', 'AC Service', 'Appliance Repair'
];
const roles = ['Employee','Admin','Super Admin'];

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
  <Avatar
    size={64}
    style={{ backgroundColor: '#14b8a6', fontSize: 24 }}
  >
    {employee.name?.charAt(0) || '?'}
  </Avatar>

  <div style={{ maxWidth: 70 }}> 
    <Title
      level={5}
      style={{
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      title={employee.name} 
    >
      {employee.name || 'Unknown'}
    </Title>

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
                {(employee.services || []).slice(0, 2).map(service => (
                    <Text key={service} style={{ color: '#0d9488', display: 'block' }}>{service}</Text>
                ))}
            </div>
            <Paragraph style={{ margin: 0, color: '#6b7280' }}>
                <EnvironmentFilled style={{ marginRight: 8, color: '#ef4444' }} /> {employee.location || 'N/A'}
            </Paragraph>
            <Paragraph style={{ margin: 0, color: '#6b7280' }}>
                <PhoneFilled style={{ marginRight: 8, color: '#ef4444' }} /> {employee.phone || 'N/A'}
            </Paragraph>
        </div>
    </Card>
);

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch employees from backend
  const getAllUsersApi = async () => {
    try {
      const res = await getAllUsers();
      if (!res) return;
      const usersWithFullName: Employee[] = res.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Unknown',
        email: emp.email || '',
        services: emp.services || [],
        status: emp.status || 'Available',
        phone: emp.mobile || 'N/A',
        location: emp.location || 'N/A'
      }));
      setEmployees(usersWithFullName);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    getAllUsersApi();
  }, []);

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
      name: values.name,
      email: values.email,
      phone: values.phone,
      location: values.location,
      services: values.services,
      status: 'Available',
    };
    setEmployees(prev => [newEmployee, ...prev]);
    message.success('Employee added successfully!');
    handleCancel();
  };
  
  const locationOptions: SelectProps['options'] = [
    { value: 'All Locations', label: 'All Locations' },
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
                    <Button style={{color:' rgb(20, 184, 166);'}} icon={<PlusOutlined />} onClick={showModal}>
                        Add Employee
                    </Button>
                </Space>
            </Col>
        </Row>

        <div className="scrollable-grid" style={{ flex: 1, overflowY: 'auto' }}>
            <Row gutter={[24, 24]}>
                {filteredEmployees.map(emp => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={emp.id}>
                        <EmployeeCard employee={emp} />
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
                <Button key="submit" style={{color:' rgb(20, 184, 166);'}}  onClick={() => form.submit()}>Add Employee</Button>
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
                <Form.Item name="roles" label="Role" rules={[{ required: true }]}>
                    <Select mode="multiple" allowClear options={roles.map(r => ({ label: r, value: r }))} placeholder="Select Role"/>
                </Form.Item>
            </Form>
        </Modal>

        <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .ant-card-hoverable:hover { border-color: #14b8a6 !important; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
            .scrollable-grid::-webkit-scrollbar { display: none; }
            .scrollable-grid { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
    </div>
  );
};

export default Employees;
