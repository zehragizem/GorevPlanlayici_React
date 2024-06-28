import React, { useState } from 'react';
import { Drawer, Button, Space, Avatar, ConfigProvider } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import DefaultPage from '../views/defaultPage';
import { useNavigate } from 'react-router-dom';
import AppContact from '../components/contact';
import TaskWrapper from '../services/taskwrapper';
import TaskCalendar from '../components/calendar';
import Profile from '../components/profile';
import TimeLine from '../components/timeline';
const Draw = ({ userData, itemsList,apiUrl}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item.key);
  };

  const navigate = useNavigate();

  const onLogout = () => {
    navigate(-1); // Çıkış yap veya bir önceki sayfaya geri dön
  };

  // Seçilen öğeye göre hangi bileşeni göstereceğimizi belirleyen fonksiyon
  const renderComponent = () => {
    switch (selectedItem) {
      case 'task':
        return <TaskWrapper userData={userData} apiUrl={apiUrl} />

      case 'mail':
        return <AppContact userData={userData} apiUrl={apiUrl}></AppContact>
      case 'calendar':
        return <TaskCalendar userData={userData} apiUrl={apiUrl}></TaskCalendar>
      
      case 'profile':
        return <Profile userData={userData}></Profile>
        case 'timeline':
          return <TimeLine userData={userData} apiUrl={apiUrl}></TimeLine>
      default:
        return <DefaultPage userData={userData} />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "#d11ba7"
        }
      }}
    >
      <Drawer
      width={300}
        title={
          <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}>
            <Avatar size="large" icon={<UserOutlined />} />
            <span style={{ marginLeft: '10px', fontSize: '20px', fontWeight: 'bold' }}>
              {userData.User}
            </span>
          </div>
        }
        placement="left"
        mask={false}
        closable={false}
        onClose={() => { }} // Kapatma işlemi olmadığı için boş fonksiyon
        open={true} // Drawer'ı her zaman açık tut
      >
        <Space direction="vertical" style={{ width: '100%' }} align='start'>
          {itemsList.map((item) => (
            <Button
              key={item.key}
              type="text"
              icon={item.icon}
              style={{
                width: '100%',
                textAlign: 'left',
                fontSize: '16px',
              }}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </Button>
          ))}
          <Button
            key="logout"
            type="text"
            icon={<PoweroffOutlined />}
            style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}
            onClick={onLogout}
          >
            Çıkış
          </Button>
        </Space>
      </Drawer>
      <div style={{ marginLeft: '300px', padding: '20px' }}>
        {renderComponent()}
      </div>
    </ConfigProvider>
  );
};

export default Draw;
