import React from 'react';

import { LaptopOutlined, NotificationOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Divider, Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


const { Header, Content, Sider } = Layout;

const MenuItems: any = [
    {
        menuIcon: UserOutlined, label: 'Dashboard',
    },
    // { menuIcon: LaptopOutlined, label: 'Employees' },
    { menuIcon: LaptopOutlined, label: 'Settings'},
    { menuIcon: NotificationOutlined, label: 'Services'},
    { menuIcon: LogoutOutlined, label: 'Logout'},
]

const LayoutComponent: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate()
    const location = useLocation()
    const items2: MenuProps['items'] = MenuItems.map(
        (ele: any) => {

            return {
                key: ele.label,
                icon: React.createElement(ele.menuIcon),
                label: ele.label,
                children: ele?.subMenu?.length > 0 && ele?.subMenu.map((ele: any) => {
                    return {
                        key: ele.label,
                        label: ele.label,
                    };
                })
            };
        },
    );

    const onClick: MenuProps["onClick"] = (e) => {
        if (e.key === "Dashboard") navigate("/app/dashboard");
        // if (e.key === "Employees") navigate("/app/employees");
        if (e.key === "Settings") navigate("/app/settings");
        if (e.key === "Services") navigate("/app/services");

        if( e.key === "Logout") {
            localStorage.removeItem('user')
            navigate('/landing')
        }
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        /> */}
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }} breakpoint="lg" collapsedWidth="0">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        // defaultOpenKeys={['sub1']}
                        onClick={onClick}
                        style={{ height: '100%', borderInlineEnd: 0 }}
                        items={items2}
                    />
                    {/* <Divider /> */}
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb
            items={[{ title: 'App' }, { title: location?.pathname?.split('/')[2] },]}
            style={{ margin: '16px 0' }}
          />
                    <div>
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;