import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Grid } from "antd";
import {
  DashboardOutlined,
  ReadOutlined,
  MessageOutlined,
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  logout,
  selectCurrentUser,
} from "../redux/api/features/auth/authSlice";
import { useLogoutApiMutation } from "../redux/api/features/auth/authApi";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const studentItems = [
  { key: "/student", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/student/chat", icon: <MessageOutlined />, label: "Chat Tutor" },
  {
    key: "/student/roadmap",
    icon: <ReadOutlined />,
    label: "Generate Roadmap",
  },
  {
    key: "/student/roadmap/list",
    icon: <ReadOutlined />,
    label: "All Roadmap",
  },
  { key: "/student/progress", icon: <BarChartOutlined />, label: "Progress" },
  { key: "/profile", icon: <UserOutlined />, label: "Profile" },
];

const adminItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  {
    key: "/admin/students",
    icon: <TeamOutlined />,
    label: "Student Management",
  },
  { key: "/profile", icon: <UserOutlined />, label: "Profile" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [logoutApi] = useLogoutApiMutation();
  const screens = useBreakpoint();

  const items = user?.role === "admin" ? adminItems : studentItems;

  const selectedKey = useMemo(() => {
    const match = items
      .map((i) => i.key)
      .filter(
        (k) => location.pathname === k || location.pathname.startsWith(k + "/"),
      )
      .sort((a, b) => b.length - a.length)[0];
    return match || items[0].key;
  }, [location.pathname, items]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
    }
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  const userMenu: MenuProps = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "Profile" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Log out",
        danger: true,
      },
    ],
    onClick: ({ key }) => {
      if (key === "profile") navigate("/profile");
      if (key === "logout") handleLogout();
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={screens.xs ? 0 : 72}
        style={{ borderRight: "1px solid var(--border)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "20px 20px",
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: "nowrap",
            overflow: "hidden",
            color: "var(--text)",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "var(--accent)",
              flexShrink: 0,
            }}
          />
          {!collapsed && "AI Learning Coach"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: "transparent", borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            onClick={() => setCollapsed((c) => !c)}
            style={{ cursor: "pointer", fontSize: 18, color: "var(--muted)" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>

          <Dropdown menu={userMenu} trigger={["click"]}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {user?.name || "User"}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    color: "var(--muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
