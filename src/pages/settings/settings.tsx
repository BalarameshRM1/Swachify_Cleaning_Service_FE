import React from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  message,
  Switch,
} from 'antd';

const { Title } = Typography;

const CustomSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked }) => {
  return (
    <Switch
      defaultChecked={defaultChecked}
      style={{
        backgroundColor: defaultChecked ? '#14b8a6' : '#ffffff',
        border: defaultChecked ? 'none' : '1px solid #d9d9d9',
      }}
      onChange={(checked, e) => {
        const target = e.target as HTMLButtonElement;
        target.style.backgroundColor = checked ? '#14b8a6' : '#ffffff';
        target.style.border = checked ? 'none' : '1px solid #d9d9d9';
      }}
    />
  );
};

const NotificationSettings: React.FC = () => {
  const renderRow = (
    label: string,
    help: string,
    defaultChecked: boolean = false
  ) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{label}</div>
        <div style={{ color: '#64748b' }}>{help}</div>
      </div>
      <CustomSwitch defaultChecked={defaultChecked} />
    </div>
  );

  return (
    <Card style={{ marginBottom: 24, borderRadius: 16 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Notification Settings
      </Title>
      {renderRow('New Booking Alerts', 'Get notified when new bookings arrive', true)}
      {renderRow('Ticket Updates', 'Notifications for ticket status changes', true)}
    </Card>
  );
};

const BusinessSettings: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Business settings saved:', values);
    message.success('Business information updated successfully!');
  };

  return (
    <Card style={{ borderRadius: 16 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Business Settings
      </Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          businessName: 'Swachify Cleaning Services',
          supportEmail: 'support@swachify.com',
        }}
      >
        <Form.Item
          name="businessName"
          label="Business Name"
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="supportEmail"
          label="Support Email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </Card>
  );
};

const Settings: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        backgroundColor: '#f9fbfc',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        height: '600px', 
        display: 'flex',
        flexDirection: 'column',
      }}
    >
   
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9fbfc',
          borderBottom: '1px solid #e8e8e8',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Settings
        </Title>
      </div>

      
      <div
        style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        <NotificationSettings />
        <BusinessSettings />
      </div>

     
      <style>{`
        .ant-input:hover,
        .ant-input:focus,
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus,
        .ant-btn:hover,
        .ant-btn:focus {
          border-color: #14b8a6 !important;
          box-shadow: none !important;
        }

        .ant-switch:not(.ant-switch-checked) {
          background-color: #ffffff !important;
          border: 1px solid #d9d9d9 !important;
        }

        .ant-switch-checked {
          background-color: #14b8a6 !important;
        }
      `}</style>
    </div>
  );
};

export default Settings;
