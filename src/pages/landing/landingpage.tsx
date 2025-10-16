import React, { useState } from 'react';
import { Button, Modal, Form, Input, Checkbox, Tabs, message, Menu, Drawer } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  MenuOutlined,
  StarFilled,
  CheckCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, setUserDetails } from '../../utils/helpers/storage';

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginForm] = Form.useForm();
const [registerForm] = Form.useForm();
const [users, setUsers] = useState<any[]>([]);  // ✅ Added persistent storage
const [currentUser, setCurrentUser] = useState<any>(null);  // ✅ Track logged-in user
const navigate = useNavigate();

  // Storage management
  

  const saveUser = (user: any) => {
  setUsers(prevUsers => [...prevUsers, user]);  // ✅ Properly updates state
};

const findUser = (email: string) => {
  return users.find((u: any) => u.email === email);  // ✅ Reads from actual state
};
  // Auth handlers
 const handleLogin = (values: any) => {
  const user = getUserDetails('registerUser');

  if (user?.email !== values.email) {
    message.error('No account found with this email.');
    return;
  }

  if (user.password !== values.password) {
    message.error('Incorrect password.');
    return;
  }
  setUserDetails('user',user);

  setCurrentUser(user);
  message.success(`Welcome back, ${user.name}!`);

  setTimeout(() => {
    setAuthModalOpen(false);
    loginForm.resetFields();
    navigate('/app/dashboard');  // ✅ Correct way
  }, 1000);
};


  const handleRegister = (values: any) => {
    const existingUser = findUser(values.email.toLowerCase());
    
    if (existingUser) {
      message.error('Account already exists. Please login.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: values.name,
      email: values.email.toLowerCase(),
      phone: values.phone,
      password: values.password,
      role: 'Customer',
      createdAt: new Date().toISOString()
    };

    setUserDetails('registerUser',newUser);

    saveUser(newUser);
    message.success('Account created! Please login to continue.');
    
    setTimeout(() => {
      setActiveTab('login');
      loginForm.setFieldsValue({ email: values.email });
    }, 1500);
    
    registerForm.resetFields();
  };

  const handleForgotPassword = () => {
    const email = loginForm.getFieldValue('email');
    
    if (!email) {
      message.error('Please enter your email first.');
      return;
    }

    const user = findUser(email.toLowerCase());
    if (!user) {
      message.error('No account found with this email.');
      return;
    }

    message.success(`Password reset link sent to ${email}. Check console for demo link.`);
    console.log(`Reset link: https://swachify.com/reset?token=${Date.now()}`);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { key: 'services', label: 'Our Services' },
    { key: 'how-it-works', label: 'How It Works' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'about', label: 'About Us' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'contact', label: 'Contact' },
  ];

  const services = [
    {
      icon: '🏠',
      title: 'Home Deep Cleaning',
      description: 'Thorough cleaning of every corner of your home. Kitchen, bathrooms, living areas, and bedrooms - all spotless.',
      features: ['Kitchen & appliances', 'Bathroom sanitization', 'Floor & carpet cleaning'],
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'
    },
    {
      icon: '🏢',
      title: 'Office Cleaning',
      description: 'Professional workspace cleaning for a productive environment. Daily, weekly, or monthly service available.',
      features: ['Desk & workstation cleaning', 'Common area maintenance', 'Restroom sanitization'],
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    {
      icon: '🪟',
      title: 'Window Cleaning',
      description: 'Crystal clear windows inside and out. Professional equipment for streak-free shine every time.',
      features: ['Interior & exterior glass', 'Frame & sill cleaning', 'High-rise specialists'],
      gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
      icon: '🛋️',
      title: 'Sofa & Carpet Cleaning',
      description: 'Deep cleaning for upholstery and carpets. Remove stains, odors, and allergens with our specialized treatment.',
      features: ['Steam cleaning', 'Stain removal', 'Fabric protection'],
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
    },
    {
      icon: '🏡',
      title: 'Move In/Out Cleaning',
      description: 'Complete cleaning for moving homes. Leave your old place spotless or move into a fresh, clean new home.',
      features: ['Complete house cleaning', 'Cabinet & closet cleaning', 'Same-day service available'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    },
    {
      icon: '✨',
      title: 'Post-Construction Cleaning',
      description: 'Specialized cleaning after renovation or construction. Remove dust, debris, and make it move-in ready.',
      features: ['Dust & debris removal', 'Surface polishing', 'Final touch cleaning'],
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
    }
  ];

  const pricingPlans = [
    {
      name: 'BASIC CLEANING',
      price: '₹499',
      period: '/visit',
      description: 'Perfect for regular maintenance',
      features: [
        'Dusting & vacuuming',
        'Mopping all floors',
        'Kitchen counters cleaning',
        'Bathroom basic cleaning',
        'Up to 1000 sq ft'
      ],
      popular: false
    },
    {
      name: 'DEEP CLEANING',
      price: '₹999',
      period: '/visit',
      description: 'Comprehensive cleaning solution',
      features: [
        'Everything in Basic',
        'Deep kitchen cleaning',
        'Bathroom sanitization',
        'Window & glass cleaning',
        'Up to 2000 sq ft',
        'Appliance cleaning'
      ],
      popular: true
    },
    {
      name: 'PREMIUM PACKAGE',
      price: '₹1,999',
      period: '/visit',
      description: 'Ultimate cleaning experience',
      features: [
        'Everything in Deep',
        'Sofa & carpet cleaning',
        'Balcony & terrace cleaning',
        'Unlimited square footage',
        'Priority scheduling',
        '24/7 support'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Homemaker, Mumbai',
      initial: 'P',
      rating: 5,
      text: 'Absolutely fantastic service! The team was professional, punctual, and my house has never been cleaner. Will definitely book again!',
      color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    {
      name: 'Rahul Verma',
      role: 'Business Owner, Delhi',
      initial: 'R',
      rating: 5,
      text: 'We use Swachify for our office cleaning weekly. They\'re reliable, thorough, and use eco-friendly products. Highly recommend!',
      color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
      name: 'Anjali Patel',
      role: 'Engineer, Bangalore',
      initial: 'A',
      rating: 5,
      text: 'Best cleaning service in the city! They did an amazing job with my post-renovation cleaning. Everything sparkles now!',
      color: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <div
    style={{
      width: 70,
      height: 70,
      borderRadius: 12,
    //   background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden', // 👈 ensures image fits inside rounded box
    }}
  >
    <img
      src="/SWACHIFY gif.gif"
      alt="Swachify Logo"
      style={{
        width: '100%',  // 👈 adjust size as needed
        height: '100%',
        objectFit: 'contain',
      }}
    />
  </div>

  <div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      Swachify
    </div>

    <div
      style={{
        fontSize: 11,
        color: '#64748b',
        display: window.innerWidth > 640 ? 'block' : 'none',
      }}
    >
      Professional Cleaning Services
    </div>
  </div>
</div>


          <div style={{ display: window.innerWidth > 1024 ? 'flex' : 'none', gap: 32, fontSize: 14, fontWeight: 500 }}>
            {menuItems.map(item => (
              <a
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                style={{ color: '#1e293b', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
              }}
            >
              Book Now
            </Button>

            <Button
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ display: window.innerWidth > 1024 ? 'none' : 'flex' }}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        placement="right"
      >
        <Menu mode="vertical" style={{ border: 'none' }}>
          {menuItems.map(item => (
            <Menu.Item key={item.key} onClick={() => scrollToSection(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 50%, #fff 100%)',
        padding: '64px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
            gap: 48,
            alignItems: 'center'
          }}>
            <div style={{ textAlign: window.innerWidth > 1024 ? 'left' : 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 24,
                background: '#ccfbf1',
                border: '1px solid #5eead4',
                color: '#0f766e',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 24
              }}>
                <span>✨</span>
                <span>Trusted by 5,000+ Happy Customers</span>
              </div>

              <h1 style={{
                fontSize: window.innerWidth > 640 ? 56 : 36,
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 24
              }}>
                Sparkling Clean Homes, <span style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Delivered</span>
              </h1>

              <p style={{
                fontSize: window.innerWidth > 640 ? 20 : 18,
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: 32
              }}>
                Professional cleaning services at your doorstep. From deep cleaning to regular maintenance, we make your space shine like new.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth > 640 ? 'row' : 'column',
                gap: 16,
                marginBottom: 32,
                justifyContent: window.innerWidth > 1024 ? 'flex-start' : 'center'
              }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setAuthModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: 12,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '0 32px',
                    boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)'
                  }}
                >
                  Book a Cleaning
                </Button>
                <Button
                  size="large"
                  onClick={() => scrollToSection('services')}
                  style={{
                    borderRadius: 12,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '0 32px',
                    borderWidth: 2
                  }}
                >
                  Our Services
                </Button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
                paddingTop: 32,
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{ textAlign: window.innerWidth > 1024 ? 'left' : 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#14b8a6' }}>5,000+</div>
                  <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Happy Clients</div>
                </div>
                <div style={{ textAlign: window.innerWidth > 1024 ? 'left' : 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#14b8a6' }}>15K+</div>
                  <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Cleanings Done</div>
                </div>
                <div style={{ textAlign: window.innerWidth > 1024 ? 'left' : 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#14b8a6' }}>4.9★</div>
                  <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Avg Rating</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', maxWidth: 512, margin: '0 auto' }}>
              <div style={{
                aspectRatio: '1',
                width: '100%',
                borderRadius: 24,
                background: 'linear-gradient(135deg, #ccfbf1 0%, #cffafe 100%)',
                padding: 32
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  background: '#fff',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 120
                }}>
                   <img
      src="/painting.png"
      alt="Swachify Logo"
      style={{
        width: '100%',  // 👈 adjust size as needed
        height: '100%',
        objectFit: 'contain',
      }}
    />
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: -16,
                right: -16,
                background: '#ffffffff',
                borderRadius: 16,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: 16,
                border: '2px solid #5eead4',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20
                  }}>
                    ✓
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Quick Booking</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>In 60 seconds</div>
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                bottom: -16,
                left: -16,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: 16,
                border: '2px solid #67e8f9',
                animation: 'float 3s ease-in-out infinite 1.5s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20
                  }}>
                    🧹
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Eco-Friendly</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Safe products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 16 }}>
            Our Cleaning Services
          </h2>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 640, margin: '0 auto' }}>
            Comprehensive cleaning solutions tailored to your needs. Choose from our wide range of professional services.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1}, 1fr)`,
          gap: 32
        }}>
          {services.map((service, idx) => (
            <div
              key={idx}
              style={{
                padding: 24,
                borderRadius: 16,
                border: '2px solid #e2e8f0',
                background: '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(13, 148, 136, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: service.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                marginBottom: 16
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{service.title}</h3>
              <p style={{ color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>{service.description}</p>
              <div style={{ marginBottom: 16 }}>
                {service.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#14b8a6' }}>✓</span>
                    <span style={{ fontSize: 14 }}>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                type="link"
                onClick={() => setAuthModalOpen(true)}
                style={{ color: '#14b8a6', fontWeight: 600, padding: 0 }}
              >
                Book Now →
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 100%)',
        padding: '96px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 16 }}>
              How Swachify Works
            </h2>
            <p style={{ fontSize: 18, color: '#64748b' }}>Book your cleaning service in just 3 simple steps</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${window.innerWidth > 768 ? 3 : 1}, 1fr)`,
            gap: window.innerWidth > 1024 ? 48 : 32
          }}>
            {[
              { num: 1, title: 'Choose Your Service', desc: 'Select from our range of cleaning services. Pick the date and time that works best for you.' },
              { num: 2, title: 'We Send Our Team', desc: 'Our verified, trained professionals arrive on time with all necessary equipment and eco-friendly supplies.' },
              { num: 3, title: 'Enjoy Your Clean Space', desc: 'Relax while we work our magic. Pay securely online and enjoy your sparkling clean home or office!' }
            ].map((step) => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 700,
                  margin: '0 auto 24px',
                  boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${window.innerWidth > 1024 ? 4 : window.innerWidth > 640 ? 2 : 1}, 1fr)`,
            gap: 24,
            marginTop: 64
          }}>
            {[
              { icon: '🔒', title: 'Verified Professionals', desc: 'Background-checked cleaning experts' },
              { icon: '🌿', title: 'Eco-Friendly Products', desc: 'Safe for family, pets, and planet' },
              { icon: '💳', title: 'Secure Payment', desc: 'Multiple payment options available' },
              { icon: '⭐', title: 'Quality Guarantee', desc: '100% satisfaction or money back' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
                border: '2px solid #ccfbf1'
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{feature.title}</h4>
                <p style={{ fontSize: 14, color: '#64748b' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 16 }}>
            Transparent Pricing
          </h2>
          <p style={{ fontSize: 18, color: '#64748b' }}>No hidden charges. Pay only for what you need.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${window.innerWidth > 768 ? 3 : 1}, 1fr)`,
          gap: 32
        }}>
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                padding: 32,
                borderRadius: 16,
                border: plan.popular ? '2px solid #14b8a6' : '2px solid #e2e8f0',
                background: plan.popular ? 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)' : '#fff',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 16px',
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#14b8a6', marginBottom: 8 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>
                {plan.price}<span style={{ fontSize: 18, color: '#64748b' }}>{plan.period}</span>
              </div>
              <div style={{ color: '#64748b', marginBottom: 24 }}>{plan.description}</div>
              <div style={{ marginBottom: 32 }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                    <span style={{ color: '#14b8a6', marginTop: 4 }}>✓</span>
                    <span style={{ fontSize: 14 }}>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                type={plan.popular ? 'primary' : 'default'}
                size="large"
                block
                onClick={() => setAuthModalOpen(true)}
                style={{
                  borderRadius: 12,
                  height: 48,
                  fontWeight: 600,
                  ...(plan.popular ? {
                    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                    border: 'none'
                  } : {
                    borderWidth: 2
                  })
                }}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ color: '#64748b', marginBottom: 16 }}>Need a custom quote for commercial spaces?</p>
          <a
            onClick={() => scrollToSection('contact')}
            style={{ color: '#14b8a6', fontWeight: 600, cursor: 'pointer' }}
          >
            Contact us for enterprise pricing →
          </a>
        </div>
      </section>

      {/* About Us */}
      <section id="about" style={{
        background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
        color: '#fff',
        padding: '96px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: 48,
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 24, color: '#fff' }}>
                About Swachify
              </h2>
              <p style={{ fontSize: 18, color: '#ccfbf1', lineHeight: 1.6, marginBottom: 24 }}>
                Founded in 2020, Swachify has been transforming homes and offices across the city with our professional cleaning services. We believe everyone deserves a clean, healthy living space.
              </p>
              <p style={{ color: '#ccfbf1', marginBottom: 24, lineHeight: 1.6 }}>
                Our team of trained professionals uses eco-friendly products and modern equipment to deliver exceptional results. We're not just cleaning - we're creating healthier, happier spaces for our customers.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 24,
                marginBottom: 32
              }}>
                {[
                  { value: '5 Years', label: 'In Business' },
                  { value: '100+', label: 'Cleaning Experts' },
                  { value: '15K+', label: 'Services Completed' },
                  { value: '98%', label: 'Customer Satisfaction' }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 14, color: '#ccfbf1' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                onClick={() => setAuthModalOpen(true)}
                style={{
                  background: '#fff',
                  color: '#14b8a6',
                  borderRadius: 12,
                  height: 48,
                  fontWeight: 600,
                  padding: '0 32px',
                  border: 'none'
                }}
              >
                Join Our Happy Customers
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🏆', title: 'Award Winning', desc: 'Best Cleaning Service 2023' },
                  { icon: '⚡', title: 'Same Day Service', desc: 'Quick response time' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 16,
                    padding: 24,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                    <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: '#ccfbf1' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                {[
                  { icon: '🌟', title: 'Trained Staff', desc: 'Certified professionals' },
                  { icon: '💯', title: 'Money Back', desc: '100% guarantee' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 16,
                    padding: 24,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                    <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: '#ccfbf1' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 16 }}>
            What Our Customers Say
          </h2>
          <p style={{ fontSize: 18, color: '#64748b' }}>Real reviews from real customers</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${window.innerWidth > 768 ? 3 : 1}, 1fr)`,
          gap: 32
        }}>
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              style={{
                padding: 24,
                borderRadius: 16,
                border: '2px solid #e2e8f0',
                background: '#fff',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ color: '#fbbf24', marginBottom: 16, fontSize: 18 }}>
                {'★'.repeat(testimonial.rating)}
              </div>
              <p style={{ color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                {testimonial.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: testimonial.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18
                }}>
                  {testimonial.initial}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 64,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          opacity: 0.6
        }}>
          {[
            { name: 'Google', rating: '4.9' },
            { name: 'Facebook', rating: '4.8' },
            { name: 'Trustpilot', rating: '4.9' }
          ].map((platform, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 24, color: '#334155' }}>{platform.name}</div>
              <div style={{ color: '#fbbf24', fontSize: 18 }}>★★★★★ {platform.rating}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact/CTA */}
      <section id="contact" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #115e59 100%)',
        color: '#fff',
        padding: '96px 24px'
      }}>
        <div style={{ maxWidth: 896, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: window.innerWidth > 768 ? 40 : 32, fontWeight: 700, marginBottom: 24 }}>
            Ready for a Sparkling Clean Space?
          </h2>
          <p style={{ fontSize: 18, color: '#cbd5e1', marginBottom: 32 }}>
            Book your cleaning service today and experience the Swachify difference. Professional, reliable, and eco-friendly.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 640 ? 'row' : 'column',
            gap: 16,
            justifyContent: 'center',
            marginBottom: 48
          }}>
            <Button
              size="large"
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                color: '#fff',
                borderRadius: 12,
                height: 56,
                fontWeight: 600,
                padding: '0 32px',
                border: 'none'
              }}
            >
              Book a Cleaning Now
            </Button>
            <Button
              size="large"
              icon={<PhoneOutlined />}
              href="tel:+919876543210"
              style={{
                borderRadius: 12,
                height: 56,
                fontWeight: 600,
                padding: '0 32px',
                borderWidth: 2,
                borderColor: '#fff',
                color: '#fff',
                background: 'transparent'
              }}
            >
              Call +91 98765 43210
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${window.innerWidth > 768 ? 3 : 1}, 1fr)`,
            gap: 24,
            paddingTop: 32,
            borderTop: '1px solid #475569'
          }}>
            {[
              { value: '24/7', label: 'Customer Support' },
              { value: 'Same Day', label: 'Service Available' },
              { value: '100%', label: 'Satisfaction Guaranteed' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, color: '#cbd5e1', fontSize: 15, lineHeight: 2 }}>
            <p>
              <MailOutlined /> Email: <a href="mailto:support@swachify.com" style={{ color: '#5eead4' }}>support@swachify.com</a>
            </p>
            <p>
              <EnvironmentOutlined /> Address: 123 Clean Street, Green City, India - 400001
            </p>
            <p>
              <ClockCircleOutlined /> Working Hours: Mon-Sat: 8AM-8PM, Sun: 9AM-6PM
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#cbd5e1', padding: '48px 24px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${window.innerWidth > 768 ? 4 : 2}, 1fr)`,
            gap: 32,
            marginBottom: 32
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16
                }}>
                  🧹
                </div>
                <span style={{ fontWeight: 700, color: '#fff' }}>Swachify</span>
              </div>
              <p style={{ fontSize: 14, color: '#94a3b8' }}>
                Professional cleaning services for homes and offices.
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 12 }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                {['Home Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Sofa Cleaning'].map((item, idx) => (
                  <a key={idx} onClick={() => scrollToSection('services')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 12 }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                {[
                  { label: 'About Us', section: 'about' },
                  { label: 'Reviews', section: 'testimonials' },
                  { label: 'Careers', section: null },
                  { label: 'Contact', section: 'contact' }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    onClick={() => item.section && scrollToSection(item.section)}
                    style={{ color: '#cbd5e1', cursor: 'pointer' }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 12 }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item, idx) => (
                  <a key={idx} href="#" style={{ color: '#cbd5e1' }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: 32,
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexDirection: window.innerWidth > 768 ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            fontSize: 14
          }}>
            <div>© {new Date().getFullYear()} Swachify. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social, idx) => (
                <a key={idx} href="#" style={{ color: '#cbd5e1' }}>
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        open={authModalOpen}
        onCancel={() => setAuthModalOpen(false)}
        footer={null}
        width={480}
        centered
      >
        <div style={{ padding: '24px 0' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Book Your Cleaning</h3>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'login',
                label: 'Login',
                children: (
                  <Form form={loginForm} onFinish={handleLogin} layout="vertical">
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input size="large" placeholder="your@email.com" />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                      <Input.Password size="large" placeholder="Enter password" />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      <Button type="link" onClick={handleForgotPassword} style={{ padding: 0 }}>
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      style={{
                        background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                        border: 'none',
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600
                      }}
                    >
                      Sign In
                    </Button>
                  </Form>
                )
              },
              {
                key: 'register',
                label: 'Register',
                children: (
                  <Form form={registerForm} onFinish={handleRegister} layout="vertical">
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input size="large" placeholder="Your name" />
                    </Form.Item>

                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input size="large" placeholder="your@email.com" />
                    </Form.Item>

                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input size="large" placeholder="+91 98765 43210" />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        { required: true, message: 'Please enter your password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                      ]}
                    >
                      <Input.Password size="large" placeholder="Min 6 characters" />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                        border: 'none',
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600
                      }}
                    >
                      Create Account
                    </Button>
                  </Form>
                )
              }
            ]}
          />

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
            By continuing, you agree to our{' '}
            <a href="#" style={{ color: '#14b8a6' }}>Terms</a> and{' '}
            <a href="#" style={{ color: '#14b8a6' }}>Privacy Policy</a>.
          </p>
        </div>
      </Modal>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default Landing;