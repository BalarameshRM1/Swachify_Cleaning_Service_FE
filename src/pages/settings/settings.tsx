import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
  // Row,
  // Col,
  // Avatar,
  // Upload,
  //Select,
} from 'antd';
import {
  BellOutlined,
  //ShopOutlined,
  LockOutlined,
  //CameraOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  //GlobalOutlined,
  //EnvironmentOutlined,
} from '@ant-design/icons';
//import type { UploadProps } from 'antd';
import './settings.css'; 

const { Title, Text } = Typography;
// const { TextArea } = Input;
// const { Option } = Select;



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
        
      </div>
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
        {/* <BusinessProfile /> */}
        <AccountSecurity />

        
        <div style={{ height: 24 }} />
      </div>

  
    </div>
  );
};

export default Settings;