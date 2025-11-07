import "./landingpage.css";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Menu,
  Drawer,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MenuOutlined,
  // StarFilled,
  // CheckCircleOutlined,
  // SafetyOutlined,
  // ThunderboltOutlined,
  // CrownOutlined,
  // TrophyOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../../utils/helpers/storage";
import ServicesImg from "../../assets/service.jpg";
import BrandLogo from "../../assets/SWACHIFY_gif.gif";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "../../app/features/user/userSlice";
import {
  menuItems,
  services,
  pricingPlans,
  testimonials,
} from "../../utils/constants/data.ts";

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab] = useState("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginForm] = Form.useForm();
  //const [loginForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);

  // const [registerForm] = Form.useForm();
  // const [users, setUsers] = useState<any[]>([]);  // ✅ Added persistent storage
  // const [currentUserData, setCurrentUserData] = useState<any>(null);  // ✅ Track logged-in user
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  // const saveUser = (user: any) => {
  //   setUsers(prevUsers => [...prevUsers, user]);  // ✅ Properly updates state
  // };

  // const findUser = (email: string) => {
  //   return users.find((u: any) => u.email === email);  // ✅ Reads from actual state
  // };

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    const lastUsed = localStorage.getItem("lastUsedEmail");

    if (savedUsers.length > 0 && lastUsed) {
      const matchedUser =
        savedUsers.find((u: any) => u.email === lastUsed) || savedUsers[0];

      loginForm.setFieldsValue({
        email: matchedUser.email,
        password: matchedUser.password,
        remember: true,
      });
    } else {
      loginForm.resetFields();
      loginForm.setFieldsValue({ remember: false });
    }
  }, [loginForm]);

  useEffect(() => {
    if (activeTab === "login") {
      const { email, password } = loginForm.getFieldsValue([
        "email",
        "password",
      ]);
      const errors = loginForm.getFieldsError(["email", "password"]);
      const hasErrors = errors.some((f) => (f.errors || []).length > 0);
      const hasEmail = !!(email && String(email).trim().length > 0);
      const hasPassword = !!(password && String(password).trim().length > 0);

      setFormValid(hasEmail && hasPassword && !hasErrors);
    }
  }, [activeTab, loginForm]);
  const closeBookingModal = async () => {
    loginForm.resetFields();
    setAuthModalOpen(false);
  };

  const handleLogin = async (values: any) => {
    const { email, password, remember } = values;

    try {
      // ✅ Remember Me logic
      if (remember) {
        const savedUsers = JSON.parse(
          localStorage.getItem("savedUsers") || "[]"
        );

        // Check if user already exists
        const existingIndex = savedUsers.findIndex(
          (u: any) => u.email === email
        );

        if (existingIndex !== -1) {
          savedUsers[existingIndex] = { email, password };
        } else {
          savedUsers.push({ email, password });
        }

        localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
        localStorage.setItem("lastUsedEmail", email);
      } else {
        // ❌ User did NOT check "Remember me" → clear stored data
        localStorage.removeItem("savedUsers");
        localStorage.removeItem("lastUsedEmail");
      }

      // ✅ Dispatch login
      const response = await dispatch(loginUser({ email, password }));

      if (response.meta.requestStatus === "rejected") {
        message.error(response.payload || "Login failed. Please try again.");
      } else {
        // ✅ Successful login
        setUserDetails("user", response.payload);
        setAuthModalOpen(false);
        loginForm.resetFields();

        message.success("Login successful!");
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Something went wrong during login.");
    }
  };

  //   // Auth handlers
  //  const handleLogin = (values: any) => {
  //   const user = getUserDetails('registerUser');

  //   if (user?.email !== values.email) {
  //     message.error('No account found with this email.');
  //     return;
  //   }

  //   if (user.password !== values.password) {
  //     message.error('Incorrect password.');
  //     return;
  //   }
  //   setUserDetails('user',user);

  //   // setCurrentUserData(user);
  //   message.success(`Welcome back, ${user.name}!`);

  //   setTimeout(() => {
  //     setAuthModalOpen(false);
  //     loginForm.resetFields();
  //     navigate('/app/dashboard');  // ✅ Correct way
  //   }, 1000);
  // };

  // const handleRegister = (values: any) => {
  //   const existingUser = findUser(values.email.toLowerCase());

  //   if (existingUser) {
  //     message.error('Account already exists. Please login.');
  //     return;
  //   }

  //   const newUser = {
  //     id: Date.now(),
  //     name: values.name,
  //     email: values.email.toLowerCase(),
  //     phone: values.phone,
  //     password: values.password,
  //     role: 'Customer',
  //     createdAt: new Date().toISOString()
  //   };

  //   dispatch(registerUser({ first_name: values.name, last_name: values.name, email: values.email, password: values.password, mobile: values.phone }));

  //   setUserDetails('registerUser',newUser);

  //   saveUser(newUser);
  //   message.success('Account created! Please login to continue.');

  //   setTimeout(() => {
  //     setActiveTab('login');
  //     loginForm.setFieldsValue({ email: values.email });
  //   }, 1500);

  //   registerForm.resetFields();
  // };

  const handleForgotPassword = () => {
    const email = loginForm.getFieldValue("email");

    if (!email) {
      message.error("Please enter your email first.");
      return;
    }

    // Optionally validate user here

    // Navigate to forgot password page with email as query param (optional)
    navigate(`/forgotPasswordlink?email=${encodeURIComponent(email)}`);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo-section">
            <div className="logo-wrapper">
              <img src={BrandLogo} alt="Swachify Logo" />
            </div>

            <div>
              <div className="brand-name">SWACHIFY</div>

              <div className="brand-tagline">
                Professional Cleaning Services
              </div>
            </div>
          </div>

          <div className="header-nav">
            {menuItems.map((item) => (
              <a
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                className="nav-link"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="header-actions">
            <Button
              type="primary"
              size="large"
              onClick={() => setAuthModalOpen(true)}
              className="book-now-btn"
            >
              Book Now
            </Button>

            <Button
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-menu-btn"
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
        <Menu mode="vertical">
          {menuItems.map((item) => (
            <Menu.Item key={item.key} onClick={() => scrollToSection(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-wrap">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge nowrap-ellipsis">
                <span>✨</span>
                <span>Trusted by 5,000+ Happy Customers</span>
              </div>

              <h1 className="hero-title">
                Sparkling Clean Homes{" "}
                <span className="gradient">Delivered</span>
              </h1>

              <p className="hero-subtitle wrap">
                Professional cleaning services at your doorstep. From deep
                cleaning to regular maintenance, we make your space shine like
                new.
              </p>

              <div className="hero-ctas">
                <Button
                  className="cta-gradient"
                  type="primary"
                  size="large"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Book a Cleaning
                </Button>
                <Button
                  size="large"
                  onClick={() => scrollToSection("services")}
                  className="cta-outline"
                >
                  Our Services
                </Button>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
                <div className="stat">
                  <div className="stat-number">15K+</div>
                  <div className="stat-label">Cleanings Done</div>
                </div>
                <div className="stat">
                  <div className="stat-number">4.9★</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-frame">
                <div className="hero-visual-inner">
                  <img src={ServicesImg} alt="Swachify" className="hero-img" />
                </div>
              </div>

              <div className="hero-float top-right">
                <div className="float-row">
                  <div className="icon">✓</div>
                  <div>
                    <div className="title">Quick Booking</div>
                    <div className="caption">In 60 seconds</div>
                  </div>
                </div>
              </div>

              <div className="hero-float bottom-left">
                <div className="float-row">
                  <div className="icon">🧹</div>
                  <div>
                    <div className="title">Eco-Friendly</div>
                    <div className="caption">Safe products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2 className="section-title">Our Cleaning Services</h2>
          <p className="section-description">
            Comprehensive cleaning solutions tailored to your needs. Choose from
            our wide range of professional services.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="service-card">
              <div
                className="service-icon-wrapper"
                style={{ background: service.gradient }}
              >
                {service.icon}
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-description">{service.description}</p>
              <div className="service-features">
                {service.features.map((feature, i) => (
                  <div key={i} className="service-feature-item">
                    <span className="service-feature-check">✓</span>
                    <span className="service-feature-text">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                type="link"
                onClick={() => setAuthModalOpen(true)}
                className="service-link"
              >
                Book Now →
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">How Swachify Works</h2>
            <p className="section-description">
              Book your cleaning service in just 3 simple steps
            </p>
          </div>

          <div className="steps-grid">
            {[
              {
                num: 1,
                title: "Choose Your Service",
                desc: "Select from our range of cleaning services. Pick the date and time that works best for you.",
              },
              {
                num: 2,
                title: "We Send Our Team",
                desc: "Our verified, trained professionals arrive on time with all necessary equipment and eco-friendly supplies.",
              },
              {
                num: 3,
                title: "Enjoy Your Clean Space",
                desc: "Relax while we work our magic. Pay securely online and enjoy your sparkling clean home or office!",
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number-circle">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="features-grid">
            {[
              {
                icon: "🔒",
                title: "Verified Professionals",
                desc: "Background-checked cleaning experts",
              },
              {
                icon: "🌿",
                title: "Eco-Friendly Products",
                desc: "Safe for family, pets, and planet",
              },
              {
                icon: "💳",
                title: "Secure Payment",
                desc: "Multiple payment options available",
              },
              {
                icon: "⭐",
                title: "Quality Guarantee",
                desc: "100% satisfaction or money back",
              },
            ].map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-card-title">{feature.title}</h4>
                <p className="feature-card-description">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-description">
            No hidden charges. Pay only for what you need.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}
              <div className="pricing-plan-name">{plan.name}</div>
              <div className="pricing-amount">
                {plan.price}
                <span className="pricing-period">{plan.period}</span>
              </div>
              <div className="pricing-description">{plan.description}</div>
              <div className="pricing-features">
                {plan.features.map((feature, i) => (
                  <div key={i} className="pricing-feature-item">
                    <span className="pricing-feature-check">✓</span>
                    <span className="pricing-feature-text">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                type={plan.popular ? "primary" : "default"}
                size="large"
                block
                onClick={() => setAuthModalOpen(true)}
                className={`pricing-button ${
                  plan.popular ? "popular" : "default"
                }`}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>

        <div className="custom-quote-section">
          <p className="custom-quote-text">
            Need a custom quote for commercial spaces?
          </p>
          <a
            onClick={() => scrollToSection("contact")}
            className="custom-quote-link"
          >
            Contact us for enterprise pricing →
          </a>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-grid">
            <div>
              <h2 className="about-title">About Swachify</h2>
              <p className="about-text">
                Founded in 2020, Swachify has been transforming homes and
                offices across the city with our professional cleaning services.
                We believe everyone deserves a clean, healthy living space.
              </p>
              <p className="about-text">
                Our team of trained professionals uses eco-friendly products and
                modern equipment to deliver exceptional results. We're not just
                cleaning - we're creating healthier, happier spaces for our
                customers.
              </p>

              <div className="about-stats-grid">
                {[
                  { value: "5 Years", label: "In Business" },
                  { value: "100+", label: "Cleaning Experts" },
                  { value: "15K+", label: "Services Completed" },
                  { value: "98%", label: "Customer Satisfaction" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="about-stat-value">{stat.value}</div>
                    <div className="about-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                onClick={() => setAuthModalOpen(true)}
                className="join-customers-btn"
              >
                Join Our Happy Customers
              </Button>
            </div>

            <div className="about-features-grid">
              <div className="about-features-column">
                {[
                  {
                    icon: "🏆",
                    title: "Award Winning",
                    desc: "Best Cleaning Service 2023",
                  },
                  {
                    icon: "⚡",
                    title: "Same Day Service",
                    desc: "Quick response time",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="about-feature-card">
                    <div className="about-feature-icon">{item.icon}</div>
                    <h4 className="about-feature-title">{item.title}</h4>
                    <p className="about-feature-description">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="about-features-column margin-top">
                {[
                  {
                    icon: "🌟",
                    title: "Trained Staff",
                    desc: "Certified professionals",
                  },
                  { icon: "💯", title: "Money Back", desc: "100% guarantee" },
                ].map((item, idx) => (
                  <div key={idx} className="about-feature-card">
                    <div className="about-feature-icon">{item.icon}</div>
                    <h4 className="about-feature-title">{item.title}</h4>
                    <p className="about-feature-description">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-description">
            Real reviews from real customers
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-rating">
                {"★".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{ background: testimonial.color }}
                >
                  {testimonial.initial}
                </div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="platforms-section">
          {[
            { name: "Google", rating: "4.9" },
            { name: "Facebook", rating: "4.8" },
            { name: "Trustpilot", rating: "4.9" },
          ].map((platform, idx) => (
            <div key={idx} className="platform-item">
              <div className="platform-name">{platform.name}</div>
              <div className="platform-rating">★★★★★ {platform.rating}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact/CTA */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">Ready for a Sparkling Clean Space?</h2>
          <p className="contact-description">
            Book your cleaning service today and experience the Swachify
            difference. Professional, reliable, and eco-friendly.
          </p>

          <div className="contact-buttons">
            <Button
              size="large"
              onClick={() => setAuthModalOpen(true)}
              className="contact-button-primary"
            >
              Book a Cleaning Now
            </Button>
            <Button
              size="large"
              icon={<PhoneOutlined />}
              href="tel:+1(905)588-2122"
              className="contact-button-secondary"
            >
              Call +1(905) 588-2122
            </Button>
          </div>

          <div className="contact-info-grid">
            {[
              { value: "24/7", label: "Customer Support" },
              { value: "Same Day", label: "Service Available" },
              { value: "100%", label: "Satisfaction Guaranteed" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="contact-info-value">{item.value}</div>
                <div className="contact-info-label">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="contact-details">
            <p>
              <MailOutlined /> Email:{" "}
              <a href="mailto:info@swachify.com">info@swachify.com</a>
            </p>
            <p>
              <EnvironmentOutlined /> Address: 76 King St W, Oshawa, ON L1H 1A6,
              Canada
            </p>
            <p>
              <ClockCircleOutlined /> Working Hours: Mon-Sat: 8AM-8PM, Sun:
              9AM-6PM
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-logo">🧹</div>
                <span className="footer-brand-name">Swachify</span>
              </div>
              <p className="footer-description">
                Professional cleaning services for homes and offices.
              </p>
            </div>

            <div>
              <h4 className="footer-section-title">Services</h4>
              <div className="footer-links">
                {[
                  "Home Cleaning",
                  "Office Cleaning",
                  "Deep Cleaning",
                  "Sofa Cleaning",
                ].map((item, idx) => (
                  <a
                    key={idx}
                    onClick={() => scrollToSection("services")}
                    className="footer-link"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="footer-section-title">Company</h4>
              <div className="footer-links">
                {[
                  { label: "About Us", section: "about" },
                  { label: "Reviews", section: "testimonials" },
                  // { label: 'Careers', section: null },
                  { label: "Contact", section: "contact" },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    onClick={() =>
                      item.section && scrollToSection(item.section)
                    }
                    className="footer-link"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="footer-section-title">Support</h4>
              <div className="footer-links">
                {[
                  //{ label: 'Help Center', href: 'mailto:info@swachify.com' },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Refund Policy", href: "/refund" },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="footer-link"
                    target={
                      item.href.startsWith("http") ||
                      item.href.startsWith("mailto")
                        ? "_blank"
                        : "_self"
                    }
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} Swachify. All rights reserved.
            </div>
            <div className="footer-social">
              {[
                { name: "Facebook", link: "https://www.facebook.com/swachify" },
                {
                  name: "Instagram",
                  link: "https://www.instagram.com/swachify",
                },
                { name: "Twitter", link: "https://twitter.com/swachify" },
                {
                  name: "LinkedIn",
                  link: "https://www.linkedin.com/company/swachify",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        open={authModalOpen}
        onCancel={() => closeBookingModal()}
        footer={null}
        width={480}
        centered
      >
        <div className="auth-modal-content">
          <h3 className="auth-modal-title">Book Your Cleaning</h3>

          {/* ---------- Custom Button Tabs ---------- */}
          <div className="auth-tabs-container">
            {/* <Button
            type="primary"
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              height: 46,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 12,
              background:
                activeTab === 'login'
                  ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)'
                  : '#f1f5f9',
              color: activeTab === 'login' ? '#fff' : '#475569',
              border: 'none',
              transition: 'all 0.3s ease',
              boxShadow:
                activeTab === 'login'
                  ? '0 3px 10px rgba(20, 184, 166, 0.3)'
                  : 'none',
            }}
          >
            Login
          </Button> */}

            {/* <Button
            type="primary"
            onClick={() => setActiveTab('register')}
            disabled
            style={{
              flex: 1,
              height: 46,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 12,
              background:
                activeTab === 'register'
                   ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)'
                  : '#f1f5f9',
              color: activeTab === 'register' ? '#fff' : '#475569',
              border: 'none',
              transition: 'all 0.3s ease',
              boxShadow:
                activeTab === 'register'
                  ? '0 3px 10px rgba(20, 184, 166, 0.3)'
                  : 'none',
            }}
          >
            Register
          </Button> */}
          </div>

          {/* ---------- Login Form ---------- */}
          {activeTab === "login" && (
            <Form
              form={loginForm}
              onFinish={handleLogin}
              layout="vertical"
              onValuesChange={() => {
                const { email, password } = loginForm.getFieldsValue([
                  "email",
                  "password",
                ]);

                const relaxedEmailRegex = /^[^\s@]+@[^\s@]+$/;
                const isEmailValid = relaxedEmailRegex.test(
                  email?.trim() || ""
                );

                const isPasswordValid = !!(
                  password && password.trim().length >= 6
                );

                const errors = loginForm.getFieldsError(["email", "password"]);
                const hasErrors = errors.some(
                  (f) => (f.errors || []).length > 0
                );

                setFormValid(isEmailValid && isPasswordValid && !hasErrors);
              }}
            >
              <Form.Item
                label="Email Address"
                name="email"
                normalize={(value) => (value ? value.trim() : value)}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input size="large" placeholder="your@email.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password size="large" placeholder="Enter password" />
              </Form.Item>

               <div className="login-options">
  <Form.Item
    name="remember"
    valuePropName="checked"
    initialValue={false}
    className="remember-item"
  >
    <Checkbox className="remember-checkbox">Remember me</Checkbox>
  </Form.Item>

  <Button
    type="link"
    onClick={handleForgotPassword}
    className="forgot-password-btn"
  >
    Forgot password?
  </Button>
</div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                disabled={!formValid}
                className="auth-submit-button"
              >
                Sign In
              </Button>
            </Form>
          )}

          {/* ---------- Register Form ---------- */}
          {/* {activeTab === 'register' && (
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
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input size="large" placeholder="your@email.com" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: 'Please enter your phone number' },
              ]}
            >
              <Input size="large" placeholder="+91 98765 43210" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
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
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                border: 'none',
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
              }}
            >
              Create Account
            </Button>
          </Form>
        )} */}

          <p className="auth-footer-text">
            By continuing, you agree to our{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Landing;
