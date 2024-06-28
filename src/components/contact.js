import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, ConfigProvider, Modal, message, Select } from 'antd';
import "./contact.css";
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

function AppContact({ apiUrl }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const formRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = () => {
    setModalVisible(true);
    formRef.current.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
    openModal();
  };
  const sortedTasks = tasks.sort((a, b) => {
    const [aStart, aEnd] = a.date.split(' / ').map(date => new Date(date.split('-').reverse().join('-')));
    const [bStart, bEnd] = b.date.split(' / ').map(date => new Date(date.split('-').reverse().join('-')));
    return aStart - bStart || aEnd - bEnd;
  });
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const uniqueUsers = [];
      const userIdSet = new Set();

      allData.forEach(item => {
        if (!userIdSet.has(item.UserID)) {
          userIdSet.add(item.UserID);
          uniqueUsers.push({ UserID: item.UserID, User: item.User, Email: item.Email });
        }
      });

      setUsers(uniqueUsers);
      console.log(uniqueUsers);
    } catch (error) {
      console.error('Failed to fetch users', error);
      message.error('Kullanıcılar alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const fetchTasksForUser = async (userId) => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const filteredUsers = allData.filter(item => item.UserID === userId);
      const tasksWithSubtasks = filteredUsers.map(user => ({
        task: user.Task,
        date: user.Date,
        subtasks: user.SubTask ? user.SubTask.split(',').map(subtask => subtask.trim()) : [],
        subdate: user.SubTaskDateRanges ? user.SubTaskDateRanges.split(',').map(subtaskdate => subtaskdate.trim()) : []
      }));
      setTasks(tasksWithSubtasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      message.error('Veriler alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchTasksForUser(selectedUser.UserID);
    }
  }, [selectedUser]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d11ba7',
          colorPrimaryHover: '#5b10b5',
          colorText: "#d11ba7",
        },
      }}
    >
      <div id="contact" className="contact">
        <div className="contentHolder">
          <div>
            <div className="titleHolder">
              <h2>{selectedUser ? `${selectedUser.User} Görevleri` : 'Kullanıcı Seçiniz'}</h2>
            </div>
            <Select
              style={{ width: '100%', marginBottom: '20px',color:'white' }}
              placeholder="Kullanıcı Seçiniz"
              onChange={(userId) => {
                const user = users.find(user => user.UserID === userId);
                setSelectedUser(user);
                if (formRef.current) {
                  formRef.current.setFieldsValue({
                    email: user.Email,
                  });
                }
              }}
              dropdownClassName="custom-dropdown"
            >
              {users.map(user => (
                <Option key={user.UserID} value={user.UserID}>
                  <span style={{ color: '#5b10b5',fontWeight:'bold' }}>{user.User}</span>
                </Option>
              ))}
            </Select>
            {selectedUser && (
              <Form
                name="contact_form"
                className="contact-form"
                initialValues={{
                  remember: false,
                  email: selectedUser.Email,
                }}
                onFinish={onFinish}
                ref={formRef}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: 'email',
                          message: 'Please enter a valid E-mail address!',
                        },
                        {
                          required: true,
                          message: 'Please input E-mail address!',
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="to"
                      rules={[
                        {
                          type: 'email',
                          message: 'Please enter a valid E-mail address!',
                        },
                        {
                          required: true,
                          message: 'Please input E-mail address!',
                        },
                      ]}
                    >
                      <Input placeholder="Mail Yollanacak Adresi Yazın" />
                    </Form.Item>
                  </Col>
                </Row>
                <div>
                  {sortedTasks.map((taskObj, index) => (
                    <div key={index}>
                      <ul style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {taskObj.task}{" "}{taskObj.date}
                        {taskObj.subtasks.map((subtask, subIndex) => (
                          <li key={subIndex} style={{ fontWeight: "normal", fontSize: "14px" }}>
                            {subtask}{" "}{taskObj.subdate[subIndex]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  noStyle
                  rules={[
                    { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Yollamak için kabul etmelisiniz') },
                  ]}
                >
                  <Checkbox style={{ color: '#5b10b5' }}>Gönderdiğim verilerin doğruluğunu kabul ediyorum.</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType="submit" style={{ marginTop: '10px' }}>
                    Mail Gönder
                  </Button>
                </Form.Item>
              </Form>
            )}
            <Modal
              centered
              visible={isModalVisible}
              onCancel={closeModal}
              cancelText="Close"
              closable={false}
              cancelButtonProps={{ type: 'primary' }}
              okButtonProps={{ style: { display: 'none' } }}
              wrapClassName="backdrop-backdrop-filter"
            >
              {isModalVisible && <h2 style={{ textAlign: "center", color: "white" }}>Başarıyla Gönderildi!</h2>}
            </Modal>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default AppContact;
