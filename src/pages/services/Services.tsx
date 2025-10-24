import React, { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  message,
  Table,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from "dayjs";
import type { TableProps } from 'antd';

import {
  planDetailsData,
  serviceCategoryMappings,
  planFlagMappings,
  mainServicesData
} from '../../utils/constants/data'; 
import { serviceForm } from '../../app/services/auth'; 
import { getUserDetails } from '../../utils/helpers/storage'; 

const { Title, Text, Paragraph } = Typography;
const BackButton: React.FC<{ onClick: () => void; ariaLabel?: string }> = ({ onClick, ariaLabel = "Go back" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#14b8a6",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease",
      }}
       onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 10px rgba(0,0,0,0.16)";
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLButtonElement).style.transform = "none";
      }}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "none";
      }}
    >
      <ArrowLeftOutlined style={{ fontSize: 16 }} />
    </button>
  );
};


type NavigateToFn = (view: string, data?: Record<string, any>) => void;
type GoBackFn = () => void;

interface ViewProps {
  navigateTo: NavigateToFn;
  goBack?: GoBackFn;
}
interface PlanTableViewProps extends ViewProps {
  category: string;
  goBack: GoBackFn;
}
interface HistoryState {
  view: string;
  data: Record<string, any>;
}
interface BookingFormViewProps {
  navigateTo: NavigateToFn;
  goBack: GoBackFn;
  bookingDetails: {
    category?: string;
    subCategory?: string;
    plan: string;
  };
}
const addOnsData = [
  'Additional hour',
  'Finished basement cleaned',
  'Large appliances interior cleaned (per appliance)',
  'Baseboards, window tracks and ceiling corners',
];

const BookingFormView: React.FC<BookingFormViewProps> = ({ navigateTo, goBack, bookingDetails }) => {
  const [form] = Form.useForm();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState<string>('');

  const timeSlots = ['9am - 11am', '11am - 1pm', '1pm - 3pm', '3pm - 5pm'];

   function parseSlotStart(slot: string) {
    const to24 = (t: string) => {
      const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
      if (!m) return null;
      let h = parseInt(m[1], 10);
      const mm = m[2] ? parseInt(m[2], 10) : 0;
      const ampm = m[3].toLowerCase();
      if (ampm === "pm" && h !== 12) h += 12;
      if (ampm === "am" && h === 12) h = 0;
      return { h, mm };
    };
    const [startLabel] = slot.split("-").map(s => s.trim());
    const start = to24(startLabel);
    return start;
  }

  function canUseSlot(selected: Dayjs | null, slot: string) {
    if (!selected) return false;
    const now = dayjs();
    const start = parseSlotStart(slot);
    if (!start) return false;
    if (selected.startOf("day").isAfter(now.startOf("day"))) return true;
    if (selected.isSame(now, "day")) {
      const slotStart = selected.hour(start.h).minute(start.mm).second(0).millisecond(0);
      return slotStart.isAfter(now);
    }
    return false;
  }


  const slotIdMap: Record<string, number> = {
    '9am - 11am': 1,
    '11am - 1pm': 2,
    '1pm - 3pm': 3,
    '3pm - 5pm': 4,
  };

  const onFinish = async (values: any) => {
    if (!selectedTime) {
      message.error('Please select a time slot!');
      return;
    }

    const preferredDate = values.date?.format('YYYY-MM-DD') || '';
    const user = getUserDetails('user'); //
    const userId = user ? user.id : 0;

    const category = bookingDetails?.category || 'Default';
    const planName = bookingDetails?.plan || 'Regular';

    const mappingInfo = serviceCategoryMappings[category] || serviceCategoryMappings['Default']; //
    const { deptId, serviceId } = mappingInfo;

    const slotId = slotIdMap[selectedTime] || 1;

    const planFlags = planFlagMappings[planName] || planFlagMappings['Regular']; //

    if (!deptId || !serviceId) {
        message.error('Could not determine service category.');
        return;
    }

    try {
      setSubmitting(true);
      await serviceForm( //
        null, deptId, serviceId, slotId, userId, values.name, userId,
        values.email, values.phone, values.address, planName, true, preferredDate,
        planFlags.is_regular, planFlags.is_premium, planFlags.is_ultimate
      );
      message.success('Booking placed successfully!');
      navigateTo('acknowledgement');
    } catch (e: any) {
      console.error("Booking failed:", e);
      message.error(e?.message || 'Failed to place booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: 980, margin: '20px auto', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Row align="middle" wrap={false} style={{ marginBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
        <Col flex="none" style={{ marginRight: 12 }}>
          <BackButton onClick={goBack} ariaLabel="Go back" />
        </Col>
        <Col flex="auto">
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Booking Details</Title>
          <Text type="secondary">
            {bookingDetails?.category ?? 'Service'} {bookingDetails?.plan ? `• ${bookingDetails.plan} Plan` : ''}
          </Text>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ fontWeight: 500}}>Your Information</Title>
            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your full name' }]}>
              <Input size="large" prefix={<UserOutlined style={{color: '#9ca3af'}}/>} placeholder="e.g., Jane Doe" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your 10-digit phone number' },
                { pattern: /^\d{10}$/, message: 'Must be exactly 10 digits' },
              ]}
            >
              <Input
                size="large"
                value={phone}
                placeholder="9876543210"
                inputMode="numeric"
                maxLength={10}
                onChange={(e) => {
                  const only = e.target.value.replace(/\D/g, '');
                  setPhone(only);
                  form.setFieldsValue({ phone: only });
                }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ type: 'email', message: 'Please enter a valid email address' }, { required: true, message: 'Please enter your email' }]}
            >
              <Input size="large" prefix={<MailOutlined style={{color: '#9ca3af'}}/>} placeholder="name@example.com" />
            </Form.Item>
            <Form.Item name="address" label="Full Address" rules={[{ required: true, message: 'Please enter your service address' }]}>
              <Input.TextArea size="large" rows={3} placeholder="Flat/House No., Street Name, Landmark, City, Pincode" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Title level={5} style={{marginBottom: 16, fontWeight: 500}}>Scheduling</Title>
            <Form.Item name="date" label="Preferred Date" rules={[{ required: true, message: 'Please select a service date' }]}>
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                placeholder="Select date"
                disabledDate={(d: Dayjs) => d && !d.isAfter(dayjs().subtract(1, 'day').endOf('day'))}
                value={selectedDate}
                onChange={(d: Dayjs | null) => {
                    if (d) {
                        setSelectedDate(d);
                        if (selectedTime && !canUseSlot(d, selectedTime)) {
                            setSelectedTime(null);
                        }
                        form.setFieldsValue({ date: d });
                    } else {
                        setSelectedDate(null); 
                        setSelectedTime(null);
                        form.setFieldsValue({ date: null });
                    }
                }}
                 inputReadOnly
              />
            </Form.Item>
            <Form.Item label="Preferred Time Slot" required>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {timeSlots.map((slot) => {
                  const enabled = canUseSlot(selectedDate, slot);
                  const isSelected = enabled && selectedTime === slot;
                  return (
                    <Button
                      key={slot}
                      icon={<ClockCircleOutlined />}
                      disabled={!enabled}
                      onClick={() => enabled && setSelectedTime(slot)}
                      type={isSelected ? "primary" : "default"}
                      size="large"
                      style={
                        isSelected
                          ? { background: "#14b8a6", borderColor: "#14b8a6", color: '#fff', fontWeight: 500, boxShadow: '0 2px 6px rgba(20, 184, 166, 0.3)' }
                          : { background: enabled ? "#f0fdfa" : "#f1f5f9",
                              borderColor: enabled ? "#a7f3d0" : "#e5e7eb",
                              color: enabled ? "#0f766e" : "#9ca3af",
                              fontWeight: 500
                            }
                      }
                      title={!enabled && selectedDate ? "This time slot is unavailable today" : undefined}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </div>
               {!selectedTime && <Text type="danger" style={{fontSize: 12, marginTop: 4, display: 'block'}}>Please select a time slot.</Text>}
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={submitting}
                style={{ background: '#0D9488', borderColor: '#0D9488', height: 48, fontWeight: 600 }}
              >
                Confirm & Place Order
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};


const PlanTableView: React.FC<PlanTableViewProps> = ({ navigateTo, goBack, category }) => {
  const categoryData = planDetailsData[category as keyof typeof planDetailsData]; //

  if (!categoryData) {
     return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3} type="danger">Error</Title>
        <Paragraph>Category data not found for "{category}".</Paragraph>
        <Button onClick={goBack} type="primary">Go Back</Button>
      </div>
    );
  }

   const featureColumns: TableProps<any>['columns'] = [
    {
      title: <Text strong style={{ fontSize: 15 }}>Features</Text>,
      dataIndex: 'feature',
      key: 'feature',
      width: '35%',
       render: (text: string) => <Text style={{fontSize: 14}}>{text}</Text>
    },
    ...categoryData.plans.map((plan, idx) => ({
      title: (
        <div style={{ textAlign: 'center', lineHeight: 1.2, padding: '8px 0' }}>
          <Title level={4} style={{ marginBottom: 4, color: '#0f766e' }}>
            {plan.toUpperCase()}
          </Title>
          <div style={{ marginTop: 2 }}>
            <Title level={5} style={{ margin: 0 }}>
              ${categoryData.prices[idx]} <Text type="secondary" style={{fontSize: 12}}>/visit</Text>
            </Title>
          </div>
        </div>
      ),
      key: plan,
      align: 'center' as const,
      render: (_: any, record: { isBookingRow?: boolean; [key: string]: any }) => {
        if (record.isBookingRow) {
          return (
            <Button
              type="primary"
              size="large"
              onClick={() => navigateTo('booking-form', { plan, category })}
              style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', width: '90%', fontWeight: 600 }}
            >
              Book {plan}
            </Button>
          );
        }
        const value = record[plan.toLowerCase()];
        return value === '✓' ? (
          <CheckOutlined style={{ color: '#16a34a', fontSize: '1.4rem' }} />
        ) : value === 'X' ? (
          <CloseOutlined style={{ color: '#dc2626', fontSize: '1.4rem' }} />
        ) : (
           <Text type="secondary">-</Text>
        )
      },
    })),
  ];
   const featureDataSource = categoryData.features.map((feature) => {
    const row: { [key: string]: any } = { key: feature.name, feature: feature.name };
    categoryData.plans.forEach((plan, index) => {
      row[plan.toLowerCase()] = feature.values[index];
    });
    return row;
  });

  const bookingButtonRow: { [key: string]: any } = {
    key: 'booking-buttons',
    feature: null,
    isBookingRow: true,
  };
   categoryData.plans.forEach((plan) => {
     bookingButtonRow[plan.toLowerCase()] = null;
   });

  const finalDataSource = [...featureDataSource, bookingButtonRow];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,}}>
        <BackButton onClick={goBack} ariaLabel="Go back to services" />
        <Title level={2} style={{ margin: 0 }}>
          {category} Cleaning Plans
        </Title>
      </div>
      <div className="scrollable-content" style={{ flex: 1, overflowY: 'auto' }}>
        <Table
          columns={featureColumns}
          dataSource={finalDataSource}
          pagination={false}
          bordered
          size="middle"
          rowClassName={(record) => (record.isBookingRow ? 'booking-row-highlight' : '')}
          style={{marginBottom: 24}}
        />
        <Card title="Available Add-ons (extra charges apply)" bordered={false} style={{ borderRadius: 8, background: '#f8fafc' }}>
          <Row gutter={[16, 16]}>
            {addOnsData.map((addon) => (
              <Col xs={24} sm={12} lg={8} key={addon}>
                <Text>✅ {addon}</Text>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
      <style>
        {`
          .booking-row-highlight .ant-table-cell {
             padding: 12px 16px !important;
             background-color: #f0fdfa;
          }
          .ant-table-thead > tr > th {
            background-color: #f8fafc !important;
            font-weight: 600;
          }
           .ant-table-cell {
             vertical-align: middle;
           }
        `}
      </style>
    </div>
   );
};


const MainView: React.FC<ViewProps> = ({ navigateTo }) => {
   const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
     <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        What are you looking for?
      </Title>
      <Row gutter={[24, 24]}>
        {mainServicesData.map((service) => { 
        const typedService = service as { id: string; title: string; img: string };
          return (
            <Col xs={24} sm={12} lg={6} key={typedService.id}>
              <Card
                hoverable
                onMouseEnter={() => setHoveredId(typedService.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  border: hoveredId === typedService.id ? '2px solid #14b8a6' : '1px solid #e8e8e8',
                  transition: 'all 0.3s',
                  transform: hoveredId === typedService.id ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredId === typedService.id ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
                cover={<img alt={typedService.title} src={typedService.img} style={{ height: 180, objectFit: 'cover' }} />}
                onClick={() => navigateTo(`plan-table`, { category: typedService.title })}
                bodyStyle={{ padding: 16 }}
              >
                <Card.Meta
                   title={<Title level={5} style={{ textAlign: 'center', margin: 0, color: '#115e59' }}>{typedService.title}</Title>}
                 />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
   );
};


const AcknowledgementView: React.FC<ViewProps> = ({ navigateTo }) => (
     <div style={{ textAlign: 'center', padding: '48px 16px' }}>
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        marginBottom: 24,
      }}
    >
      <CheckOutlined style={{ fontSize: 40, color: '#15803d' }} />
    </div>
    <Title level={2} style={{ color: '#115e59', marginBottom: 12 }}>Order Placed Successfully!</Title>
    <Paragraph type="secondary" style={{ maxWidth: 450, margin: '0 auto 32px', fontSize: 15 }}>
      Thank you for your booking! Our team will review the details and contact you shortly via phone or email to confirm your appointment.
    </Paragraph>
    <Button type="primary" size="large" onClick={() => navigateTo('main')} style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', fontWeight: 600 }}>
      Book Another Service
    </Button>
  </div>
);

const Services: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'main', data: {} }]);
  const currentStep = history[history.length - 1];

  const navigateTo: NavigateToFn = (view, data = {}) => {
    const combinedData = { ...currentStep.data, ...data };
    const finalData = view === 'main' ? {} : combinedData;
    setHistory((prev) => [...prev, { view, data: finalData }]);
  };

  const goBack: GoBackFn = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const renderView = () => {
    const { view, data } = currentStep;
    switch (view) {
      case 'main':
        return <MainView navigateTo={navigateTo} />;
      case 'plan-table':
        return <PlanTableView navigateTo={navigateTo} goBack={goBack} category={data.category || 'Unknown'} />;
      case 'booking-form':
        return <BookingFormView navigateTo={navigateTo} goBack={goBack} bookingDetails={{ plan: 'Regular', ...data } as any} />;
      case 'acknowledgement':
        return <AcknowledgementView navigateTo={navigateTo} />;
      default:
        console.warn(`Unknown view: ${view}. Returning to main view.`);
        return <MainView navigateTo={navigateTo} />;
    }
  };

  return (
     <div style={{ height: '100%', fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .ant-card { border-radius: 12px; }
          .scrollable-content::-webkit-scrollbar { display: none; }
          .scrollable-content { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={{ height: '100%', animation: 'fadeIn 0.5s ease-in-out' }}>
        {renderView()}
      </div>
    </div>
  );
};

export default Services;