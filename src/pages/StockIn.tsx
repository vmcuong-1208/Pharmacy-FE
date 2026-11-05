import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Typography,
  message,
  Divider,
  Row,
  Col,
  Table,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { createStockInApi, getStockInStatusApi } from "../api/stockIn";
import type {
  StockInItem,
  StockInPayload,
  TransactionStatus,
} from "../types/api";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FormItem extends StockInItem {
  key: string;
}

interface StockInFormValues {
  transaction_date?: dayjs.Dayjs;
  reason?: string;
  reference_number?: string;
  note?: string;
}

export default function StockIn() {
  const [form] = Form.useForm<StockInFormValues>();
  const [items, setItems] = useState<FormItem[]>([
    {
      key: "1",
      drug_id: "",
      unit_id: "",
      quantity: 1,
      batch_no: "",
      expiry_date: "",
      price: 0,
      manufacturer: { id: "", name: "", country: "VN" },
      gtin: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState<string>("");
  const [statusResult, setStatusResult] = useState<TransactionStatus | null>(
    null,
  );
  const [checkingStatus, setCheckingStatus] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: Date.now().toString(),
        drug_id: "",
        unit_id: "",
        quantity: 1,
        batch_no: "",
        expiry_date: "",
        price: 0,
        manufacturer: { id: "", name: "", country: "VN" },
        gtin: "",
      },
    ]);
  };

  const removeItem = (key: string) => {
    if (items.length === 1) {
      message.warning("Phải có ít nhất 1 dòng thuốc");
      return;
    }
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateItem = <K extends keyof FormItem>(
    key: string,
    field: K,
    value: FormItem[K],
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    );
  };

  const onFinish = async (values: StockInFormValues) => {
    if (items.length === 0) {
      message.error("Phải có ít nhất 1 dòng thuốc");
      return;
    }

    for (const item of items) {
      if (
        !item.drug_id ||
        !item.unit_id ||
        !item.batch_no ||
        !item.expiry_date
      ) {
        message.error("Vui lòng điền đầy đủ thông tin các dòng thuốc");
        return;
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        message.error("Số lượng phải là số nguyên dương (> 0)");
        return;
      }
      if (item.price < 0) {
        message.error("Đơn giá phải >= 0");
        return;
      }
      if (Number(item.price.toFixed(2)) !== item.price) {
        message.error("Đơn giá tối đa 2 chữ số thập phân");
        return;
      }
    }

    const payload: StockInPayload = {
      transaction_date: values.transaction_date
        ? values.transaction_date.toISOString()
        : dayjs().toISOString(),
      reason: values.reason || "supplier",
      reference_number: values.reference_number || "",
      note: values.note || "",
      items: items.map((item) => {
        const { key, ...rest } = item;
        void key;
        return {
          ...rest,
          quantity: Number(rest.quantity),
          price: Number(rest.price),
          expiry_date: rest.expiry_date,
        };
      }),
    };

    setLoading(true);
    try {
      const res = await createStockInApi(payload);
      message.success(
        `Gửi phiếu thành công! Transaction ID: ${res.transaction_id}`,
      );
      setTxnId(res.transaction_id);
      setStatusResult(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const msg =
        axiosError.response?.data?.error_description ||
        axiosError.response?.data?.message ||
        "Gửi phiếu thất bại";
      message.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!txnId) {
      message.warning("Chưa có Transaction ID");
      return;
    }
    setCheckingStatus(true);
    try {
      const res = await getStockInStatusApi(txnId);
      setStatusResult(res);
      message.success("Lấy trạng thái thành công");
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const msg =
        axiosError.response?.data?.error_description ||
        "Không lấy được trạng thái";
      message.error(msg);
    } finally {
      setCheckingStatus(false);
    }
  };

  const itemColumns = [
    {
      title: "Mã Thuốc",
      dataIndex: "drug_id",
      width: 120,
      render: (_: unknown, record: FormItem) => (
        <Input
          value={record.drug_id}
          placeholder="T001"
          onChange={(e) => updateItem(record.key, "drug_id", e.target.value)}
        />
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      width: 100,
      render: (_: unknown, record: FormItem) => (
        <Input
          value={record.unit_id}
          placeholder="U01"
          onChange={(e) => updateItem(record.key, "unit_id", e.target.value)}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 110,
      render: (_: unknown, record: FormItem) => (
        <InputNumber
          min={1}
          step={1}
          precision={0}
          value={record.quantity}
          style={{ width: "100%" }}
          onChange={(val) => updateItem(record.key, "quantity", val ?? 1)}
        />
      ),
    },
    {
      title: "Số Lô",
      dataIndex: "batch_no",
      width: 130,
      render: (_: unknown, record: FormItem) => (
        <Input
          value={record.batch_no}
          placeholder="LOT2025A"
          onChange={(e) => updateItem(record.key, "batch_no", e.target.value)}
        />
      ),
    },
    {
      title: "Hạn SD",
      dataIndex: "expiry_date",
      width: 140,
      render: (_: unknown, record: FormItem) => (
        <DatePicker
          style={{ width: "100%" }}
          value={record.expiry_date ? dayjs(record.expiry_date) : null}
          onChange={(_, dateString) =>
            updateItem(record.key, "expiry_date", dateString || "")
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      width: 130,
      render: (_: unknown, record: FormItem) => (
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          value={record.price}
          style={{ width: "100%" }}
          onChange={(val) => updateItem(record.key, "price", val ?? 0)}
        />
      ),
    },
    {
      title: "",
      width: 50,
      render: (_: unknown, record: FormItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <span>
            <SendOutlined /> 1. Tạo Phiếu Nhập Kho
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            reason: "supplier",
            transaction_date: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="transaction_date"
                label="Ngày nhập"
                rules={[{ required: true, message: "Chọn ngày nhập" }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reference_number"
                label="Số chứng từ"
                rules={[{ required: true, message: "Nhập số chứng từ" }]}
              >
                <Input placeholder="VD: PN-2025-001" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reason"
                label="Lý do nhập"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "supplier", label: "Nhập từ nhà cung cấp" },
                    { value: "opening-balance", label: "Nhập tồn đầu kỳ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={2} placeholder="Nhập hàng..." />
          </Form.Item>

          <Divider>Danh sách thuốc nhập</Divider>

          <Table
            dataSource={items}
            columns={itemColumns}
            pagination={false}
            rowKey="key"
            size="small"
            bordered
            style={{ marginBottom: 16 }}
          />

          <Button
            type="dashed"
            onClick={addItem}
            icon={<PlusOutlined />}
            style={{ marginBottom: 24 }}
          >
            Thêm dòng thuốc
          </Button>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SendOutlined />}
            >
              Gửi Phiếu Nhập Lên Cổng
            </Button>
          </div>
        </Form>
      </Card>

      <Card
        title={
          <span>
            <SearchOutlined /> 2. Đồng bộ & Xem trạng thái
          </span>
        }
        style={{ background: "#fafafa" }}
      >
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          Sau khi gửi thành công, Transaction ID sẽ tự động được điền vào ô
          dưới.
        </Text>

        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
          <Input
            addonBefore="Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Chưa có ID..."
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            loading={checkingStatus}
            onClick={checkStatus}
            icon={<SearchOutlined />}
          >
            Lấy Trạng Thái
          </Button>
        </Space.Compact>

        {statusResult && (
          <div>
            <Divider />
            <Title level={5}>Kết quả trả về:</Title>
            <pre
              style={{
                background: "#1e1e1e",
                color: "#d4d4d4",
                padding: 16,
                borderRadius: 8,
                overflow: "auto",
              }}
            >
              {JSON.stringify(statusResult, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}
