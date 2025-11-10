import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
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
import './settings.css'; 

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;



const CustomSwitch: React.FC<{ 
  checked?: boolean; 
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}> = ({ checked, onChange, defaultChecked }) => {
  
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  
  const isControlled = checked !== undefined;
  const displayChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label className="custom-switch">
      <input
        type="checkbox"
        className="custom-switch-input"
        checked={displayChecked}
        onChange={handleChange}
      />
      <span className="custom-switch-track">
        <span className="custom-switch-thumb"></span>
      </span>
    </label>
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
    <div className="notification-row">
      <div className="notification-icon-wrapper">
        <div className="notification-icon">
          {icon}
        </div>
        <div>
          <div className="notification-label">{label}</div>
          <div className="notification-description">{description}</div>
        </div>
      </div>
      <CustomSwitch
        checked={checked}
        onChange={(value) => handleNotificationChange(key, value)}
      />
    </div>
  );

  return (
    <Card className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <BellOutlined />
        </div>
        <div>
          <Title level={4} className="settings-card-title">
            Notification Preferences
          </Title>
          <Text className="settings-card-description">
            Manage how you receive notifications
          </Text>
        </div>
      </div>

      <div>
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
    <Card className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <ShopOutlined />
        </div>
        <div>
          <Title level={4} className="settings-card-title">
            Business Information
          </Title>
          <Text className="settings-card-description">
            Update your business details and branding
          </Text>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="avatar-upload-section">
        <Upload {...uploadProps}>
          <div className="avatar-upload-wrapper">
            <Avatar
              size={100}
              icon={<ShopOutlined />}
              style={{ background: '#14b8a6' }}
            />
            <div className="avatar-upload-icon">
              <CameraOutlined />
            </div>
          </div>
        </Upload>
        <div className="avatar-upload-text">
          Click to upload business logo
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
              label={<span className="settings-form-label">Business Name</span>}
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
              label={<span className="settings-form-label">Business Type</span>}
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
              label={<span className="settings-form-label">Support Email</span>}
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
              label={<span className="settings-form-label">Phone Number</span>}
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
              label={<span className="settings-form-label">Website</span>}
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
              label={<span className="settings-form-label">Business Address</span>}
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
          label={<span className="settings-form-label">Business Description</span>}
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
            className="settings-save-button"
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
    <Card className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <LockOutlined />
        </div>
        <div>
          <Title level={4} className="settings-card-title">
            Account Security
          </Title>
          <Text className="settings-card-description">
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
          label={<span className="settings-form-label">Current Password</span>}
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
          label={<span className="settings-form-label">New Password</span>}
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
          label={<span className="settings-form-label">Confirm New Password</span>}
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
            className="settings-save-button"
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
    <div className="settings-page-container">
      <div className="settings-content-wrapper">
        {/* Header */}
        <div className="settings-header">
          <Title level={2} className="settings-page-title">
            SETTINGS
          </Title>
          <Text className="settings-page-description">
            Manage your account settings and preferences
          </Text>
        </div>

      
        <NotificationSettings />
        <BusinessProfile />
        <AccountSecurity />

        
        <div style={{ height: 24 }} />
      </div>

  
    </div>
  );
};

export default Settings;