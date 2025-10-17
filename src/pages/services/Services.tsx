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
} from 'antd';
import { 
    ArrowLeftOutlined,
    UserOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    MailOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import cleaningImg from '../../assets/cleaning.jpg';
import electricianImg from '../../assets/electrician.jpeg';
import paintingImg from '../../assets/painting.png';
import acRepairImg from '../../assets/ac-repair.jpg';

import bedroomCleaningImg from '../../assets/images1/cleaning&pest control/bedroom-cleaning.jpg';
import bathroomCleaningImg from '../../assets/images1/cleaning&pest control/bathroom cleaning.jpeg';
import kitchenCleaningImg from '../../assets/images1/cleaning&pest control/kitchen cleaning.jpg';
import livingAreaCleaningImg from '../../assets/images1/cleaning&pest control/living area cleaning.jpg';
import sofaCleaningImg from '../../assets/images1/cleaning&pest control/sofa cleaning.jpg';
import pestControlImg from '../../assets/images1/cleaning&pest control/pest control.jpg';

import socketImg from '../../assets/images1/electrician/socket.jpg';
import fanImg from '../../assets/images1/electrician/fan.jpg';
import wiringImg from '../../assets/images1/electrician/wiring.jpg';
import bathFittingImg from '../../assets/images1/electrician/bath.jpg';
import sinkImg from '../../assets/images1/electrician/sink.jpg';
import carpenterImg from '../../assets/images1/electrician/carpenter.jpg';

import housePaintingImg from '../../assets/images1/painting/house.jpeg';
import roomPaintingImg from '../../assets/images1/painting/room.png';
import exteriorPaintingImg from '../../assets/images1/painting/exterior.png';
import waterproofingImg from '../../assets/images1/painting/waterproof.webp';

import acServiceImg from '../../assets/images1/AC/ac_repair.jpg';
import fridgeRepairImg from '../../assets/images1/AC/fridge.jpg';
import washingMachineRepairImg from '../../assets/images1/AC/washin.jpeg';
import microwaveRepairImg from '../../assets/images1/AC/oven.jpg';

// import swachifyGif from '../../assets/SWACHIFY_gif.gif';


const { Title, Text, Paragraph } = Typography;

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

interface HistoryState {
    view: string;
    data: Record<string, any>;
}

interface BookingFormViewProps {
    navigateTo: NavigateToFn;
    goBack: GoBackFn;
    bookingDetails: {
        category?: string;
        subCategory: string;
        plan: string;
    };
}


const servicesData: Record<string, Service[]> = {
  main: [
    { id: 'cleaning', title: 'Cleaning & Pest Control', img: cleaningImg },
    { id: 'electrician', title: 'Electrician, Plumber & Carpenter', img: electricianImg },
    { id: 'painting', title: 'Painting & Waterproofing', img: paintingImg },
    { id: 'ac', title: 'AC & Appliances', img: acRepairImg },
  ],
  cleaning: [
    { id: 'bedroom', title: 'Bedroom', img: bedroomCleaningImg },
    { id: 'bathroom', title: 'Bathroom', img: bathroomCleaningImg },
    { id: 'kitchen', title: 'Kitchen', img: kitchenCleaningImg },
    { id: 'living', title: 'Living Area', img: livingAreaCleaningImg },
    { id: 'sofa', title: 'Sofa & Carpet', img: sofaCleaningImg },
    { id: 'pest', title: 'Pest Control', img: pestControlImg },
  ],
  electrician: [
      { id: 'sockets', title: 'Switch & Sockets', img: socketImg },
      { id: 'fan', title: 'Fan', img: fanImg },
      { id: 'wiring', title: 'Wiring', img: wiringImg },
      { id: 'bath', title: 'Bath Fitting', img: bathFittingImg },
      { id: 'sink', title: 'Sink & Basin', img: sinkImg },
      { id: 'carpenter', title: 'Carpenter', img: carpenterImg },
  ],
  painting: [
      { id: 'full-house', title: 'Full House Painting', img: housePaintingImg },
      { id: 'room', title: 'Room Painting', img: roomPaintingImg },
      { id: 'exterior', title: 'Exterior Painting', img: exteriorPaintingImg },
      { id: 'waterproofing', title: 'Waterproofing', img: waterproofingImg },
  ],
  ac: [
      { id: 'ac-repair', title: 'AC Service & Repair', img: acServiceImg },
      { id: 'fridge', title: 'Refrigerator Repair', img: fridgeRepairImg },
      { id: 'washing-machine', title: 'Washing Machine Repair', img: washingMachineRepairImg },
      { id: 'microwave', title: 'Microwave Repair', img: microwaveRepairImg },
  ]
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
    ]
};



const BookingFormView: React.FC<BookingFormViewProps> = ({ navigateTo, goBack, bookingDetails }) => {
    const [form] = Form.useForm();
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

    const onFinish = (values: any) => {
        if (!selectedTime) {
            message.error('Please select a time slot!');
            return;
        }

        message.success('Booking placed successfully!');

        const newBooking = {
            id: Date.now(),
            service: `${bookingDetails.category} - ${bookingDetails.subCategory} (${bookingDetails.plan})`,
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            time: selectedTime
        };
        console.log("New Booking:", newBooking);

        navigateTo('acknowledgement');
    };

    const timeSlots = ["9am - 11am", "11am - 1pm", "1pm - 3pm", "3pm - 5pm"];

   return (
  <div
    style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',      
    justifyContent: 'center',
    background: 'transparent',
    padding: 0,
  }}
  >
    <Card
      bordered={false}
      style={{
        width: 'min(100%, 980px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        borderRadius: 16,
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Row align="middle" wrap={false} gutter={12} style={{ marginBottom: 8 }}>
        <Col flex="32px">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={goBack}
            aria-label="Go back"
          />
        </Col>
        <Col flex="auto">
          <Title level={4} style={{ margin: 0 }}>Booking details</Title>
          
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 8 }}
        requiredMark={false}
      >
        <Row gutter={16} wrap={false}>
          <Col flex="1 1 0" style={{ minWidth: 0 }}>
            <Card
              size="small"
              // bordered
              style={{ height: '100%', borderRadius: 12 }}
              bodyStyle={{ padding: 14 }}
            >
              <Title level={5} style={{ marginTop: 0 }}>Your information</Title>

              <Form.Item
                name="name"
                label="Full name"
                rules={[{ required: true, message: 'Enter your full name' }]}
                style={{ marginBottom: 10 }}
              >
                <Input prefix={<UserOutlined />} placeholder="e.g., Jane Doe" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: 'Enter your phone number' },
                  { pattern: /^[0-9+\-\s]{8,}$/, message: 'Enter a valid phone' },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+91 98765 43210" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Enter a valid email' },
                  { required: true, message: 'Enter your email' },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input prefix={<MailOutlined />} placeholder="name@example.com" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Enter your address' }]}
                style={{ marginBottom: 0 }}
              >
                <Input.TextArea rows={3} placeholder="Flat, street, landmark" />
              </Form.Item>
            </Card>
          </Col>

          {/* Right column - Scheduling */}
          <Col flex="1 1 0" style={{ minWidth: 0 }}>
            <Card
              size="small"
              bordered
              style={{ height: '100%', borderRadius: 12 }}
              bodyStyle={{ padding: 14 }}
            >
              <Title level={5} style={{ marginTop: 0 }}>Scheduling</Title>

              <Form.Item
                name="date"
                label="Preferred date"
                rules={[{ required: true, message: 'Pick a date' }]}
                style={{ marginBottom: 12 }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(d: Dayjs) => d && !d.isAfter(dayjs().subtract(1, 'day').endOf('day'))}
                />
              </Form.Item>

              <Form.Item
                label="Preferred time"
                required
                validateStatus={!selectedTime ? 'error' : undefined}
                help={!selectedTime ? 'Select a time slot' : undefined}
                style={{ marginBottom: 14 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {timeSlots.map((time) => {
                    const active = selectedTime === time;
                    return (
                      <Button
                        key={time}
                        icon={<ClockCircleOutlined />}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          height: 40,
                          justifyContent: 'flex-start',
                          borderColor: active ? '#14b8a6' : '#d9d9d9',
                          color: active ? '#14b8a6' : 'inherit',
                          background: active ? 'rgba(20,184,166,0.08)' : 'white',
                        }}
                        block
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </Form.Item>

              <div
                style={{
                  padding: 12,
                  border: '1px dashed #e6f4f2',
                  borderRadius: 10,
                  background: '#f6fffc',
                  color: '#14665b',
                  marginBottom: 12,
                }}
              >
                <Text>
                  {`${bookingDetails?.category || ''} ${bookingDetails?.subCategory ? '• ' + bookingDetails.subCategory : ''} ${bookingDetails?.plan ? '• ' + bookingDetails.plan : ''}`.trim()}
                </Text>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 44, background: '#14b8a6', borderColor: '#14b8a6' }}
              >
                Confirm & place order
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
);

};


const MainView: React.FC<ViewProps> = ({ navigateTo }) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
    <div>
        <Title level={2} style={{ marginBottom: 24 }}>What are you looking for?</Title>
        <Row gutter={[24, 24]}>
            {servicesData.main.map(service => (
                <Col xs={24} sm={12} md={12} lg={6} key={service.id}>
                    <Card
                        hoverable
                        onMouseEnter={() => setHoveredId(service.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                            border: hoveredId === service.id ? '2px solid #14b8a6' : '1px solid #e8e8e8',
                            transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                            transform: hoveredId === service.id ? 'translateY(-5px)' : 'translateY(0)',
                            boxShadow: hoveredId === service.id ? '0 8px 24px rgba(0, 0, 0, 0.1)' : 'none',
                        }}
                        cover={<img alt={service.title} src={service.img} style={{ height: 160, objectFit: 'cover' }} />}
                        onClick={() => navigateTo(`sub-services-${service.id}`, { category: service.title })}
                    >
                        <Card.Meta title={service.title} />
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
    );
};

const SubServicesView: React.FC<SubServicesViewProps> = ({ navigateTo, goBack, category }) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const subServicesKey = category.split(/[\s,&]+/)[0].toLowerCase();
    const subServices = servicesData[subServicesKey] || [];
    
    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack} style={{ marginBottom: 16 }}>Back</Button>
            <Title level={2} style={{ marginBottom: 8 }}>{category}</Title>
            <Row gutter={[16, 16]}>
                {subServices.map((sub: Service) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={sub.id}>
                        <Card
                            hoverable
                            onMouseEnter={() => setHoveredId(sub.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                border: hoveredId === sub.id ? '2px solid #14b8a6' : '1px solid #e8e8e8',
                                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                                transform: hoveredId === sub.id ? 'translateY(-5px)' : 'translateY(0)',
                                boxShadow: hoveredId === sub.id ? '0 8px 24px rgba(0, 0, 0, 0.1)' : 'none',
                            }}
                            cover={<img alt={sub.title} src={sub.img} style={{ height: 120, objectFit: 'cover' }} />}
                            onClick={() => navigateTo(sub.id === 'bedroom' ? 'pricing-bedroom' : 'pricing-generic', { subCategory: sub.title })}
                        >
                            <Card.Meta title={sub.title} style={{ textAlign: 'center' }}/>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

const PricingView: React.FC<PricingViewProps> = ({ navigateTo, goBack, type, subCategory }) => {
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const plans = pricingData[type === 'pricing-bedroom' ? 'bedroom' : 'generic'];

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack} style={{ marginBottom: 16 }}>Back</Button>
            <Title level={2} style={{ marginBottom: 8 }}>{subCategory} Plans</Title>
            <Row gutter={[24, 24]}>
                {plans.map(plan => (
                    <Col xs={24} md={8} key={plan.plan}>
                        <Card
                            hoverable
                            onMouseEnter={() => setHoveredPlan(plan.plan)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            style={{
                                transition: 'all 0.3s ease',
                                border: plan.popular || hoveredPlan === plan.plan ? '2px solid #14b8a6' : '1px solid #e8e8e8',
                                transform: hoveredPlan === plan.plan ? 'translateY(-5px)' : 'translateY(0)',
                                boxShadow: hoveredPlan === plan.plan ? '0 8px 24px rgba(0, 0, 0, 0.1)' : 'none',
                            }}
                        >
                            {plan.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#14b8a6', color: 'white', padding: '2px 12px', borderRadius: 16, fontSize: 12, fontWeight: 'bold' }}>Popular</div>}
                            <Title level={4}>{plan.plan}</Title>
                            <Title level={2} style={{ margin: '16px 0' }}>${plan.price}<Text type="secondary" style={{fontSize: 16}}>/visit</Text></Title>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                                {plan.features.map(feat => <li key={feat} style={{ marginBottom: 8 }}>✅ {feat}</li>)}
                            </ul>
                            <Button type="primary" block onClick={() => navigateTo('booking-form', { plan: plan.plan })} style={{ backgroundColor: '#14b8a6' }}>
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
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#dcfce7', margin: '0 auto 24px' }}>
            <span style={{ fontSize: 40, color: '#22c55e' }}>✓</span>
        </div>
        <Title level={2}>Order Placed Successfully!</Title>
        <Paragraph type="secondary" style={{ maxWidth: 400, margin: '16px auto 32px' }}>
            Thank you for your order. Our team will contact you shortly to confirm the details of your appointment.
        </Paragraph>
        <Button type="primary" onClick={() => navigateTo('main')}>Back to Home</Button>
    </div>
);


// --- MAIN COMPONENT ---
const Services: React.FC = () => {
    const [history, setHistory] = useState<HistoryState[]>([{ view: 'main', data: {} }]);
    const currentStep = history[history.length - 1];

    const navigateTo: NavigateToFn = (view, data) => {
        setHistory(prev => [...prev, { view, data: { ...currentStep.data, ...data } }]);
    };

    const goBack: GoBackFn = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };
    
    const renderView = () => {
        switch (currentStep.view) {
            case 'main':
                return <MainView navigateTo={navigateTo} />;
            case 'sub-services-cleaning':
            case 'sub-services-electrician':
            case 'sub-services-painting':
            case 'sub-services-ac':
                return <SubServicesView navigateTo={navigateTo} goBack={goBack} category={currentStep.data.category} />;
            case 'pricing-bedroom':
            case 'pricing-generic':
                return <PricingView navigateTo={navigateTo} goBack={goBack} type={currentStep.view} subCategory={currentStep.data.subCategory} />;
            case 'booking-form':return (<BookingFormView
                                         navigateTo={navigateTo}
                                         goBack={goBack}
                                         bookingDetails={currentStep.data as { category?: string; subCategory: string; plan: string }}
                                             />);

            case 'acknowledgement':
                return <AcknowledgementView navigateTo={navigateTo} />;
            default:
                return <MainView navigateTo={navigateTo} />;
        }
    };

    return (
        <div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            {renderView()}
        </div>
    );
};

export default Services;

