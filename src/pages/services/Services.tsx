import React, { useMemo, useRef, useState, useEffect } from "react";
import { Checkbox } from "antd";
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
import { createBooking, getAllMasterData, getAllDepartments } from "../../app/services/auth.ts";
import { getUserDetails } from "../../utils/helpers/storage.ts";
import "./Services.css";

const { Title, Text } = Typography;

type CleanType = "Normal" | "Deep";
type SectionKey = "bedroom" | "bathroom" | "kitchen" | "living";
type StepKey = 0 | 1;

interface ServiceType {
  serviceTypeID: number;
  serviceType: string;
  price: number;
  hours: number;
}

interface Service {
  serviceID: number;
  serviceName: string;
  serviceTypes: ServiceType[];
}

interface Department {
  departmentId: number;
  departmentName: string;
  services: Service[];
}

const PRICING = {
  base: { bedroom: 300, bathroom: 400, kitchen: 500, living: 350 } as Record<SectionKey, number>,
  typeDelta: { Normal: 0, Deep: 150 } as Record<CleanType, number>,
  addOnPerHour: 120,
  minHours: 3,
};
// const MAX_LEN = 10;

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
  actualPrice?: number; // Store the actual price from API
  serviceId?: number | null; // Store selected service ID
  serviceTypeId?: number | null; // Store selected service type ID
  roomSize?: string | null; // Store room size for this service
  isEmpty?: boolean
};
type FormState = Record<SectionKey, ServicePlan>;

const SECTION_META: Record<SectionKey, { icon: React.ReactNode; title: string }> = {
  bedroom: { icon: <HomeOutlined />, title: "Bedroom" },
  bathroom: { icon: <ApartmentOutlined />, title: "Bathroom" },
  kitchen: { icon: <AppstoreOutlined />, title: "Kitchen" },
  living: { icon: <BankOutlined />, title: "Living" },
};

const isActivePlan = (plan: ServicePlan) =>
  Boolean(plan?.serviceId || (plan?.addOnHours?.length ?? 0) > 0);
console.log(isActivePlan);

const calcSectionTotal = (section: SectionKey, plan: ServicePlan) => {
  if (!plan.serviceId) return 0;

  const base = PRICING.base[section];
const typeExtra = plan.actualPrice || 0;


  const addonHours = plan.addOnHours?.reduce((sum, h) => sum + h, 0) ?? 0;
  const addonCost = addonHours * PRICING.addOnPerHour;

  return base + typeExtra + addonCost;
};





const usdFormatter = (value?: string | number) => {
  if (value === undefined || value === null) return "";
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return "";
  return `$ ${n}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Services: React.FC = () => {
  const [form] = Form.useForm();
  // const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  const anchors = {
    bedroom: useRef<HTMLDivElement>(null),
    bathroom: useRef<HTMLDivElement>(null),
    kitchen: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
  };

  const [currentStep, setCurrentStep] = useState<StepKey>(0);
  const [master, setMaster] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
//  const formValues = Form.useWatch([], form);
const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
        if (data && data.length > 0) {
          setMaster(null);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepartments();
  }, []);

 



  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(null);
  const [setSubServiceOptions] = useState<any>({});
  const [globalServiceType, setGlobalServiceType] = useState<number | null>(null); 
  const [withBasement, setWithBasement] = useState(false);

  const [serviceForm, setServiceForm] = useState<FormState>({
    bedroom: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
    bathroom: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
    kitchen: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
    living: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
  });

  const [addonsOpen, setAddonsOpen] = useState<Record<SectionKey, boolean>>({
    bedroom: false,
    bathroom: false,
    kitchen: false,
    living: false,
  });

  const [customerRequest, setCustomerRequest] = useState<number|null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);
  

  const navigate = useNavigate();

  // Update selected department when master changes
  useEffect(() => {
    if (master !== null) {
      const dept = departments.find((d) => d.departmentId === master);
      setSelectedDepartment(dept || null);
    }
  }, [master, departments]);

  const setSection = <K extends keyof ServicePlan>(
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
    [section]: {
      subService: null,
      type: null,
      addOnHours: [],
      actualPrice: 0,
      serviceId: null,
      serviceTypeId: null,
      roomSize: null,
      isEmpty: true,   
    },
  }));

  const toggleAddOn = (section: SectionKey, hours: number) =>
    setServiceForm((prev) => {
      const cur = prev[section].addOnHours || [];
      const has = cur.includes(hours);
      const next = has ? cur.filter((h) => h !== hours) : [...cur, hours];
      setAddonsOpen((o) => ({ ...o, [section]: true }));
      return { ...prev, [section]: { ...prev[section], addOnHours: next } };
    });

  // Map department ID to section key for display - FIXED
  const getSectionKeyFromDeptId = (deptId: number): SectionKey => {
    const dept = departments.find(d => d.departmentId === deptId);
    if (!dept) return "bedroom";
    
    // Match based on department name
    const deptNameLower = dept.departmentName.toLowerCase();
    if (deptNameLower.includes("bedroom") || deptNameLower.includes("bed")) return "bedroom";
    if (deptNameLower.includes("bathroom") || deptNameLower.includes("bath")) return "bathroom";
    if (deptNameLower.includes("kitchen")) return "kitchen";
    if (deptNameLower.includes("living")) return "living";
    
    return "bedroom"; // default fallback
  };

  const currentSectionKey = master !== null ? getSectionKeyFromDeptId(master) : "bedroom";
  const sectionsToShow: SectionKey[] = [currentSectionKey];

  const grandTotal = useMemo(
    () =>
      (Object.keys(serviceForm) as SectionKey[]).reduce(
        (sum, s) => sum + calcSectionTotal(s, serviceForm[s]),
        0
      ),
    [serviceForm]
  );

  const hasService = useMemo(
    () =>
      Object.values(serviceForm).some(
        (plan) => plan.serviceId || (plan.addOnHours?.length ?? 0) > 0
      ),
    [serviceForm]
  );

  const subtotal = grandTotal;
  const willingToPay = Math.max(0, customerRequest || 0);

  // Discount is the difference between subtotal and what customer wants to pay
  const discountAmount = useMemo(() => {
    if (!hasService || subtotal <= 0 || willingToPay <= 0) return 0;
    // Only apply discount if customer requested amount is less than subtotal
    if (willingToPay >= subtotal) return 0;
    return subtotal - willingToPay;
  }, [hasService, subtotal, willingToPay]);

  const discountPct = useMemo(() => {
    if (!hasService || subtotal <= 0 || discountAmount <= 0) return 0;
    return Math.round((discountAmount / subtotal) * 100);
  }, [hasService, subtotal, discountAmount]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        const data = await getAllMasterData();
        console.log("Fetched Master Data:", data);

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
      } catch (err) {
        console.error("Error loading master data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);
  useEffect(() => {
  if (customerRequest !== null) {
    if (customerRequest > subtotal) {
      setCustomerError("Please enter amount less than total");
    } else {
      setCustomerError(null);
    }
  }
}, [subtotal]);


  // Final total is what customer requested to pay (after discount)
  // If no customer request, show full subtotal
  const discountedTotal = useMemo(() => {
    if (!hasService || subtotal <= 0) return 0;
    // If customer requested amount is provided and valid, use it
    if (willingToPay > 0 && willingToPay < subtotal) return willingToPay;
    // If customer requested more than or equal to subtotal, use subtotal
    if (willingToPay >= subtotal) return subtotal;
    // If no customer request, return subtotal
    return subtotal;
  }, [hasService, subtotal, willingToPay]);

  // const changeStep = async (idx: StepKey) => {
  //   if (!customerData) {
  //     message.warning("Please fill customer details first.");
  //     setCurrentStep(currentStep as StepKey);
  //   } else {
  //     setCurrentStep(idx as StepKey);
  //   }
  // };

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

      
// if (willingToPay > subtotal) {
//   message.warning('Please enter amount less than total');
//   setLoading(false);
//   return;
// }


      const { fullName, phone, email, address, date } = customerInfo;
      if (!fullName || !phone || !email || !address || !date) {
        message.error("Missing customer details. Please go back to Step 1.");
        setCurrentStep(0);
        setLoading(false);
        return;
      }

//       const discountedTotal = useMemo(() => {
//   if (!hasService || subtotal <= 0) return 0;
//   const capped = Math.min(willingToPay || 0, subtotal);
//   return capped > 0 ? capped : subtotal;
// }, [hasService, subtotal, willingToPay]);


      if (!hasService) {
        message.warning("Please select at least one service before submitting.");
        console.log("selected service",selectedService);
        console.log("selected service",selectedServiceType);
        console.log("selected service",setSection);
        setLoading(false);
        return;
      }

      if (!globalServiceType) {
        message.error("Please select a service type for all services.");
        setLoading(false);
        return;
      }

      // Build services array from serviceForm - now using global service type
      const services = (Object.keys(serviceForm) as SectionKey[])
        .filter((key) => {
          const s = serviceForm[key];
          return s.serviceId; // Only include if service is selected
        })
        .map((key) => {
          const s = serviceForm[key];
          
          // Find the department ID for this section
          const dept = departments.find(d => 
            d.departmentName.toLowerCase().includes(key)
          );
          
          return {
            deptId: dept?.departmentId ?? 0,
            serviceId: s.serviceId ?? 0,
            serviceTypeId: globalServiceType, // Use global service type
          };
        })
        .filter(s => s.deptId !== 0 && s.serviceId !== 0 && s.serviceTypeId !== 0);

      if (services.length === 0) {
        message.error("Please select at least one service.");
        setLoading(false);
        return;
      }

      // Calculate total room size from all selected services
      const totalRoomSize = (Object.keys(serviceForm) as SectionKey[])
        .filter(key => serviceForm[key].serviceId)
        .reduce((total, key) => {
          const size = serviceForm[key].roomSize;
          return total + (size ? Number(size) : 0);
        }, 0);

      const payload = {
        id: 0,
        bookingId: `BOOK-${Date.now()}`,
        slotId: 1,
        createdBy: user?.id || 1,
        createdDate: new Date().toISOString(),
        modifiedBy: user?.id || 1,
        modifiedDate: new Date().toISOString(),
        isActive: true,
        preferredDate: date.format ? date.format("YYYY-MM-DD") : dayjs(date).format("YYYY-MM-DD"),
        full_name: fullName,
        phone: phone,
        email: email,
        address: address,
        status_id: 1,
        total: discountedTotal,
        subtotal: subtotal,
        customer_requested_amount: willingToPay || 0,
        discount_amount: discountAmount,
        discount_percentage: discountPct,
        discount_total: discountedTotal,
        hours: PRICING.minHours,
        add_on_hours: Object.values(serviceForm).reduce((sum, plan) => 
          sum + (plan.addOnHours?.reduce((a, b) => a + b, 0) ?? 0), 0
        ),
        room_sqfts: String(totalRoomSize),
        with_basement: withBasement,

        services,
        is_regular: globalServiceType === 1,
        is_premium: globalServiceType === 2,
        is_ultimate: false,
      };

      console.log("Final Booking Payload:", payload);

      const response = await createBooking(payload);
      if (response?.status === 200 || response?.status === 201) {
        message.success("Booking created successfully!");
        form.resetFields();
        setCustomerData(null);
        setServiceForm({
          bedroom: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
          bathroom: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
          kitchen: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
          living: { subService: null, type: null, addOnHours: [], actualPrice: 0, serviceId: null, serviceTypeId: null, roomSize: null },
        });
        setAddonsOpen({
          bedroom: false,
          bathroom: false,
          kitchen: false,
          living: false,
        });
        setCustomerRequest(0);
        setGlobalServiceType(null);
        setCurrentStep(0);
        setSelectedService(null);
        setSelectedServiceType(null);
        setTimeout(() => {
          navigate("../bookings");
        }, 800);
      } else {
        message.error("Failed to create booking. Please try again.");
      }
    } catch (err: any) {
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
          // onChange={(idx) => changeStep(idx as StepKey)}
          items={[
            {
              title: (
                <span
                  style={{
                    color: currentStep === 0 ? "#14B8A6" : "#14B8A68c",
                    fontWeight: currentStep === 0 ? 700 : 500,
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
                    color: currentStep === 1 ? "#14B8A6" : "#14B8A6",
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
        />
      </div>

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
  onFieldsChange={() => {
    const values = form.getFieldsValue();
    const hasErrors = form.getFieldsError().some(f => f.errors.length > 0);

    const allFilled =
      values.fullName &&
      values.phone &&
      values.email &&
      values.date &&
      values.address;

    setIsContinueDisabled(!(allFilled && !hasErrors));
  }}
>

          <Row gutter={[8, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your name" },
                  // {
                  //   pattern: /^[A-Za-z]{2,}\s[A-Za-z\s]{2,}$/,
                  //   // message: "Enter valid full name (First and Last name)",
                  // },
                ]}
              >
                 <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter full name"
                      maxLength={40}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 40);
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
    allowClear={false}
    inputReadOnly   // ⭐ THIS FIXES THE ISSUE
    getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
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
                    pattern: /^[0-9][0-9]{9}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                ]}
              >
               <Input
  prefix={<PhoneOutlined />}
  placeholder="9876543210"
  maxLength={10}
  inputMode="numeric"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();  
  }}
  onChange={(e) => {
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
                  {required:true, message:"please enter the address"}
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Flat, street, landmark, city, postal code"
                  maxLength={200}
                  style={{ resize: "none" }}
                  
                  
                  onChange={(e) => {
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
    const sectionState = serviceForm[section];
    const [tempRoomSize, setTempRoomSize] = useState(sectionState.roomSize || "");

useEffect(() => {
  setTempRoomSize(sectionState.roomSize || "");
}, [sectionState.roomSize]);
    
    return (
      <div>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24}>
            <Text strong className="sv-block sv-mb-6">
              Select Service
            </Text>
            <Select
              placeholder="Select Service"
              style={{ width: "100%" }}
              disabled={!selectedDepartment}
              value={sectionState.serviceId}
              onChange={(value) => {
  const service = selectedDepartment?.services.find(s => s.serviceID === value);

  // find global service type details
  const selectedType = globalServiceType
    ? service?.serviceTypes.find(st => st.serviceTypeID === globalServiceType)
    : null;

  setServiceForm((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      serviceId: value,

      // RESET old values
      subService: null,
      roomSize: null,
      addOnHours: [],

      // APPLY global service type (if selected)
      serviceTypeId: globalServiceType || null,
      type: selectedType?.serviceType || null,
      actualPrice: selectedType?.price || 0,
    },
  }));
}}

              options={
                selectedDepartment?.services.map((srv) => ({
                  label: srv.serviceName,
                  value: srv.serviceID,
                })) || []
              }
            />
          </Col>
          
          <Col xs={24}>
            <Text strong className="sv-block sv-mb-6">
              Room Size (sq ft)
            </Text>

               
          <Input
  style={{ width: "100%" }}
  placeholder="Enter room size"
  inputMode="numeric"
  value={tempRoomSize}
  onChange={(e) => {
    const clean = e.target.value.replace(/[^\d]/g, "");
    setTempRoomSize(clean); // ✅ update local state only
  }}
  onBlur={() => {
    // ✅ commit to global state when user leaves input
    setServiceForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        roomSize: tempRoomSize,
      },
    }));
  }}
  maxLength={6}
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
    <Text strong className="sv-title-16">
      {serviceForm[section].serviceId ? meta.title : "Select Service"}
      
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
        <Col>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(0)}>
            Back
          </Button>
        </Col>

        <Col flex="auto" className="sv-toolbar-end">
          <div className="sv-inline-end">
            <Title level={3} className="sv-m-0 sv-ellipsis">
              Select Service Category
            </Title>
            <Select
              className="sv-master-select"
              value={master || undefined}
              options={departments.map((dept) => ({
                label: dept.departmentName,
                value: dept.departmentId,
              }))}
              placeholder="Select Service"
              suffixIcon={<AppstoreAddOutlined />}
              style={{ width: 220 }}
             onChange={(v) => {
  if (!customerData) {
    message.warning("Please fill customer details first.");
    return;
  }

  const selectedDept = departments.find((d) => d.departmentId === Number(v));
  setSelectedDepartment(selectedDept || null);
  setMaster(v);

  const section = getSectionKeyFromDeptId(v);
  const firstService = selectedDept?.services?.[0];

  if (firstService) {
  const selectedType = globalServiceType
    ? firstService.serviceTypes.find(st => st.serviceTypeID === globalServiceType)
    : null;

  setServiceForm((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      serviceId: firstService.serviceID,

      // Reset old values
      subService: null,
      roomSize: null,
      addOnHours: [],

      // Apply global service type (if any)
      serviceTypeId: globalServiceType || null,
      type: selectedType?.serviceType || null,
      actualPrice: selectedType?.price || 0,
    },
  }));
}

}}

            />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="sv-content-row">
        <Col xs={24} lg={16} className="sv-left-pane">
          {sectionsToShow.map((section) => (
            <SectionCard key={section} section={section} />
          ))}
        </Col>

        <Col xs={24} lg={8} className="sv-right-pane">
          <Card
            bordered
            className="sv-right-card"
            bodyStyle={{
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
            }}
            title={<Text strong>Selection Summary</Text>}
            extra={
              <Button
                size="small"
                type="primary"
                ghost
                icon={<ReloadOutlined />}
                onClick={() => {
                  (["bedroom", "bathroom", "kitchen", "living"] as SectionKey[]).forEach((k) =>
                    resetSection(k)
                  );
                  setAddonsOpen({ bedroom: false, bathroom: false, kitchen: false, living: false });
                  setCustomerRequest(0);
                  setSelectedService(null);
                  setSelectedServiceType(null);
                  setSelectedDepartment(null);
                  setMaster(null);
                  setGlobalServiceType(null);
                  setCustomerError(null);
                  message.success("Selections cleared");
                }}
                className="sv-reset-btn"
              >
                Reset
              </Button>
            }
          >
            <div className="sv-summary-items">
              {/* Global Service Type Selection */}
              <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong className="sv-block sv-mb-6">
                      Service Type (applies to all services)
                    </Text>
                    <Select
                      placeholder="Select Service Type"
                      style={{ width: "100%" }}
                       disabled={!master}
                      value={globalServiceType}
                      onChange={(value) => {
                        setGlobalServiceType(value);
                        // Update all sections with selected service types with the global type
                        const allServiceTypes = departments
                          .flatMap(d => d.services.flatMap(s => s.serviceTypes))
                          .find(st => st.serviceTypeID === value);
                        
                        if (allServiceTypes) {
                        setServiceForm(prev => {
  const updated: FormState = JSON.parse(JSON.stringify(prev));

  Object.keys(updated).forEach((key) => {
    const section = key as SectionKey;

    if (updated[section].serviceId) {
      updated[section].serviceTypeId = value;
      updated[section].type = allServiceTypes.serviceType as CleanType;

      
     updated[section].actualPrice = allServiceTypes.price;

    }
  });

  return updated;
});


                        }
                      }}
                      options={
                        departments.length > 0 && departments[0].services.length > 0
                          ? departments[0].services[0].serviceTypes.map((stype) => ({
                              label: `${stype.serviceType} - $${stype.price}`,
                              value: stype.serviceTypeID,
                            }))
                          : []
                      }
                    />
                     <div style={{ marginTop: 12 }}>
  <Checkbox
    checked={withBasement}
    onChange={(e) => setWithBasement(e.target.checked)}
  >
    With Basement
  </Checkbox>
</div>

                  </div>
                </Space>
              </div>

              {/* Service Selection Summary */}
              {(Object.keys(serviceForm) as SectionKey[])
                .map((k) => ({ section: k, plan: serviceForm[k] }))
                .filter(({ plan }) => plan.serviceId)
                .map(({ section, plan }) => {
                  const title = SECTION_META[section].title;
                  const total = calcSectionTotal(section, plan);
                  const subLabel = plan.subService
                    ? SUBSERVICES[section].find((s) => s.value === plan.subService)?.label ??
                      plan.subService
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
                              <Tag key={h} className="sv-accent-tag">
                                +{h}h
                              </Tag>
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
                                // Find the department ID that matches this section
                                const dept = departments.find(d => 
                                  d.departmentName.toLowerCase().includes(section)
                                );
                                if (dept) {
                                  setMaster(dept.departmentId);
                                  setTimeout(() => {
                                    anchors[section].current?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "nearest",
                                    });
                                  }, 0);
                                }
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
                    <Text strong>Customer Requested Amount $</Text>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
<InputNumber
  className="sv-money-input"
  min={0}
  value={customerRequest}      // show 0 by default
  placeholder="$0"
  onChange={(v) => {
    if (v === null || isNaN(v)) {
      setCustomerRequest(0);
      setCustomerError(null);
      return;
    }

    const numericValue = Number(v);

    if (numericValue > subtotal) {
      setCustomerError("Please enter amount less than total");
    } else {
      setCustomerError(null);
    }

    setCustomerRequest(numericValue);
  }}
  formatter={(value) => `${value}`}
  parser={(value) => {
    if (!value) return 0;
    const numeric = value.replace(/[^\d]/g, "");
    return numeric ? Number(numeric) : 0;
  }}
  controls={false}
  inputMode="numeric"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  }}
  onPaste={(e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^\d+$/.test(paste)) e.preventDefault();
  }}

  // ⭐ RESET TO $0 ON BLUR
  // onBlur={() => {
  //   setCustomerRequest(0);
  //   setCustomerError(null);
  // }}
/>


 

  
</div>

                  </div>
                </div>
                <div style={{ minHeight: 16, marginTop: 4 }}>
    {customerError && (
      <Text type="danger" style={{ fontSize: 12 }}>
        {customerError}
      </Text>
    )}
  </div>

                {discountAmount > 0 && (
                  <>
                    <div className="sv-flex-between sv-mt-8">
                      <Text strong>Discount Amount</Text>
                      <Text strong style={{ color: '#52c41a' }}>{usdFormatter(discountAmount)}</Text>
                    </div>
                    <div className="sv-flex-between">
                      <Text strong>Discount %</Text>
                      <Text strong style={{ color: '#52c41a' }}>{discountPct}%</Text>
                    </div>
                  </>
                )}
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div className="sv-flex-between" style={{ marginTop: 8 }}>
                  <Text strong style={{ fontSize: 16 }}>Final Total</Text>
                  <Text strong style={{ fontSize: 18, color: '#14B8A6' }}>
                    {hasService ? usdFormatter(discountedTotal) : "$ 0"}
                  </Text>
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
                disabled={!!customerError}
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