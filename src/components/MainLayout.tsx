import { Layout, Menu, Button, Typography } from "antd";
import {
  MedicineBoxOutlined,
  ImportOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { removeToken } from "../utils/auth";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <MedicineBoxOutlined />,
      label: "Danh mục Thuốc",
    },
    {
      key: "/stock-in",
      icon: <ImportOutlined />,
      label: "Phiếu Nhập Kho",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" width={220}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            borderBottom: "1px solid #303030",
          }}
        >
          QUẢN LÝ DƯỢC
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 16px",
          }}
        >
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
            style={{ color: "#ff4d4f" }}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Text strong style={{ fontSize: 18 }}>
            {location.pathname === "/stock-in"
              ? "Phiếu Nhập Kho"
              : "Danh mục Thuốc"}
          </Text>
          <Text type="secondary">
            Xin chào, <strong>0318801153.00002</strong>
          </Text>
        </Header>
        <Content style={{ margin: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
