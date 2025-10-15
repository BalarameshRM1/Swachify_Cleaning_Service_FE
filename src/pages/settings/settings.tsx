import React from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  Switch,
  Tabs,
  message,
  Upload,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BellOutlined,
  ShopOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
//import { Color } from 'antd/es/color-picker';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProfileSettings: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Profile settings saved:', values);
    message.success('Profile updated successfully!');
  };

  return (
    <Card>
      <Row gutter={[32, 16]} align="middle">
        <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src="https://placehold.co/100x100/14b8a6/FFFFFF?text=A"
          />
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
              Change Photo
            </Button>
          </Upload>
        </Col>
        <Col xs={24} sm={18}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ name: 'Admin User', email: 'admin@swachify.com' }}
          >
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>
            <Form.Item name="password" label="New Password">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Leave blank to keep current password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ backgroundColor: '#14b8a6', borderColor: '#14b8a6' }}
              >
                Save Profile
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <Card>
      <Title level={4} style={{ marginBottom: 24 }}>
        Notification Settings
      </Title>
      <Form layout="vertical">
        <Form.Item
          label="New Booking Alerts"
          help="Get notified when a new service is booked."
        >
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item
          label="Ticket Status Updates"
          help="Receive alerts when a ticket's status changes."
        >
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item
          label="Employee Assignments"
          help="Get notified when an employee is assigned to a booking."
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Weekly Summary"
          help="Receive a summary of your business activity every week."
        >
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Card>
  );
};

const BusinessSettings: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Business settings saved:', values);
    message.success('Business information updated successfully!');
  };

  return (
    <Card>
      <Title level={4} style={{ marginBottom: 24 }}>
        Business Information
      </Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          businessName: 'Swachify Cleaning Services',
          supportEmail: 'support@swachify.com',
        }}
      >
        <Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}>
          <Input placeholder="Your Business Name" />
        </Form.Item>
        <Form.Item
          name="supportEmail"
          label="Support Email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input placeholder="customer.support@example.com" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ backgroundColor: '#14b8a6', borderColor: '#14b8a6' }}
          >
            Save Business Info
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const Settings: React.FC = () => {
  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Settings
      </Title>
      <Tabs defaultActiveKey="1" tabPosition="left" className="custom-tabs">
        <TabPane
          tab={
            <span style={{ color: '#14b8a6' }}>
              <UserOutlined />
              Profile
            </span>
          }
          key="1"
        >
          <ProfileSettings />
        </TabPane>
        <TabPane
          tab={
            <span style={{ color: '#14b8a6' }}>
  <BellOutlined />
  Notifications
</span>

          }
          key="2"
        >
          <NotificationSettings />
        </TabPane>
        <TabPane
          tab={
            <span style={{ color: '#14b8a6' }}>
              <ShopOutlined />
              Business
            </span>
          }
          key="3"
        >
          <BusinessSettings />
        </TabPane>
      </Tabs>

      <style>{`
        
        .custom-tabs.ant-tabs-vertical > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
          color: #14b8a6 !important;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background-color: #14b8a6 !important;
        }

        
        .custom-tabs.ant-tabs-vertical > .ant-tabs-nav .ant-tabs-tab:hover {
          color: #14b8a6 !important;
          cursor: pointer;
          background-color: transparent !important;
          box-shadow: none !important;
        }

        .custom-tabs.ant-tabs-vertical > .ant-tabs-nav .ant-tabs-tab:hover svg {
          color: #14b8a6 !important;
          fill: #14b8a6 !important;
        }

        
        .ant-switch-checked {
          background-color: #14b8a6 !important;
          border-color: #14b8a6 !important;
        }

  
        .ant-btn-primary:hover,
        .ant-btn-primary:focus {
          background-color: #0f807c !important;
          border-color: #0f807c !important;
        }

        
        .ant-input:hover, 
        .ant-input:focus, 
        .ant-input-focused,
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #14b8a6 !important;
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
          outline: none !important;
        }

        
        .ant-input-password:hover,
        .ant-input-password:focus,
        .ant-input-password-focused {
          border-color: #14b8a6 !important;
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
};

export default Settings;
