import { useCallback, useEffect, useState } from "react";
import { Table, Card, Typography, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { getDrugsApi } from "../api/drugs";
import type { Drug } from "../types/api";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/api";

const { Title } = Typography;

export default function Drugs() {
  const [data, setData] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchDrugs = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const res = await getDrugsApi({ page, page_size: pageSize });
      setData(res.data || []);
      setPagination({
        current: res.page || page,
        pageSize: pageSize,
        total: res.total || 0,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const msg =
        axiosError.response?.data?.error_description ||
        axiosError.response?.data?.message ||
        "Không thể tải danh sách thuốc";
      message.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDrugs(1, 20);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchDrugs]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    void fetchDrugs(pag.current || 1, pag.pageSize || 20);
  };

  const columns: ColumnsType<Drug> = [
    {
      title: "Mã Thuốc",
      dataIndex: "id",
      key: "id",
      width: 140,
    },
    {
      title: "Tên Thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số Đăng Ký",
      dataIndex: "registration_number",
      key: "registration_number",
      width: 180,
      render: (text) => text || "—",
    },
  ];

  return (
    <Card>
      <Title level={4} style={{ marginBottom: 16 }}>
        Danh mục Thuốc
      </Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Tổng ${total} thuốc`,
        }}
        onChange={handleTableChange}
        bordered
        size="middle"
      />
    </Card>
  );
}
