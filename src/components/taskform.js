import React, { useState, useRef } from 'react';
import { Form, Input, Button, DatePicker, message, ConfigProvider } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const TaskForm = ({ userData, addTask, apiUrl }) => {
  const [value, setValue] = useState('');
  const [subtask, setSubTask] = useState('');
  const [user, setUser] = useState('');
  const [date, setDate] = useState(null);
  const formRef = useRef();


  const handleSubmit = async () => {
    if (value) {
      try {
        const response = await axios.get(apiUrl);
        const allData = response.data.data;
        const formattedDates = date && date.length === 2
          ? `${date[0].format('DD-MM-YYYY')} / ${date[1].format('DD-MM-YYYY')}`
          : null;

        const taskData = [
          [
            userData.Email,
            userData.Password,
            userData.User,
            userData.Telephone,
            userData.Address,
            userData.UserID,
            value,
            subtask,
            formattedDates,
          ]
        ];

        if (user) {
          const users = user.split(',').map(u => u.trim());
          const promises = users.map(async (singleUser) => {
            const filteredUser = allData.find(item => item.User === singleUser);

            if (!filteredUser) {
              throw new Error(`User ${singleUser} not found`);
            }

            const userTaskData = [
              [
                filteredUser.Email,
                filteredUser.Password,
                singleUser,
                filteredUser.Telephone,
                filteredUser.Address,
                filteredUser.UserID,
                value,
                subtask,
                formattedDates,
              ]
            ];
            
            message.loading("yükleniyor");

            // Simulating a network request
            
            await axios.post(apiUrl, userTaskData);
          });

          await Promise.all(promises);
        }

        await axios.post(apiUrl, taskData);

        // Reset form fields
        formRef.current.resetFields();
        message.success('Görev başarıyla eklendi.');
        // Add task to the state or perform any other action as needed
        addTask(value);

      } catch (error) {
        message.error('Görev eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        console.error('Görev eklenirken hata oluştu:', error);
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d11ba7',
          colorPrimaryHover: '#5b10b5',
          colorIcon: 'black'
        }
      }}
    >
      <Form onFinish={handleSubmit} ref={formRef} layout="inline">
        <Form.Item name="taskInput" style={{ flex: 1 }}>
          <Input
            name="görev"
            placeholder="Görev Ekleyin"
            size="large"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="subtaskInput" style={{ flex: 1 }}>
          <Input
            name="alt görev"
            placeholder="Alt Görev Ekleyin"
            size="large"
            value={subtask}
            onChange={(e) => setSubTask(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="userAddInput" style={{ flex: 1 }}>
          <Input
            name="Kişi"
            placeholder="Kişi Ekle"
            size="large"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="dateInput">
          <RangePicker
            placeholder={['Başlangıç', 'Bitiş']}
            size="large"
            value={date}
            format="DD-MM-YYYY"
            onChange={(date) => setDate(date)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            icon={<FileAddOutlined />}
            htmlType="submit"
            type="primary"
            size="large"
            style={{ marginBlockEnd: '20px', marginRight: '2px' }}
          >
            Ekle
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default TaskForm;
