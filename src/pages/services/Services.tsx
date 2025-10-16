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

import acServiceImg from '../../assets/images1/AC/ac repair.jpg';
import fridgeRepairImg from '../../assets/images1/AC/fridge.jpg';
import washingMachineRepairImg from '../../assets/images1/AC/washin.jpeg';
import microwaveRepairImg from '../../assets/images1/AC/oven.jpg';

import swachifyGif from '../../assets/SWACHIFY gif.gif';


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
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack} style={{ marginBottom: 16 }}>Back</Button>
            <Title level={2} style={{ marginBottom: 8 }}>Booking Details</Title>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={14} style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', paddingRight: '24px' }}>
                    <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                        <Title level={4}>Your Information</Title>
                        <Form.Item name="name" rules={[{ required: true, message: 'Please enter your full name!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Full Name" />
                        </Form.Item>
                        <Form.Item name="phone" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                        </Form.Item>
                        <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>    
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
                            <Input.TextArea rows={3} placeholder="Full Address" />
                        </Form.Item>

                        <Title level={4} style={{ marginTop: 32 }}>Scheduling</Title>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
                                    <DatePicker style={{ width: '100%' }} format="MMMM D, YYYY" placeholder="Select Date" suffixIcon={<CalendarOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={<><ClockCircleOutlined /> Preferred Time</>} required>
                                    <Row gutter={[8, 8]}>
                                        {timeSlots.map(time => (
                                            <Col span={12} key={time}>
                                                <Button
                                                    block
                                                    type={selectedTime === time ? 'primary' : 'default'}
                                                    onClick={() => setSelectedTime(time)}
                                                    style={selectedTime === time ? { backgroundColor: '#14b8a6', borderColor: '#14b8a6', color: 'white' } : {}}
                                                >
                                                    {time}
                                                </Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item style={{ marginTop: 16 }}>
                            <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#14b8a6', height: 50, fontSize: 18 }}>
                                Confirm & Place Order
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={0} lg={10}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdfa, #f0f9ff)',
                        borderRadius: 16,
                        padding: 32,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'sticky',
                        top: 20
                    }}>
                         <img src={swachifyGif} alt="Swachify" style={{ width: 96, height: 96, margin: '0 auto 16px' }} />
                        <Title level={4}>You're almost there!</Title>
                        <Paragraph type="secondary">
                            Complete the form to get a sparkling clean space. We guarantee you'll be satisfied with our professional service.
                        </Paragraph>
                    </div>
                </Col>
            </Row>
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
                <Col xs={24} sm={12} lg={6} key={service.id}>
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
                    <Col xs={12} sm={8} lg={6} key={sub.id}>
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

