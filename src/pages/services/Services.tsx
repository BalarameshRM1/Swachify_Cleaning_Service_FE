import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Space,
  Button,
  Tag,
  App,
  Tooltip,
  InputNumber,
  Steps,
  DatePicker,
  Input,
  Form,
  ConfigProvider, // <-- Added ConfigProvider
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
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ACCENT = "#14b8a6";
const ACCENT_GRADIENT =
  "linear-gradient(90deg, rgba(20,184,166,1) 0%, rgba(13,148,136,1) 100%)";

type CleanType = "Normal" | "Deep";
type SectionKey = "bedroom" | "bathroom" | "kitchen" | "living";
type StepKey = 0 | 1;

const MASTER_OPTIONS = [
  { label: "Bedroom", value: "bedroom" },
  { label: "Bathroom", value: "bathroom" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Living", value: "living" },
];

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

const SECTION_META: Record<
  SectionKey,
  { icon: React.ReactNode; title: string }
> = {
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
  const addOnSum = (plan.addOnHours?.reduce((a, b) => a + b, 0) ?? 0) * PRICING.addOnPerHour;
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
const usdParser = (value?: string) =>
  !value ? 0 : Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;

const styles = {
  pageWrap: {
    height: "calc(100vh - 16px)",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  } as React.CSSProperties,

  stepsWrap: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    background: "#fff",
    padding: "6px 0 10px 0",
    marginBottom: 8,
    borderRadius: 60,
  } as React.CSSProperties,

  stepsBar: {
    margin: 0,
  } as React.CSSProperties,

  moneyRight: {
    textAlign: "right",
  } as React.CSSProperties,



  contentRow: {
    flex: 1,
    display: "flex",
    minHeight: 0,
  } as React.CSSProperties,

  leftPane: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    paddingRight: 8,
    minHeight: 0,
  } as React.CSSProperties,

  sectionCard: {
    borderRadius: 12,
  } as React.CSSProperties,

  sectionBody: {
    padding: 16,
  } as React.CSSProperties,

  primaryBtn: {
    background: ACCENT_GRADIENT,
    border: "none",
    marginBottom: 120,
  } as React.CSSProperties,

  accentTag: {
    background: "#e6fffb",
    color: ACCENT,
    borderColor: ACCENT,
  } as React.CSSProperties,

  rightCard: {
    borderRadius: 12,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  } as React.CSSProperties,

  rightCardBody: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
  } as React.CSSProperties,

  summaryHeader: {
    padding: "12px 12px 8px 12px",
    borderBottom: "1px solid #eef2f7",
  } as React.CSSProperties,

  itemsScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "8px 12px",
  } as React.CSSProperties,

  summaryFooter: {
    position: "sticky",
    bottom: 0,
    background: "#fff",
    padding: "8px 12px 12px 12px",
    borderTop: "1px solid #eef2f7",
    zIndex: 3,
    marginBottom: "40px",
  } as React.CSSProperties,
};

const Services: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const anchors = {
    bedroom: useRef<HTMLDivElement>(null),
    bathroom: useRef<HTMLDivElement>(null),
    kitchen: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
  };

  const [currentStep, setCurrentStep] = useState<StepKey>(0);
  const [master, setMaster] = useState<SectionKey>("living"); // default to Living per SS

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
    living: true,
  });

  const [discount, setDiscount] = useState<number>(0);
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [customerRequest, setCustomerRequest] = useState<number>(0);

  // Customer info
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

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

  useEffect(() => {
    const requested = Math.max(0, customerRequest || 0);
    const raw = Math.max(0, grandTotal - requested);
    const capped = Math.min(raw, grandTotal);
    setDiscount(capped);
    const pct = grandTotal > 0 ? Math.round((capped / grandTotal) * 100) : 0;
    setDiscountPct(pct);
  }, [customerRequest, grandTotal]);

  const discountedTotal = useMemo(
    () => Math.max(grandTotal - discount, 0),
    [grandTotal, discount]
  );

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const payload = {
        step: currentStep,
        customer: {
          fullName,
          phone,
          email,
          address,
          date: date ? date.format("YYYY-MM-DD") : null,
        },
        master_category: master,
        minimum_cleaning_hours: PRICING.minHours,
        selections: serviceForm,
        subtotal: grandTotal,
        discount,
        discount_percent: discountPct,
        discounted_total: discountedTotal,
        customer_requested: customerRequest,
      };
      console.log("Submit payload", payload);
      message.success("Submitted successfully");
    } catch {
      message.error("Please complete the required fields.");
    }
  };

  const CustomerDetails = (
    <>
      <div style={styles.stepsWrap}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#14b8a6',
            },
          }}
        >
          <Steps
            current={currentStep}
            onChange={(idx) => setCurrentStep(idx as StepKey)}
            items={[{ title: "Customer Details" }, { title: "Service Selection" }]}
            size="small"
            style={styles.stepsBar}
          />
        </ConfigProvider>
      </div>
      <Card bordered style={{ borderRadius: 12 }}>
        <Space direction="vertical" size={2} style={{ width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            Booking Details
          </Title>
        </Space>
        <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
          <Row gutter={[8, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full name"
                name="fullName"
                required
                rules={[
                  { required: true, message: "Please enter your name" },
                  {
                    pattern: /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
                    message: "Enter valid full name (First and Last name)",
                  },
                ]}
              >
                <Input
                  size="middle"
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Preferred date"
                name="date"
                required
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  size="middle"
                  style={{ width: "100%" }}
                  value={date}
                  onChange={(d) => setDate(d)}
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone"
                name="phone"
                required
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  { pattern: /^[0-9]+$/, message: "Only digits are allowed" },
                  { len: 10, message: "Phone number must be 10 digits" },
                ]}
              >
                <Input
                  size="middle"
                  prefix={<PhoneOutlined />}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                  {
                    pattern: /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/,
                    message: "Email must be a valid Gmail address",
                  },
                ]}
                normalize={(value) => value?.trim()}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={`Address (${address.length}/200)`}
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          new Error("Please enter your address")
                        );
                      }
                      if (/^\s/.test(value)) {
                        return Promise.reject(
                          new Error("Address cannot start with a space")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  maxLength={200}
                  placeholder="Flat, street, landmark, city, postal code"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value.replace(/^\s+/, ""))
                  }
                  style={{ resize: "vertical" }}
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
                onClick={() =>
                  form.validateFields().then(() => setCurrentStep(1))
                }
                block
                style={styles.primaryBtn}
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
          <Text strong style={{ display: "block", marginBottom: 6 }}>
            Sub Category
          </Text>
          <Select
            value={state.subService ?? undefined}
            placeholder="Select sub‑service"
            style={{ width: "100%" }}
            options={SUBSERVICES[section]}
            onChange={(v) => setSection(section, "subService", v as string)}
            allowClear
          />
        </Col>

        <Col xs={24} md={12}>
          <Text strong style={{ display: "block", marginBottom: 6 }}>
            Sub Category Type
          </Text>
          <Select
            value={state.type ?? undefined}
            placeholder="Select cleaning type"
            style={{ width: "100%" }}
            onChange={(v) => setSection(section, "type", (v as CleanType) ?? null)}
            allowClear
            options={[
              {
                label: (
                  <Space size={6}>
                    <span>Normal</span>
                    <Tag color={ACCENT} style={styles.accentTag}>
                      +${PRICING.typeDelta.Normal}
                    </Tag>
                  </Space>
                ),
                value: "Normal",
              },
              {
                label: (
                  <Space size={6}>
                    <span>Deep Cleaning</span>
                    <Tag color={ACCENT} style={styles.accentTag}>
                      +${PRICING.typeDelta.Deep}
                    </Tag>
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
        style={styles.sectionCard}
        bodyStyle={styles.sectionBody}
        title={
          <Space size="small">
            {meta.icon}
            <Text strong style={{ fontSize: 16 }}>
              {meta.title}
            </Text>
          </Space>
        }
        extra={
          <Button
            size="small"
            type="text"
            onClick={() => resetSection(section)}
            icon={<ReloadOutlined />}
          >
            Clear
          </Button>
        }
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <CategoryRow section={section} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text type="secondary">Minimum cleaning hours</Text>
            <Tag color="gold">{PRICING.minHours} hours</Tag>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text type="secondary">Add‑on hours</Text>
            <Button
              type="link"
              size="small"
              onClick={() =>
                setAddonsOpen((o) => ({ ...o, [section]: !o[section] }))
              }
              style={{ padding: 0, height: "auto", color: ACCENT }}
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
                    style={active ? styles.accentTag : undefined}
                  >
                    +{h} hr (${h * PRICING.addOnPerHour})
                  </Tag.CheckableTag>
                );
              })}
            </Space>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text type="secondary">Section Total</Text>
            <Text strong>{usdFormatter(calcSectionTotal(section, state))}</Text>
          </div>
        </Space>
      </Card>
    );
  };

  const ServicesSelection = (
    <>
      <div style={styles.stepsWrap}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#14b8a6',
            },
          }}
        >
          <Steps
            current={1}
            items={[{ title: "Customer Details" }, { title: "Service Selection" }]}
            size="small"
            style={styles.stepsBar}
          />
        </ConfigProvider>
      </div>

      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <Space size="large" align="center">
            <Title level={3} style={{ margin: 0 }}>
              Select Service Category
            </Title>
            <Space>
              {/* <Text type="secondary">Master Category</Text> */}
              <Select
                style={{ minWidth: 220 }}
                value={master}
                options={MASTER_OPTIONS}
                onChange={(v) => setMaster(v as SectionKey)}
                suffixIcon={<AppstoreAddOutlined />}
              />
            </Space>
          </Space>
        </Col>
        <Col>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(0)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={styles.contentRow}>
        <Col xs={24} lg={16} style={styles.leftPane}>
          {sectionsToShow.includes("bedroom") && <SectionCard section="bedroom" />}
          {sectionsToShow.includes("bathroom") && <SectionCard section="bathroom" />}
          {sectionsToShow.includes("kitchen") && <SectionCard section="kitchen" />}
          {sectionsToShow.includes("living") && <SectionCard section="living" />}
        </Col>

        <Col xs={24} lg={8} style={{ height: "100%", minHeight: 0 }}>
          <Card
  bordered
  style={styles.rightCard}
  bodyStyle={styles.rightCardBody}
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
        setDiscount(0);
        setCustomerRequest(0);
        setDiscountPct(0);
        message.success("Selections cleared");
      }}
      style={{ borderRadius: 8, background: "#16a394", borderColor: "#16a394", color: "#fff" }}
    >
      Reset
    </Button>
  }
>
  {/* Scrollable content */}
  <div style={{ padding: 12, borderTop: "1px solid #f0f2f5", overflowY: "auto", flex: 1, minHeight: 0 }}>
    {(Object.keys(serviceForm) as SectionKey[])
      .map((k) => ({ section: k, plan: serviceForm[k] }))
      .filter(({ plan }) => plan.type || plan.subService || plan.addOnHours.length > 0)
      .map(({ section, plan }) => {
        const title = SECTION_META[section].title;
        const total = calcSectionTotal(section, plan);

        return (
        <div
  key={section}
  style={{
    border: "1px solid #eef2f7",
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.02)",
    padding: 10,
    marginBottom: 12,
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Text strong>{title}</Text>
    <Text strong>{usdFormatter(total)}</Text>
  </div>

  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
    {plan.type && (
      <Tag style={{ background: "#e6fffb", color: "#14b8a6", borderColor: "#14b8a6", margin: 0, padding: "2px 8px", borderRadius: 6 }}>
        {plan.type}
      </Tag>
    )}

    <Tag style={{ background: "#fff7e6", color: "#ad6800", borderColor: "#ffd666", margin: 0, padding: "2px 8px", borderRadius: 6 }}>
      {PRICING.minHours}h min
    </Tag>

    {Array.isArray(plan.addOnHours) && plan.addOnHours.map((h) => (
      <Tag
        key={`addon-${h}`}
        style={{ background: "#f6ffed", color: "#237804", borderColor: "#b7eb8f", margin: 0, padding: "2px 8px", borderRadius: 6 }}
      >
        +{h}h (${h * PRICING.addOnPerHour})
      </Tag>
    ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
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

    <div style={{ borderTop: "1px solid #f0f2f5", paddingTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text strong style={{ display: "block", marginBottom: 6 }}>
          Subtotal
        </Text>
        <Text strong>{usdFormatter(grandTotal)}</Text>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <Text strong style={{ display: "block", marginBottom: 6 }}>
            Customer Requested
          </Text>
          {/* <Text type="secondary">Auto-discount</Text>
        </div> */}
        <InputNumber
          style={{ width: "100%", textAlign: "right" }}
          min={0}
          value={customerRequest}
          onChange={(v) => setCustomerRequest((v as number) ?? 0)}
          formatter={usdFormatter as any}
          parser={usdParser as any}
          placeholder="$ 0"
          className="money-right"
        />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <Text strong>Discount</Text>
        <Text strong>{usdFormatter(discount)}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text strong>Discount %</Text>
        <Text strong>{`${discountPct}%`}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text strong>Discounted Total</Text>
        <Text strong>{usdFormatter(Math.max(grandTotal - discount, 0))}</Text>
      </div>
    </div>
  </div>

  {/* Sticky submit button inside card */}
  <div style={{ position: "sticky", bottom: 0, background: "#fff", padding: "8px 12px 12px 12px", borderTop: "1px solid #eef2f7", zIndex: 3 }}>
    <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit} block style={styles.primaryBtn}>
      Submit
    </Button>
  </div>
</Card>

        </Col>
      </Row>
    </>
  );

  return (
    <div style={{ padding: 12 }}>
      <div style={styles.pageWrap}>
        {currentStep === 0 ? (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {CustomerDetails}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {ServicesSelection}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;