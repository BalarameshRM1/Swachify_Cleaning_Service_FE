import React from "react";
import { Typography, Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import "./RefundPolicy.css";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout className="refund-layout">
      {/* ❌ Close Button */}
      <Button
        type="text"
        icon={<CloseOutlined className="refund-close-icon" />}
        onClick={() => navigate("/")}
        className="refund-close-btn"
      />

      {/* ✅ Main Content */}
      <Content className="refund-content">
        <Typography>
          <Title level={2} className="refund-title">
            Refund Policy
          </Title>

          <Paragraph>
            At <strong>Swachify Cleaning Service</strong>, customer satisfaction is our top
            priority. However, if you are not completely satisfied with our service, we will do our
            best to resolve the issue or process a refund as per the following policy.
          </Paragraph>

          <Title level={4}>1. Eligibility for Refund</Title>
          <Paragraph>
            Refunds may be provided under the following circumstances:
            <ul>
              <li>The service was not delivered as promised.</li>
              <li>The booking was cancelled within the allowed cancellation period.</li>
              <li>A verified service issue was reported within 24 hours of completion.</li>
            </ul>
          </Paragraph>

          <Title level={4}>2. Refund Process</Title>
          <Paragraph>
            To request a refund, please contact us at{" "}
            <a href="mailto:info@swachify.com">info@swachify.com</a> with your booking details.
            Our support team will review your request within 3–5 business days.
          </Paragraph>

          <Title level={4}>3. Refund Timeline</Title>
          <Paragraph>
            Once approved, refunds will be processed within 7–10 business days via the original
            payment method. Actual processing times may vary by bank or payment provider.
          </Paragraph>

          <Title level={4}>4. Non-Refundable Situations</Title>
          <Paragraph>
            Refunds will not be issued if:
            <ul>
              <li>The service was completed as per schedule.</li>
              <li>Incorrect or incomplete information was provided by the customer.</li>
              <li>The issue arises due to factors beyond our control.</li>
              <li>Cancellation is requested after the service has begun.</li>
            </ul>
          </Paragraph>

          <Title level={4}>5. Contact Us</Title>
          <Paragraph>
            For any refund-related queries, please reach out to us at{" "}
            <a href="mailto:info@swachify.com">info@swachify.com</a>.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default RefundPolicy;
