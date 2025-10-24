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
  CalendarOutlined,
  ClockCircleOutlined,
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from "dayjs";
import type { TableProps } from 'antd';

import kitchenCleaningImg from '../../assets/final_images/kitchen-cleaning.jpg';
import bathroomCleaningImg from '../../assets/final_images/bathroom-cleaning.jpg';
import bedroomCleaningImg from '../../assets/final_images/bedroom-cleaning.jpg';
import livingAreaCleaningImg from '../../assets/final_images/living-area-cleaning.jpg';
import { planDetailsData } from '../../utils/constants/data';
import { serviceForm } from '../../app/services/auth';

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
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 10px rgba(0,0,0,0.16)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLButtonElement).style.transform = "none";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "none";
      }}
    >
      <ArrowLeftOutlined style={{ fontSize: 16 }} />
    </button>
  );
};

interface Service {
  id: string;
  title: string;
  img: string;
}

interface Plan {
  plan: string;
  price: number;
  features: string[];
  popular?: boolean;
}

type NavigateToFn = (view: string, data?: Record<string, any>) => void;
type GoBackFn = () => void;

interface ViewProps {
  navigateTo: NavigateToFn;
  goBack?: GoBackFn;
}
interface SubServicesViewProps extends ViewProps {
  category: string;
  goBack: GoBackFn;
}
interface PricingViewProps extends ViewProps {
  type: string;
  subCategory: string;
  goBack: GoBackFn;
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

const servicesData: Record<string, Service[]> = {
  main: [
    { id: 'cleaning-kitchen', title: 'Kitchen', img: kitchenCleaningImg },
    { id: 'cleaning-bathrooms', title: 'Bathrooms', img: bathroomCleaningImg },
    { id: 'cleaning-bedrooms', title: 'Bedrooms', img: bedroomCleaningImg },
    { id: 'cleaning-living-areas', title: 'Living Areas', img: livingAreaCleaningImg },
  ],
  electrician: [],
  painting: [],
  ac: [],
};

const pricingData: Record<string, Plan[]> = {
  bedroom: [
    { plan: 'Regular', price: 49, features: ['Mopped & Vacuumed', 'Surfaces Dusted'] },
    { plan: 'Premium', price: 79, features: ['Everything in Regular', 'Mirrors Polished'], popular: true },
    { plan: 'Ultimate', price: 109, features: ['Everything in Premium', 'Linens Changed'] },
  ],
  generic: [
    { plan: 'Standard', price: 89, features: ['Basic Service', 'Inspection'] },
    { plan: 'Advanced', price: 129, features: ['Everything in Standard', 'Detailed Cleaning'], popular: true },
    { plan: 'Complete', price: 199, features: ['Everything in Advanced', 'Parts Replacement'] },
  ],
};

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

    try {
      setSubmitting(true);
      await serviceForm(
        'clean',                  
        1,                           
        1,                             
        slotIdMap[selectedTime],      
        17,                          
        values.name,                    
        0,                     
        values.email,            
        values.phone,                
        values.address,              
        bookingDetails?.category || 'Cleaning',
        true,                        
        preferredDate              
      );

      message.success('Booking placed successfully!');
      navigateTo('acknowledgement');
    } catch (e: any) {
      message.error(e?.message || 'Failed to place booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 0, minHeight: '100vh' }}>
      <Card style={{ maxWidth: 980, margin: '0 auto', borderRadius: 16 }}>
        <Row align="middle" wrap={false} style={{ marginBottom: 24 }}>
          <Col flex="none" style={{ marginRight: 10 }}>
            <BackButton onClick={goBack} ariaLabel="Go back" />
          </Col>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>Booking Details</Title>
            <Text type="secondary">
              {bookingDetails?.category ?? ''} {bookingDetails?.plan ? `• ${bookingDetails.plan}` : ''}
            </Text>
          </Col>
        </Row>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Title level={5}>Your Information</Title>

              <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Enter your full name' }]}>
                <Input prefix={<UserOutlined />} placeholder="e.g., Jane Doe" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: 'Enter your phone number' },
                  { pattern: /^\d{10}$/, message: 'Enter exactly 10 digits' },
                ]}
              >
                <Input
                  value={phone}
                  placeholder="9876543210"
                  inputMode="numeric"
                  maxLength={10}
                  onChange={(e) => {
                    const only = e.target.value.replace(/\D/g, '');
                    setPhone(only);
                    form.setFieldsValue({ phone: only });
                  }}
                  onKeyDown={(e) => {
                    const allow = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
                    if (allow.includes(e.key)) return;
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: 'email', message: 'Enter a valid email' }, { required: true, message: 'Enter your email' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="name@example.com" />
              </Form.Item>

              <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Enter your address' }]}>
                <Input.TextArea rows={3} placeholder="Flat, street, landmark" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Title level={5}>Scheduling</Title>

              <Form.Item name="date" label="Preferred date" rules={[{ required: true, message: 'Pick a date' }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(d: Dayjs) => d && !d.isAfter(dayjs().subtract(1, 'day').endOf('day'))}
                  value={selectedDate as any}
                  onChange={(d) => {
                    setSelectedDate(d);
                    if (selectedTime && !canUseSlot(d as Dayjs, selectedTime)) {
                      setSelectedTime(null);
                    }
                    form.setFieldsValue({ date: d });
                  }}
                />
              </Form.Item>

              <Form.Item label="Preferred time" required>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
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
                        style={
                          isSelected
                            ? { background: "#14b8a6", borderColor: "#14b8a6" }
                            : { background: enabled ? "#f2f7f6" : "#f5f5f5", borderColor: enabled ? "#f2f7f6" : "#eee", color: enabled ? "#111" : "#aaa" }
                        }
                        title={!enabled && selectedDate ? "This slot has already started" : undefined}
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={submitting}
                style={{ background: '#14b8a6', borderColor: '#14b8a6' }}
              >
                Confirm & Place Order
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

const PlanTableView: React.FC<PlanTableViewProps> = ({ navigateTo, goBack, category }) => {
  const categoryData = planDetailsData[category as keyof typeof planDetailsData];

  if (!categoryData) {
    return (
      <div>
        Category not found. <Button onClick={goBack}>Go Back</Button>
      </div>
    );
  }

  const featureColumns: TableProps<any>['columns'] = [
    {
      title: <Text strong>Features</Text>,
      dataIndex: 'feature',
      key: 'feature',
      width: '35%',
    },
    ...categoryData.plans.map((plan, idx) => ({
      title: (
        <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
          <Title level={4} style={{ marginBottom: 4 }}>
            {plan}
          </Title>
          <div style={{ marginTop: 2 }}>
            <Title level={5} style={{ margin: 0 }}>
              ${categoryData.prices[idx]} <Text type="secondary"></Text>
            </Title>
          </div>
        </div>
      ),
      key: plan,
      align: 'center' as const,
      render: (_: any, record: any) => {
        if (record.isBookingRow) {
          return (
            <Button
              type="primary"
              size="large"
              onClick={() => navigateTo('booking-form', { plan, category })}
              style={{ backgroundColor: '#14b8a6', width: '100%' }}
            >
              Book {plan}
            </Button>
          );
        }
        const value = record[plan.toLowerCase()];
        return value === '✓' ? (
          <CheckOutlined style={{ color: '#52c41a', fontSize: '1.2rem' }} />
        ) : (
          <CloseOutlined style={{ color: '#eb2f96', fontSize: '1.2rem' }} />
        );
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

  const priceAndBookingRow: { [key: string]: any } = {
    key: 'prices-and-booking',
    feature: <CalendarOutlined style={{ fontSize: '32px', color: '#14b8a6' }} />,
    isBookingRow: true,
  };
  categoryData.plans.forEach((plan, index) => {
    priceAndBookingRow[plan.toLowerCase()] = (
      <div>
        <Title level={3} style={{ margin: 0 }}>
          ${categoryData.prices[index]}
          <Text type="secondary"></Text>
        </Title>
      </div>
    );
  });

  const finalDataSource = [...featureDataSource, priceAndBookingRow];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <BackButton onClick={goBack} ariaLabel="Go back" />
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
          rowClassName={(record) => (record.isBookingRow ? 'booking-row-highlight' : '')}
        />

        <Card title="Available Add-ons (extra charges apply)" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {addOnsData.map((addon) => (
              <Col xs={24} md={12} key={addon}>
                <Text>✅ {addon}</Text>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
      <style>
        {`
          .booking-row-highlight .ant-table-cell {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .booking-row-highlight .ant-table-cell:first-child {
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
        {servicesData.main.map((service) => (
          <Col xs={24} sm={12} lg={6} key={service.id}>
            <Card
              hoverable
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: hoveredId === service.id ? '2px solid #14b8a6' : '1px solid #e8e8e8',
                transition: 'all 0.3s',
                transform: hoveredId === service.id ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredId === service.id ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              cover={<img alt={service.title} src={service.img} style={{ height: 160, objectFit: 'cover' }} />}
              onClick={() => navigateTo(`plan-table`, { category: service.title })}
            >
              <Card.Meta title={<Title level={5} style={{ textAlign: 'center' }}>{service.title}</Title>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const SubServicesView: React.FC<SubServicesViewProps> = ({ goBack, category }) => {
  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={goBack} style={{ marginBottom: 16 }}>
        Back
      </Button>
      <Title level={2}>{category}</Title>
      <Paragraph>Sub-services for {category} would be displayed here.</Paragraph>
    </div>
  );
};

const PricingView: React.FC<PricingViewProps> = ({ navigateTo, goBack, type, subCategory }) => {
  const plans = pricingData[type === 'pricing-bedroom' ? 'bedroom' : 'generic'];

  return (
    <div style={{ padding: 0, minHeight: '100vh' }}>
      <Card style={{ maxWidth: 980, margin: '0 auto', borderRadius: 16 }}>
        <Row align="middle" gutter={12} style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2}>{subCategory} Plans</Title>
          </Col>
          <Col>
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={goBack} />
          </Col>
        </Row>
      </Card>
      <Row gutter={[24, 24]}>
        {plans.map((plan) => (
          <Col xs={24} md={8} key={plan.plan}>
            <Card hoverable>
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#14b8a6',
                    color: 'white',
                    padding: '2px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  Popular
                </div>
              )}
              <Title level={4}>{plan.plan}</Title>
              <Title level={2}>
                ${plan.price}
                <Text type="secondary"></Text>
              </Title>
              <ul>{plan.features.map((feat) => <li key={feat}>✅ {feat}</li>)}</ul>
              <Button
                type="primary"
                block
                onClick={() => navigateTo('booking-form', { plan: plan.plan })}
                style={{ backgroundColor: '#14b8a6' }}
              >
                Book Now
              </Button>
            </Card>
          </Col>
        ))}
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
      <span style={{ fontSize: 40, color: '#22c55e' }}>✓</span>
    </div>
    <Title level={2}>Order Placed Successfully!</Title>
    <Paragraph type="secondary" style={{ maxWidth: 400, margin: '0 auto 32px' }}>
      Thank you for your order. Our team will contact you shortly to confirm the details of your
      appointment.
    </Paragraph>
    <Button type="primary" onClick={() => navigateTo('main')} style={{ backgroundColor: '#14b8a6' }}>
      Back to Home
    </Button>
  </div>
);

const Services: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'main', data: {} }]);
  const currentStep = history[history.length - 1];

  const navigateTo: NavigateToFn = (view, data) => {
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
        return <PlanTableView navigateTo={navigateTo} goBack={goBack} category={data.category} />;
      case 'booking-form':
        return <BookingFormView navigateTo={navigateTo} goBack={goBack} bookingDetails={data as any} />;
      case 'acknowledgement':
        return <AcknowledgementView navigateTo={navigateTo} />;
      default:
        if (view.startsWith('sub-services-')) {
          return <SubServicesView navigateTo={navigateTo} goBack={goBack} category={data.category} />;
        }
        if (view.startsWith('pricing-')) {
          return <PricingView navigateTo={navigateTo} goBack={goBack} type={view} subCategory={data.subCategory} />;
        }
        return <MainView navigateTo={navigateTo} />;
    }
  };

  return (
    <div style={{ height: '100%', fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .ant-card { border-radius: 8px; }

          .scrollable-content::-webkit-scrollbar {
            display: none;
          }
          .scrollable-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div style={{ height: '100%', animation: 'fadeIn 0.5s ease-in-out' }}>{renderView()}</div>
    </div>
  );
};

export default Services;
