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

const { Option } = Select;

const MasterScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://swachifyapi-fpcub9f8dcgjbzcq.centralindia-01.azurewebsites.net/api/Master/getallmasterData"
      );
      const result = await res.json();
      setData(result || []);
    } catch (error) {
      console.error("Failed to fetch master data", error);
      message.error("Failed to load data");
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const res = await fetch(
        "https://swachifyapi-fpcub9f8dcgjbzcq.centralindia-01.azurewebsites.net/api/Master/createMaster",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error("Failed to create master record");

      message.success("Master data added successfully");
      setModalOpen(false);
      fetchMasterData();
    } catch (error) {
      console.error("Error adding master data:", error);
      message.error("Failed to save data");
    }
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
    },
    {
      title: "Sub Category",
      dataIndex: "sub_category",
      key: "sub_category",
    },
    {
      title: "Cleaning Type",
      dataIndex: "cleaning_type",
      key: "cleaning_type",
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          + Add Master Data
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
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
