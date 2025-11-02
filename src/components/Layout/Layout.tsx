import React from 'react';
import {
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  // PlusOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Modal, message, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HeaderBar from '../header/header';
import { getUserDetails } from '../../utils/helpers/storage';

const { Content, Sider } = Layout;
const { confirm } = Modal;

const MenuItems = [
  { menuIcon: UserOutlined, label: 'Dashboard', path: '/app/dashboard' },
  { menuIcon: NotificationOutlined, label: 'Services', path: '/app/services' },
  { menuIcon: CalendarOutlined, label: 'Bookings', path: '/app/bookings' },
  { menuIcon: ScheduleOutlined, label: 'Tickets', path: '/app/tickets' },
  { menuIcon: UsergroupAddOutlined, label: 'Employees', path: '/app/employees' },
  { menuIcon: FileTextOutlined, label: 'CMIS-Reports', path: '/app/reports' },
  // { menuIcon: PlusOutlined  , label: 'Create Service', path: '/app/master' },
  { menuIcon: SettingOutlined, label: 'Settings', path: '/app/settings' },
  { menuIcon: LogoutOutlined, label: 'Logout' },
];

const MenuItemsEmp = [
  { menuIcon: UserOutlined, label: 'Dashboard', path: '/app/dashboard' },
  { menuIcon: ScheduleOutlined, label: 'Tickets', path: '/app/tickets' },
  { menuIcon: SettingOutlined, label: 'Settings', path: '/app/settings' },
  { menuIcon: LogoutOutlined, label: 'Logout' },
];

const LayoutComponent: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [userDetails, setUserDetails] = React.useState<any>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const userData = getUserDetails('user');
    setUserDetails(userData);
  }, []);

  const menuData = (menu: any) => menu.map((ele: any) => ({
    key: ele.path || ele.label,
    icon: React.createElement(ele.menuIcon),
    label: ele.label
  }));

  const items = userDetails?.role_id === 3 ? menuData(MenuItemsEmp) : menuData(MenuItems);

  // **Logout modal same as header**
  const handleLogout = () => {
    confirm({
      title: 'Are you sure  do you want to log out?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      okType: 'default',
      okButtonProps: {
        style: { backgroundColor: 'rgb(20, 184, 166)', color: '#fff' },
      },
      cancelButtonProps: {
        style: { backgroundColor: 'rgb(20, 184, 166)', color: '#fff' },
      },
      onOk() {
        localStorage.removeItem('user');
        message.success('Logged out successfully!');
        navigate('/landing');
      },
      onCancel() {
        message.info('Logout cancelled');
      },
    });
  };

  const onClick = (e: any) => {
    if (e.key === 'Logout') {
      handleLogout();
      return; 
    }

    const selected = [...MenuItems, ...MenuItemsEmp].find(item => item.path === e.key);
    if (selected?.path) navigate(selected.path);
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <HeaderBar />
      <Layout>
       <Sider
  collapsible
  collapsed={collapsed}
  onCollapse={setCollapsed}
  trigger={null}
  width={200}
  style={{ background: colorBgContainer }}
>
<div style={{ padding: 10, textAlign: 'right' }}>
  <Button
    type="text"
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={() => setCollapsed(!collapsed)}
    style={{ fontSize: 18, color: '#000' }}
  />
</div>

          <Menu
  mode="inline"
  selectedKeys={[location.pathname]}
  onClick={onClick}
  style={{
    height: '100%',
    borderInlineEnd: 0,
    background: colorBgContainer,
  }}
  items={items}
  theme="light"
  inlineCollapsed={collapsed}
/>
        </Sider>
        <Layout style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }}>
          <Content style={{ padding: 24, margin: 0, borderRadius: borderRadiusLG, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
