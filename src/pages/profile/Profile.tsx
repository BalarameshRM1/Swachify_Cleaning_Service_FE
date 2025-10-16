import React from 'react';
import {
  Row,
  Col,
  Avatar,
  Typography,
  Card,
  Button,
  Form,
  Input,
  Statistic,
  List,
  Upload,
  message,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [form] = Form.useForm();

    const user = {
        name: 'Admin User',
        email: 'admin@swachify.com',
        role: 'Administrator',
        phone: '+91 98765 43210',
        address: '123 Swachify Lane, Clean City, Hyderabad',
        avatar: 'https://placehold.co/128x128/14b8a6/FFFFFF?text=A',
    };

    const stats = [
        { title: 'Total Bookings', value: 42, icon: <CheckCircleOutlined style={{ color: '#10b981' }} /> },
        { title: 'Pending Tasks', value: 3, icon: <ClockCircleOutlined style={{ color: '#f59e0b' }} /> },
        { title: 'Completed Tickets', value: 39, icon: <FileTextOutlined style={{ color: '#3b82f6' }} /> },
    ];

    const recentActivity = [
        'Completed Ticket #12345 for Priya Sharma.',
        'Assigned a new booking for Home Deep Cleaning.',
        'Updated profile picture.',
        'Changed password.',
        'Viewed booking details for Rahul Verma.',
    ];

    const handleEditToggle = () => {
        if (isEditing) {
            form.submit();
        } else {
            form.setFieldsValue(user);
            setIsEditing(true);
        }
    };

    const onFinish = (values: any) => {
        console.log('Updated profile info:', values);
        message.success('Profile updated successfully!');
        setIsEditing(false);
    };


  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <Row gutter={[24, 24]}>
        {/* Profile Header Card */}
        <Col span={24}>
          <Card style={{ borderRadius: '16px' }}>
            <Row align="middle" gutter={[24, 16]}>
              <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                 <Upload showUploadList={false}>
                    <Avatar size={128} src={user.avatar} icon={<UserOutlined />} style={{ cursor: 'pointer', border: '4px solid #14b8a6' }} />
                 </Upload>
              </Col>
              <Col xs={24} md={12}>
                <Title level={2}>{user.name}</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>{user.role}</Text>
              </Col>
              <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                 <Button type="primary" icon={isEditing ? <SaveOutlined /> : <EditOutlined />} onClick={handleEditToggle} style={{ backgroundColor: '#14b8a6' }}>
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                 </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Personal Details Form */}
        <Col xs={24} lg={16}>
          <Card title="Personal Details" style={{ borderRadius: '16px' }}>
            <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
                 <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Full Name">
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="email" label="Email Address">
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="phone" label="Phone Number">
                            <Input prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                     <Col xs={24} sm={12}>
                        <Form.Item name="address" label="Address">
                            <Input prefix={<EnvironmentOutlined />} />
                        </Form.Item>
                    </Col>
                 </Row>
            </Form>
             {!isEditing && (
                <div style={{ padding: '12px 0' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}><Text strong>Full Name:</Text> <Text>{user.name}</Text></Col>
                        <Col xs={24} sm={12}><Text strong>Email:</Text> <Text>{user.email}</Text></Col>
                        <Col xs={24} sm={12}><Text strong>Phone:</Text> <Text>{user.phone}</Text></Col>
                        <Col xs={24} sm={12}><Text strong>Address:</Text> <Text>{user.address}</Text></Col>
                    </Row>
                </div>
             )}
          </Card>
        </Col>

        {/* Stats & Activity */}
        <Col xs={24} lg={8}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card title="Account Stats" style={{ borderRadius: '16px' }}>
                         <Row gutter={16}>
                            {stats.map(stat => (
                                <Col span={8} key={stat.title} style={{textAlign: 'center'}}>
                                    <Statistic title={stat.title} value={stat.value} prefix={stat.icon} />
                                </Col>
                            ))}
                         </Row>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="Recent Activity" style={{ borderRadius: '16px' }} bodyStyle={{ padding: '0 24px 24px' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={recentActivity}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}>{index + 1}</Avatar>}
                                        title={<Text style={{fontSize: '13px'}}>{item}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </Col>

      </Row>
    </div>
  );
};

export default Profile;
