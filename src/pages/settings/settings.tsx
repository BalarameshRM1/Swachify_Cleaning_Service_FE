
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
  Switch,
  Row,
  Col,
  Avatar,
  Upload,
  Select,
} from 'antd';
import {
  BellOutlined,
  ShopOutlined,
  LockOutlined,
  CameraOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;


const CustomSwitch: React.FC<{ 
  checked?: boolean; 
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}> = ({ checked, onChange, defaultChecked }) => {
  return (
    <Switch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      style={{
        backgroundColor: (checked || defaultChecked) ? '#14b8a6' : '#e5e7eb',
      }}
    />
  );
};


const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newBookings: true,
    ticketUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentAlerts: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    message.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`);
  };

  const renderNotificationRow = (
    key: string,
    icon: React.ReactNode,
    label: string,
    description: string,
    checked: boolean
  ) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#1f2937' }}>{label}</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>{description}</div>
        </div>
      </div>
      <CustomSwitch
        checked={checked}
        onChange={(value) => handleNotificationChange(key, value)}
      />
    </div>
  );

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BellOutlined style={{ fontSize: 24, color: 'white' }} />
        </div>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18, color: '#1f2937' }}>
            Notification Preferences
          </Title>
          <Text style={{ color: '#6b7280', fontSize: 13 }}>
            Manage how you receive notifications
          </Text>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {renderNotificationRow(
          'newBookings',
          <BellOutlined />,
          'New Booking Alerts',
          'Get notified when new bookings arrive',
          notifications.newBookings
        )}
        {renderNotificationRow(
          'ticketUpdates',
          <MailOutlined />,
          'Ticket Updates',
          'Notifications for ticket status changes',
          notifications.ticketUpdates
        )}
        {renderNotificationRow(
          'emailNotifications',
          <MailOutlined />,
          'Email Notifications',
          'Receive updates via email',
          notifications.emailNotifications
        )}
        {renderNotificationRow(
          'smsNotifications',
          <PhoneOutlined />,
          'SMS Notifications',
          'Receive updates via text message',
          notifications.smsNotifications
        )}
        {renderNotificationRow(
          'appointmentReminders',
          <BellOutlined />,
          'Appointment Reminders',
          'Get reminders before scheduled appointments',
          notifications.appointmentReminders
        )}
        {renderNotificationRow(
          'paymentAlerts',
          <BellOutlined />,
          'Payment Alerts',
          'Notifications for payment confirmations',
          notifications.paymentAlerts
        )}
      </div>
    </Card>
  );
};


const BusinessProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Business profile updated:', values);
      message.success('Business profile updated successfully!');
    } catch (error) {
      message.error('Failed to update business profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'logo',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('Logo uploaded successfully');
      }
    },
  };

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShopOutlined style={{ fontSize: 24, color: 'white' }} />
        </div>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18, color: '#1f2937' }}>
            Business Information
          </Title>
          <Text style={{ color: '#6b7280', fontSize: 13 }}>
            Update your business details and branding
          </Text>
        </div>
      </div>

      {/* Logo Upload */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Upload {...uploadProps}>
          <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
            <Avatar
              size={100}
              icon={<ShopOutlined />}
              style={{
                background: '#14b8a6',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '3px solid white',
              }}
            >
              <CameraOutlined style={{ color: 'white', fontSize: 14 }} />
            </div>
          </div>
        </Upload>
        <div style={{ marginTop: 8 }}>
          <Text style={{ color: '#6b7280', fontSize: 13 }}>
            Click to upload business logo
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          businessName: 'Swachify Cleaning Services',
          supportEmail: 'info@swachify.com',
          phone: '+1 (905) 588 2122',
          website: 'www.swachify.com',
          address: '76 King St W,Oshawa,ON L1H 1A6,Canada',
          businessType: 'cleaning',
          description: 'Professional cleaning services for homes and offices',
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="businessName"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Business Name</span>}
              rules={[{ required: true, message: 'Please enter business name' }]}
            >
              <Input
                size="large"
                prefix={<ShopOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Enter business name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="businessType"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Business Type</span>}
              rules={[{ required: true }]}
            >
              <Select size="large" placeholder="Select business type">
                <Option value="cleaning">Cleaning Services</Option>
                <Option value="maintenance">Maintenance</Option>
                <Option value="repair">Repair Services</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="supportEmail"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Support Email</span>}
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                placeholder="support@example.com"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Phone Number</span>}
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                placeholder="+91 XXXXXXXXXX"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Website</span>}
            >
              <Input
                size="large"
                prefix={<GlobalOutlined style={{ color: '#9ca3af' }} />}
                placeholder="www.example.com"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="address"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Business Address</span>}
            >
              <Input
                size="large"
                prefix={<EnvironmentOutlined style={{ color: '#9ca3af' }} />}
                placeholder="City, State, Country"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Business Description</span>}
        >
          <TextArea
            rows={4}
            placeholder="Describe your business and services"
            style={{ resize: 'none' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={<SaveOutlined />}
            block
            style={{
              background: '#14b8a6',
              border: 'none',
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d9488';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#14b8a6';
            }}
          >
            Save Business Information
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};


const AccountSecurity: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password updated:', values);
      message.success('Password updated successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockOutlined style={{ fontSize: 24, color: 'white' }} />
        </div>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18, color: '#1f2937' }}>
            Account Security
          </Title>
          <Text style={{ color: '#6b7280', fontSize: 13 }}>
            Update your password and security settings
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
                name="currentPassword"
                label={<span style={{ fontWeight: 600, color: '#374151' }}>Current Password</span>}
                rules={[ { required: true, message: 'Please enter your current password' },
                {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                message:
        'Password must contain at least 8 characters, including letters and numbers',
              },]}
        >
           <Input.Password
           size="large"
           prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
           placeholder="Enter current password"
          />
       </Form.Item>

       <Form.Item
           name="newPassword"
           label={<span style={{ fontWeight: 600, color: '#374151' }}>New Password</span>}
           dependencies={['currentPassword']}
           rules={[ { required: true, message: 'Please enter a new password' },
          {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
          message:
         'Password must contain at least 8 characters, including letters and numbers',
          },
         ({ getFieldValue }) => ({
         validator(_, value) {
        if (!value || getFieldValue('currentPassword') !== value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error('New password must be different from current password')); },
        }),
        ]}
        >
           <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Enter new password (min 8 chars, letters + numbers)"
          />
       </Form.Item>

       <Form.Item
          name="confirmPassword"
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Confirm New Password</span>}
          dependencies={['newPassword']}
          rules={[ { required: true, message: 'Please confirm password' },
          ({ getFieldValue }) => ({
           validator(_, value) {
          if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match!')); },
        }),
       ]}
        >
        <Input.Password
          size="large"
          prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
          placeholder="Confirm new password"
         />
       </Form.Item>


        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={<SaveOutlined />}
            block
            style={{
              background: '#14b8a6',
              border: 'none',
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d9488';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#14b8a6';
            }}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};


const Settings: React.FC = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px)', 
        overflow: 'auto',
        background: '#f5f5f5',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            padding: '24px',
            marginBottom: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          <Title level={2} style={{ fontWeight: "bold", color: "#0a0b0bff",margin: 0, fontSize: 28,  }}>
            SETTINGS
          </Title>
          <Text style={{ color: '#6b7280', fontSize: 14 }}>
            Manage your account settings and preferences
          </Text>
        </div>

      
        <NotificationSettings />
        <BusinessProfile />
        <AccountSecurity />

        
        <div style={{ height: 24 }} />
      </div>

      
      <style>{`
        .ant-input:hover,
        .ant-input:focus,
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus,
        .ant-input-password:hover,
        .ant-input-password:focus,
        .ant-select:hover .ant-select-selector,
        .ant-select-focused .ant-select-selector {
          border-color: #14b8a6 !important;
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.1) !important;
        }

        .ant-switch:not(.ant-switch-checked) {
          background-color: #e5e7eb !important;
        }

        .ant-switch-checked {
          background-color: #14b8a6 !important;
        }

        .ant-form-item-label > label {
          color: #374151;
          font-size: 14px;
        }

        .ant-card {
          transition: all 0.2s ease;
        }

        .ant-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        }

        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
};

export default Settings;