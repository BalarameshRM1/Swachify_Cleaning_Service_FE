import React from 'react';


import { NotificationOutlined, UserOutlined, LogoutOutlined, CalendarOutlined, ScheduleOutlined, UsergroupAddOutlined, SettingOutlined,FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderBar from '../header/header';
import { getUserDetails } from '../../utils/helpers/storage';

const { Content, Sider } = Layout;

const MenuItems: any = [
  { menuIcon: UserOutlined, label: 'Dashboard' },
  { menuIcon: NotificationOutlined, label: 'Services' },
  { menuIcon: CalendarOutlined, label: 'Bookings' },
  { menuIcon: ScheduleOutlined, label: 'Tickets' },
  { menuIcon: UsergroupAddOutlined, label: 'Employees' },
   { menuIcon: FileTextOutlined, label: 'MIS-Reports' },
  { menuIcon: SettingOutlined, label: 'Settings' },
  { menuIcon: LogoutOutlined, label: 'Logout' },
];

const MenuItemsEmp: any = [
  { menuIcon: UserOutlined, label: 'Dashboard' },
  { menuIcon: ScheduleOutlined, label: 'Tickets' },
  { menuIcon: SettingOutlined, label: 'Settings' },
  { menuIcon: LogoutOutlined, label: 'Logout' },
];

const LayoutComponent: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userDetails, setUserDetails] = React.useState<any>(null);  
  const [collapsed, setCollapsed] = React.useState(false);


  React.useEffect(() => {
    const userData = getUserDetails('user');
    setUserDetails(userData);
  }, []);

  const navigate = useNavigate();

  const MenuData = (menu:any) => menu.map((ele: any) => {
    return {
      key: ele.label,
      icon: React.createElement(ele.menuIcon),
      label: ele.label,
      children:
        ele?.subMenu?.length > 0 &&
        ele?.subMenu.map((s: any) => {
          return {
            key: s.label,
            label: s.label,
          };
        }),
    };
  }); 

  const items2: MenuProps['items'] = userDetails?.role_id === 3 ?  MenuData(MenuItemsEmp) : MenuData(MenuItems)

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'Dashboard') navigate('/app/dashboard');
    if (e.key === 'Employees') navigate('/app/employees');
    if (e.key === 'Settings') navigate('/app/settings');
    if (e.key === 'Services') navigate('/app/services');
    if (e.key === 'Bookings') navigate('/app/bookings');
    if (e.key === 'Tickets') navigate('/app/Tickets');
     if (e.key === 'MIS-Reports') navigate('/app/reports');

    if (e.key === 'Logout') {
      localStorage.removeItem('user');
      navigate('/landing');
    }
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <HeaderBar />
      <Layout>
       <Sider
  collapsible
  collapsed={collapsed}
  onCollapse={(value) => setCollapsed(value)}
  width={200}
  style={{
    background: colorBgContainer, 
    transition: 'all 0.3s ease',
  }}
  theme="light"
>



          <Menu
            mode="inline"
            defaultSelectedKeys={['Dashboard']}
            onClick={onClick}
            style={{ height: '100%', borderInlineEnd: 0 }}
            items={items2}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }}>
        
          <Content
            style={{
              padding: 24,
              margin: 0,
              borderRadius: borderRadiusLG,
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;