import React, { useMemo, useRef, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Space,
  Button,
  Tag,
  Tooltip,
  InputNumber,
  Steps,
  DatePicker,
  Input,
  Form,
  ConfigProvider,
  Divider,
  message,
} from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  BankOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { createBooking ,getAllMasterData } from "../../app/services/auth.ts";
import { getUserDetails } from "../../utils/helpers/storage.ts";
import "./Services.css";
import { MASTER_OPTIONS } from "../../utils/constants/data.ts";
//import { MASTER_OPTIONS } from "../../utils/constants/data.ts";


const { Title, Text } = Typography;


type CleanType = "Normal" | "Deep";
type SectionKey = "bedroom" | "bathroom" | "kitchen" | "living";
type StepKey = 0 | 1;

const PRICING = {
  base: { bedroom: 300, bathroom: 400, kitchen: 500, living: 350 } as Record<
    SectionKey,
    number
  >,
  typeDelta: { Normal: 0, Deep: 150 } as Record<CleanType, number>,
  addOnPerHour: 120,
  minHours: 3,
};

const SUBSERVICES: Record<SectionKey, { label: string; value: string }[]> = {
  bedroom: [
    { label: "Single", value: "single" },
    { label: "Double", value: "double" },
    { label: "Triple", value: "triple" },
    { label: "4 Bed Room", value: "4bed" },
  ],
  bathroom: [
    { label: "Single", value: "single" },
    { label: "Double", value: "double" },
    { label: "Triple", value: "triple" },
    { label: "4 Bed Room", value: "4bed" },
  ],
  kitchen: [
    { label: "Single", value: "single" },
    { label: "Double", value: "double" },
  ],
  living: [
    { label: "With Dining", value: "with_dining" },
    { label: "Without Dining", value: "without_dining" },
  ],
};

type ServicePlan = {
  subService?: string | null;
  type?: CleanType | null;
  addOnHours: number[];
};
type FormState = Record<SectionKey, ServicePlan>;

const SECTION_META: Record<SectionKey, { icon: React.ReactNode; title: string }> =
  {
    bedroom: { icon: <HomeOutlined />, title: "Bedroom" },
    bathroom: { icon: <ApartmentOutlined />, title: "Bathroom" },
    kitchen: { icon: <AppstoreOutlined />, title: "Kitchen" },
    living: { icon: <BankOutlined />, title: "Living" },
  };

const isActivePlan = (plan: ServicePlan) =>
  Boolean(plan?.subService || plan?.type || (plan?.addOnHours?.length ?? 0) > 0);

const calcSectionTotal = (section: SectionKey, plan: ServicePlan) => {
  if (!isActivePlan(plan)) return 0;
  const base = PRICING.base[section] ?? 0;
  const typeDelta = plan.type ? PRICING.typeDelta[plan.type] : 0;
  const addOnSum =
    (plan.addOnHours?.reduce((a, b) => a + b, 0) ?? 0) * PRICING.addOnPerHour;
  return base + typeDelta + addOnSum;
};

const usdFormatter = (value?: string | number) => {
  if (value === undefined || value === null) return "";
  const n =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return "";
  return `$ ${n}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Services: React.FC = () => {
  const [form] = Form.useForm();
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);


  const anchors = {
    bedroom: useRef<HTMLDivElement>(null),
    bathroom: useRef<HTMLDivElement>(null),
    kitchen: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
  };

  const [currentStep, setCurrentStep] = useState<StepKey>(0);
  const [master, setMaster] = useState<SectionKey>("bedroom"); // default to Living per SS
const [loading, setLoading] = useState<boolean>(false);
const [setSubServiceOptions] = useState<any>({});  

  const [serviceForm, setServiceForm] = useState<FormState>({
    bedroom: { subService: null, type: null, addOnHours: [] },
    bathroom: { subService: null, type: null, addOnHours: [] },
    kitchen: { subService: null, type: null, addOnHours: [] },
    living: { subService: null, type: null, addOnHours: [] },
  });

  const [addonsOpen, setAddonsOpen] = useState<Record<SectionKey, boolean>>({
    bedroom: false,
    bathroom: false,
    kitchen: false,
    living: false,
  });

  const [customerRequest, setCustomerRequest] = useState<number>(0);
  
  const [customerData, setCustomerData] = useState<any>(null);
const navigate = useNavigate();


  const setSection = <K extends keyof ServicePlan,>(
    section: SectionKey,
    key: K,
    value: ServicePlan[K]
  ) =>
    setServiceForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));

  const resetSection = (section: SectionKey) =>
    setServiceForm((prev) => ({
      ...prev,
      [section]: { subService: null, type: null, addOnHours: [] },
    }));

  const toggleAddOn = (section: SectionKey, hours: number) =>
    setServiceForm((prev) => {
      const cur = prev[section].addOnHours || [];
      const has = cur.includes(hours);
      const next = has ? cur.filter((h) => h !== hours) : [...cur, hours];
      setAddonsOpen((o) => ({ ...o, [section]: true }));
      return { ...prev, [section]: { ...prev[section], addOnHours: next } };
    });

  const sectionsToShow: SectionKey[] = [master];

  const grandTotal = useMemo(
    () =>
      (Object.keys(serviceForm) as SectionKey[]).reduce(
        (sum, s) => sum + calcSectionTotal(s, serviceForm[s]),
        0
      ),
    [serviceForm]
  );

  // Derived values for “willing to pay” logic
  const hasService = useMemo(
    () =>
      Object.values(serviceForm).some(
        (plan) =>
          plan.subService ||
          plan.type ||
          (plan.addOnHours?.length ?? 0) > 0
      ),
    [serviceForm]
  );

  const subtotal = grandTotal;
  const willingToPay = Math.max(0, customerRequest || 0);

  // Rule set B: no negative discounts, total never exceeds subtotal
  const discountAmount = useMemo(() => {
    if (!hasService || subtotal <= 0) return 0;
    return Math.max(0, subtotal - willingToPay);
  }, [hasService, subtotal, willingToPay]);

  const discountPct = useMemo(() => {
    if (!hasService || subtotal <= 0) return 0;
    return Math.round((discountAmount / subtotal) * 100);
  }, [hasService, subtotal, discountAmount]);
 useEffect(() => {
  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const data = await getAllMasterData();
      console.log("Fetched Master Data:", data);

      // Group by department name
      const grouped = data.reduce((acc: any, item: any) => {
        const deptName = item.departmentName?.toLowerCase() || "other";
        if (!acc[deptName]) acc[deptName] = [];
        acc[deptName].push({
          label: item.serviceName,
          value: item.serviceId,
          price: item.price,
          deptId: item.departmentId,
          serviceTypeId: item.serviceTypeId,
        });
        return acc;
      }, {});

      setSubServiceOptions(grouped);
      //setMasterData(data);
    } catch (err) {
      console.error("Error loading master data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMasterData();
}, []);



  const discountedTotal = useMemo(() => {
    if (!hasService || subtotal <= 0) return 0;
    return Math.min(subtotal, Math.max(0, willingToPay));
  }, [hasService, subtotal, willingToPay]);
  const changeStep = async (idx: StepKey) => {
      if(!customerData){
             message.warning("Please fill customer details first.");
             setCurrentStep(currentStep as StepKey)
            }
            else{
              setCurrentStep(idx as StepKey)  
            }
  }
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const user = getUserDetails("user");

      let customerInfo = customerData;
      if (!customerInfo) {
        try {
          customerInfo = await form.validateFields();
        } catch {
          message.error("Please go back and complete customer details.");
          setLoading(false);
          return;
        }
      }

      const { fullName, phone, email, address, date } = customerInfo;
      if (!fullName || !phone || !email || !address || !date) {
        message.error("Missing customer details. Please go back to Step 1.");
        setCurrentStep(0);
        setLoading(false);
        return;
      }

      if (!hasService) {
        message.warning("Please select at least one service before submitting.");
        setLoading(false);
        return;
      }

      const DEPT_MAP: Record<string, number> = {
        bedroom: 1,
        bathroom: 2,
        kitchen: 3,
        living: 4,
      };

      const SERVICE_MAP: Record<string, number> = {
        single: 1,
        double: 2,
        triple: 3,
        "4bed": 4,
        with_dining: 5,
        without_dining: 6,
      };

      const SERVICE_TYPE_MAP: Record<string, number> = {
        Normal: 1,
        Deep: 2,
      };

      const services = (Object.keys(serviceForm) as SectionKey[])
        .filter((key) => {
          const s = serviceForm[key];
          return s.subService || s.type;
        })
        .map((key) => {
          const s = serviceForm[key];
          return {
            deptId: DEPT_MAP[key] ?? 0,
            serviceId: s.subService ? SERVICE_MAP[s.subService] ?? 0 : 1,
            serviceTypeId: s.type ? SERVICE_TYPE_MAP[s.type] ?? 0 : 1,
          };
        });

      const payload = {
        id: 0,
        bookingId: `BOOK-${Date.now()}`,
        slotId: 1,
        createdBy: user?.id || 1,
        createdDate: new Date().toISOString(),
        modifiedBy: user?.id || 1,
        modifiedDate: new Date().toISOString(),
        isActive: true,
        preferredDate: date.format
          ? date.format("YYYY-MM-DD")
          : dayjs(date).format("YYYY-MM-DD"),
        full_name: fullName,
        phone: phone,
        email: email,
        address: address,
        status_id: 1,
        total: discountedTotal,                  // final payable
        subtotal: subtotal,                      // computed subtotal
        customer_requested_amount: willingToPay, // CR
        discount_amount: discountAmount,
        discount_percentage: discountPct,
        discount_total: discountedTotal,
        services,
        is_regular: serviceForm[master].type === "Normal",
        is_premium: serviceForm[master].type === "Deep",
        is_ultimate: false,
      };

      // eslint-disable-next-line no-console
      console.log("✅ Final Booking Payload:", payload);

      const response = await createBooking(payload);
      if (response?.status === 200 || response?.status === 201) {
        message.success("Booking created successfully!");
        form.resetFields();
        setCustomerData(null);
        setServiceForm({
          bedroom: { subService: null, type: null, addOnHours: [] },
          bathroom: { subService: null, type: null, addOnHours: [] },
          kitchen: { subService: null, type: null, addOnHours: [] },
          living: { subService: null, type: null, addOnHours: [] },
        });
        setAddonsOpen({
          bedroom: false,
          bathroom: false,
          kitchen: false,
          living: false,
        });
        setCustomerRequest(0);
        setCurrentStep(0);
        setMaster("bathroom");  
        setTimeout(() => {
    navigate("../bookings");
  }, 800);
} else {
  message.error("Failed to create booking. Please try again.");
}
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Booking error:", err);
      if (err.errorFields) {
        message.error("Please complete all required fields.");
      } else {
        message.error("An error occurred while creating the booking.");
      }
    } finally {
      setLoading(false);
    }
  };

  const CustomerDetails = (
    <>
    <div className="sv-steps-wrap">
      <Steps
  current={currentStep}
  onChange={(idx) => setCurrentStep(idx as StepKey)}
  items={[
    {
      title: (
        <span
          style={{
            color: currentStep === 0 ? "#1677ff" : "#8c8c8c",
            fontWeight: currentStep === 0 ? 700 : 500,
            textDecoration: currentStep === 0 ? "underline" : "none",
          }}
        >
          Customer Details
        </span>
      ),
    },
    {
      title: (
        <span
          style={{
            color: currentStep === 1 ? "#1677ff" : "#8c8c8c",
            fontWeight: currentStep === 1 ? 700 : 500,
            textDecoration: currentStep === 1 ? "underline" : "none",
          }}
        >
          Service Selection
        </span>
      ),
    },
  ]}
  size="small"
  className="sv-steps-bar"
/></div>

      <Card bordered className="sv-card" style={{ borderRadius: 12 }}>
        <Space direction="vertical" size={2} className="sv-w-full" style={{ width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            Booking Details
          </Title>
        </Space>
          <Form
    layout="vertical"
    form={form}
    className="sv-form"
    onValuesChange={() => {
      const values = form.getFieldsValue();
      const allFilled =
        values.fullName &&
        /^[A-Za-z]{2,}\s[A-Za-z\s]{2,}$/.test(values.fullName) &&
        values.date &&
        /^[6-9][0-9]{9}$/.test(values.phone || "") &&
        values.email &&
        /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email) &&
        values.address &&
        /\b\d+[A-Za-z]?\b/.test(values.address) && // door number check
        /\b\d{6}\b/.test(values.address);          // pincode check
      setIsContinueDisabled(!allFilled);
    }}
  >
          <Row gutter={[8, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your name" },
                  {
                    pattern: /^[A-Za-z]{2,}\s[A-Za-z\s]{2,}$/,
                    message: "Enter valid full name (First and Last name)",
                  },
                ]}
              >
                <Input
            prefix={<UserOutlined />}
            placeholder="Enter full name"
            onChange={(e) => {
              // Allow only alphabets and spaces
              const clean = e.target.value.replace(/[^A-Za-z\s]/g, "");
              form.setFieldsValue({ fullName: clean });
            }}
          />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Preferred date"
                name="date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  className="sv-w-full"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                  format="DD-MM-YYYY"
                  inputReadOnly
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
            {
              pattern: /^[6-9][0-9]{9}$/,
              message: "Enter a valid 10-digit phone number starting with 6–9",
            },
                ]}
              >
                 <Input
            prefix={<PhoneOutlined />}
            placeholder="9876543210"
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => {
              // ✅ Block invalid typing immediately
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              if (onlyNums.length > 0 && !/^[6-9]/.test(onlyNums[0])) return;
              form.setFieldsValue({ phone: onlyNums });
            }}
          />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
            {
              pattern: /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: "Email cannot start with number or special character",
            },
                ]}
              >
                 <Input
            prefix={<MailOutlined />}
            placeholder="Enter email address"
            onChange={(e) => {
              // ✅ Block invalid first character immediately
              const val = e.target.value;
              if (val.length === 1 && /[^A-Za-z]/.test(val)) return;
              form.setFieldsValue({ email: val });
            }}
          />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                   { required: true, message: "Please enter your address" },
            {
              validator: (_, value) => {
                if (!value || value.trim() === "")
                  return Promise.reject(new Error("Please enter your address"));

                // Must include door/flat number (like 12, 5B, #10)
                const hasDoorNumber = /\b\d+[A-Za-z]?\b/.test(value);

                // Must include 6-digit pin code
                const hasPincode = /\b\d{6}\b/.test(value);

                if (!hasDoorNumber)
                  return Promise.reject(
                    new Error("Address must include a door or flat number")
                  );
                if (!hasPincode)
                  return Promise.reject(
                    new Error("Address must include a valid 6-digit pincode")
                  );

                return Promise.resolve();
              },
            },
                ]}
              >
                <Input.TextArea
            rows={3}
            placeholder="Flat, street, landmark, city, postal code"
            maxLength={200}
            onChange={(e) => {
              // Prevent emoji or non-text characters
              const clean = e.target.value.replace(/[^\w\s,/#-]/g, "");
              form.setFieldsValue({ address: clean });
            }}
          />
            </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Button
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={async () => {
                  try {
                    const values = await form.validateFields();
                    setCustomerData(values);
                    setCurrentStep(1);
                  } catch {
                    message.error("Please complete all required fields.");
                  }
                }}
                block
                className="sv-btn-primary"
                disabled={isContinueDisabled}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );

  const CategoryRow: React.FC<{ section: SectionKey }> = ({ section }) => {
  const state = serviceForm[section];
  return (
    <div>
      <Row gutter={[8, 8]} align="middle">
        <Col xs={24} md={12}>
        <Text strong className="sv-block sv-mb-6">
          Select Service Sub Category
        </Text>
        <Select
          value={state.subService ?? undefined}
          placeholder="Select sub category"
          className="sv-w-full"
          options={SUBSERVICES[section]}
          allowClear
          onChange={(v) => {
            // set sub category
            setSection(section, "subService", v as string);


            // also clear type if subcategory changes
            setSection(section, "type", null);
          }}
        />
      </Col>

          <Col xs={24} md={12}>
            <Text strong className="sv-block sv-mb-6">
          Sub Category Type
        </Text>
            <Select
              value={state.type ?? undefined}
              placeholder="Select cleaning type"
              className="sv-w-full"
              disabled={!state.subService} // ✅ will disable when no subService
          onChange={(v) => setSection(section, "type", v as CleanType)}
              allowClear
              options={[
                {
                  label: (
                    <Space size={6}>
                      <span>Normal</span>
                       <Tag className="sv-accent-tag">
                    +{`$${PRICING.typeDelta.Normal}`}
                  </Tag>
                    </Space>
                  ),
                  value: "Normal",
                },
                {
                  label: (
                    <Space size={6}>
                      <span>Deep Cleaning</span>
                      <Tag className="sv-accent-tag">+{`$${PRICING.typeDelta.Deep}`}</Tag>
                    </Space>
                  ),
                  value: "Deep",
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    );
  };

  const SectionCard: React.FC<{ section: SectionKey }> = ({ section }) => {
    const meta = SECTION_META[section];
    const state = serviceForm[section];

    return (
      <Card
        ref={anchors[section] as any}
        bordered
        className="sv-section-card"
        bodyStyle={{ padding: 16 }}
        title={
          <Space size="small">
            {meta.icon}
            <Text strong className="sv-title-16">{meta.title}</Text>
          </Space>
        }
        extra={
          <Button size="small" type="text" onClick={() => resetSection(section)} icon={<ReloadOutlined />}>
            Clear
          </Button>
        }
      >
        <Space direction="vertical" size="small" className="sv-w-full">
          <CategoryRow section={section} />

          <div className="sv-flex-between">
            <Text type="secondary">Minimum cleaning hours</Text>
            <Tag color="gold">{PRICING.minHours} hours</Tag>
          </div>

          <div className="sv-flex-between">
            <Text type="secondary">Add-on hours</Text>
            <Button
              type="link"
              size="small"
              onClick={() => setAddonsOpen((o) => ({ ...o, [section]: !o[section] }))}
              className="sv-link-accent"
            >
              {addonsOpen[section] ? "Hide" : "Select hours"}
            </Button>
          </div>

          {addonsOpen[section] && (
            <Space wrap>
              {[1, 2, 3].map((h) => {
                const active = state.addOnHours.includes(h);
                return (
                  <Tag.CheckableTag
                    key={h}
                    checked={active}
                    onChange={() => toggleAddOn(section, h)}
                    className={active ? "sv-accent-tag" : ""}
                  >
                    +{h} hr (${h * PRICING.addOnPerHour})
                  </Tag.CheckableTag>
                );
              })}
            </Space>
          )}

          <Divider className="sv-my-8" />

          <div className="sv-flex-between">
            <Text type="secondary">Section Total</Text>
            <Text strong>{usdFormatter(calcSectionTotal(section, state))}</Text>
          </div>
        </Space>
      </Card>
    );
  };

  const ServicesSelection = (
    <>
      <div className="sv-steps-wrap">
        <ConfigProvider theme={{ token: { colorPrimary: "#14b8a6" } }}>
          <Steps
            current={1}
            items={[{ title: "Customer Details" }, { title: "Service Selection" }]}
            size="small"
            className="sv-steps-bar"
          />
        </ConfigProvider>
      </div>

  <Row
  align="middle"
  justify="space-between"
  className="sv-toolbar allign_category"
  style={{ width: "100%" }}
>
  {/* Left side - Back button */}
  <Col flex="100px">
    <Button
      icon={<ArrowLeftOutlined />}
      style={{marginLeft:-110}}
      onClick={() => setCurrentStep(0)}
    >
      Back
    </Button>
  </Col>

  {/* Center - Title + Dropdown together */}
  <Col flex="auto" style={{ textAlign: "center",marginRight:260 }}>
    <Space align="center" size="middle">
      <Title level={4} className="sv-m-0" style={{ marginBottom: 0 }}>
        Select Service Category
      </Title>

  <Select
  className="sv-master-select"
  value={master || undefined}
  options={MASTER_OPTIONS}
  placeholder="Select Service"
  suffixIcon={<AppstoreAddOutlined />}
  style={{ width: 180 }}
  onChange={(v) => {
    if (!customerData) {
      message.warning("Please fill customer details first.");
      return;
    }
    setMaster(v as SectionKey);
  }}
/>

    </Space>
  </Col>

  {/* Right side - empty (to balance center alignment) */}
  <Col flex="100px" />
</Row>

      <Row gutter={[16, 16]} className="sv-content-row">
        <Col xs={24} lg={16} className="sv-left-pane">
          {sectionsToShow.includes("bedroom") && <SectionCard section="bedroom" />}
          {sectionsToShow.includes("bathroom") && <SectionCard section="bathroom" />}
          {sectionsToShow.includes("kitchen") && <SectionCard section="kitchen" />}
          {sectionsToShow.includes("living") && <SectionCard section="living" />}
        </Col>

        <Col xs={24} lg={8} className="sv-right-pane">
          <Card
            bordered
            className="sv-right-card"
            bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}
            title={<Text strong>Selection Summary</Text>}
            extra={
              <Button
                size="small"
                type="primary"
                ghost
                icon={<ReloadOutlined />}
                onClick={() => {
                  (["bedroom","bathroom","kitchen","living"] as SectionKey[]).forEach((k) => resetSection(k));
                  setAddonsOpen({ bedroom:false, bathroom:false, kitchen:false, living:false });
                  setCustomerRequest(0);
                  setMaster("bedroom" as SectionKey);

                  message.success("Selections cleared");
                }}
                className="sv-reset-btn"
              >
                Reset
              </Button>
            }
          >
            <div className="sv-summary-items">
              {(Object.keys(serviceForm) as SectionKey[])
                .map((k) => ({ section: k, plan: serviceForm[k] }))
                .filter(({ plan }) => plan.type || plan.subService || plan.addOnHours.length > 0)
                .map(({ section, plan }) => {
                  const title = SECTION_META[section].title;
                  const total = calcSectionTotal(section, plan);
                  const subLabel =
                    plan.subService
                      ? SUBSERVICES[section].find((s) => s.value === plan.subService)?.label ?? plan.subService
                      : null;

                  return (
                    <div key={section} className="sv-item-card">
                      <div className="sv-flex-between">
                        <Text strong>{title}</Text>
                        <Text strong>{usdFormatter(total)}</Text>
                      </div>

                      <div className="sv-item-meta">
                        {subLabel && <Tag className="sv-type-tag">{subLabel}</Tag>}
                        {plan.type && <Tag className="sv-type-tag">{plan.type}</Tag>}
                        <Tag className="sv-min-hours">{PRICING.minHours}h min</Tag>

                        {plan.addOnHours.length > 0 && (
                          <span>
                            {plan.addOnHours.map((h) => (
                              <Tag key={h} className="sv-accent-tag">+{h}h</Tag>
                            ))}
                          </span>
                        )}

                        <div className="sv-item-actions">
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              type="primary"
                              shape="circle"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setMaster(section);
                                setTimeout(() => {
                                  anchors[section].current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                }, 0);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Remove">
                            <Button
                              size="small"
                              danger
                              type="primary"
                              shape="circle"
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                resetSection(section);
                                message.success(`${title} removed`);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div className="sv-summary-totals">
                <div className="sv-flex-between">
                  <Text strong>Subtotal</Text>
                  <Text strong>{hasService ? usdFormatter(subtotal) : "$ 0"}</Text>
                </div>

                <div className="sv-req-wrap">
                  <div className="sv-flex-between sv-mb-6">
                    <Text strong>Customer Requested</Text>
               <InputNumber
      className="sv-money-input"
      min={0}
      value={customerRequest}
      onChange={(v) => setCustomerRequest(v ?? 0)}
      // ✅ Show "$" symbol but allow only numbers
      formatter={(value) => `$ ${value ?? 0}`}
      parser={(value) => {
        // remove all non-digit characters
        const numericValue = value?.replace(/[^\d]/g, "") || "0";
        return Number(numericValue);
      }}
      controls={false}
      inputMode="numeric"
      onKeyPress={(e) => {
        // block non-numeric key presses
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }}
      onPaste={(e) => {
        // block pasting of non-numeric text
        const paste = e.clipboardData.getData("text");
        if (!/^\d+$/.test(paste)) {
          e.preventDefault();
        }
      }}
      placeholder="$ 0"
    />                
    </div>
</div>


                <div className="sv-flex-between sv-mt-8">
                  <Text strong>Discount</Text>
                  <Text strong>{hasService ? usdFormatter(discountAmount) : "$ 0"}</Text>
                </div>
                <div className="sv-flex-between">
                  <Text strong>Discount %</Text>
                  <Text strong>{hasService ? `${discountPct}%` : "0%"}</Text>
                </div>
                <div className="sv-flex-between">
                  <Text strong>Discounted Total</Text>
                  <Text strong>{hasService ? usdFormatter(discountedTotal) : "$ 0"}</Text>
                </div>
              </div>
            </div>

            <div className="sv-sticky-footer">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleSubmit}
                block
                loading={loading}
                size="large"
                className="sv-btn-primary"
              >
                Submit
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <div className="sv-page">
      <div className="sv-page-wrap">
        {currentStep === 0 ? (
          <div className="sv-flex-col">{CustomerDetails}</div>
        ) : (
          <div className="sv-flex-col">{ServicesSelection}</div>
        )}
      </div>
    </div>
  );
};

export default Services;
