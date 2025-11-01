import  { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Space,
  
} from "antd";
import { EditOutlined } from "@ant-design/icons";

//import { getAllMasterData } from "../../app/services/auth";
import { getAllMasterData, createMasterData,updateMasterData } from "../../app/services/auth";

const { Option } = Select;

const MasterScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchMasterData = async () => {
  setLoading(true);
  try {
    const masterData = await getAllMasterData();

    // Safely handle structure whether it has .departments or is directly an array
    const departments = Array.isArray(masterData)
      ? masterData
      : masterData?.departments || [];

    const flattenedData = departments.flatMap((dept: any) =>
      (dept.services || []).flatMap((service: any) =>
        (service.serviceTypes || []).map((stype: any) => ({
          id: `${dept.departmentId}-${service.serviceID}-${stype.serviceTypeID}`,
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          serviceId: service.serviceID,
          serviceName: service.serviceName,
          serviceTypeId: stype.serviceTypeID,
          serviceType: stype.serviceType,
          price: stype.price,
          hours: stype.hours,
        }))
      )
    );

    setData(flattenedData);
  } catch (error) {
    console.error("Error fetching master data:", error);
    message.error("Failed to load master data");
  } finally {
    setLoading(false);
  }
};






  useEffect(() => {
    fetchMasterData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };
   const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      departmentId:record.departmentId,
      department_name: record.departmentName,
      serviceId:record.serviceId,
      sub_category: record.serviceName,
      serviceTypeId:record.serviceTypeId,
      cleaning_type: record.serviceType,
      price: record.price,  
    });
    setModalOpen(true);
  };

   const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        
        department_name: values.department_name,
        service_name: values.sub_category,
        service_type_name: values.cleaning_type,
        price: values.price,
      };

      if (editingRecord) {
        // 🧩 Update existing record with ID
         const Updatepayload = {
            departmentId:values.departmentId,
        department_name: values.department_name,
        service_name: values.sub_category,
        serviceId:values.serviceId,
        service_type_name: values.cleaning_type,
        serviceTypeId:values.serviceTypeId,
        price: values.price,
      };
        await updateMasterData(editingRecord.id, Updatepayload);
        message.success("Master data updated successfully");
      } else {
        // 🆕 Create new record
        await createMasterData(payload);
        message.success("Master data created successfully");
      }

      setModalOpen(false);
      fetchMasterData();
    } catch (error) {
      console.error("Error saving master data:", error);
      message.error("Failed to save data");
    }
  };

  const columns = [
  {
    title: "Department",
    dataIndex: "departmentName",
    key: "departmentName",
  },
  {
    title: "Service",
    dataIndex: "serviceName",
    key: "serviceName",
  },
  {
    title: "Service Type",
    dataIndex: "serviceType",
    key: "serviceType",
  },
  {
    title: "Price (₹)",
    dataIndex: "price",
    key: "price",
  },
 
  
  {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {/* <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            // 🧱 Dummy delete button, no logic yet
          >
            Delete
          </Button> */}
        </Space>
      ),
    },
];


  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd}>
          + Add Service 
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
         scroll={{ x: "max-content", y: 300 }}
      />

      <Modal
        title="Add Master Data"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="department_name"
            label="Department"
            rules={[{ required: true, message: "Please enter department" }]}
          >
            <Input placeholder="e.g. Bedroom, Kitchen, Bathroom" />
          </Form.Item>

          <Form.Item
            name="sub_category"
            label="Sub Category"
            rules={[{ required: true, message: "Please enter subcategory" }]}
          >
            <Input placeholder="e.g. Floor Cleaning, Window Cleaning" />
          </Form.Item>

          <Form.Item
            name="cleaning_type"
            label="Cleaning Type"
            rules={[{ required: true, message: "Please select cleaning type" }]}
          >
            <Select placeholder="Select Type">
              <Option value="Normal">Normal Cleaning</Option>
              <Option value="Deep">Deep Cleaning</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (₹)"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter price"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MasterScreen;
