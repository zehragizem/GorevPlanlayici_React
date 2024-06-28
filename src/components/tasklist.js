import React, { useState } from "react";
import axios from 'axios';
import { Button, DatePicker, message, Popconfirm, ConfigProvider, Modal, Form, Input } from 'antd';
import { FileExcelOutlined, DownOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const TaskList = ({ task, deleteTask, userData, apiUrl }) => {
  const [subTask, setSubTask] = useState([]);
  const [showSubTask, setShowSubTask] = useState(false);
  const [clickedSubtaskIndex, setClickedSubtaskIndex] = useState(null);
  const [dateRanges, setDateRanges] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [taskDateRanges, setTaskDateRanges] = useState([]);
  const [form] = Form.useForm();

  const handleSubtaskClick = (index) => {
    setClickedSubtaskIndex(index);
  };


  const handleDateRangeChange = (index, dates) => {
    setDateRanges({
      ...dateRanges,
      [index]: dates,
    });
  };

  const handleDelete = async (task) => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const deletedData = allData.find(item => item.Task === task && item.UserID === userData.UserID);

      if (!deletedData) {
        throw new Error('Görev bulunamadı.');
      }
      deleteTask(task);
      const row_id = deletedData.row_id;

      await axios.delete(`${apiUrl}&row_id=${row_id}`);

      message.success('Görev başarıyla silindi.');

      console.log(deletedData.Task);
      console.log(task);

    } catch (error) {
      console.error('Görev silinirken hata oluştu:', error);
      message.error('Görev silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleItemClick = async (task) => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const filteredUsers = allData.filter(item => item.UserID === userData.UserID && item.Task === task);
      const subtasks = filteredUsers.flatMap(user => user.SubTask.split(',').map(SubTask => SubTask.trim()));
      setSubTask(subtasks);
      setShowSubTask(!showSubTask);
    } catch (error) {
      console.error('Alt görevler alınırken hata oluştu:', error);
      message.error('Alt görev bulunamadı!');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({ task: currentTask });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Önce mevcut verileri al
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      // Güncellenecek görevin row_id'sini bul
      const taskData = allData.find(item => item.Task === currentTask && item.UserID === userData.UserID);
      if (!taskData) {
        throw new Error('Güncellenecek görev bulunamadı.');
      }
      const row_id = taskData.row_id;
      const updatedData = { 
        row_id: row_id,
        Task: values.task
      };
      // Güncelleme isteği yap
      await axios.put(apiUrl, updatedData);
      message.success('Görev başarıyla güncellendi.');
      setIsModalVisible(false);
      setCurrentTask(values.task);
      setIsUpdateClicked(true);
    } catch (error) {
      console.error('Güncelleme işlemi sırasında bir hata oluştu:', error);
      message.error('Görev güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  
  const handleAddClick = async (index) => {
    if (dateRanges[index]) {
      const formattedDates = `${dateRanges[index][0].format('DD-MM-YYYY')} / ${dateRanges[index][1].format('DD-MM-YYYY')}`;
      const subtask = subTask[index];
      const newDateRanges = [...taskDateRanges, formattedDates]; // newDateRanges is an array
      await saveDateRangeToDatabase(currentTask, subtask, newDateRanges);
      setClickedSubtaskIndex(null);
    } else {
      message.error('Lütfen önce bir tarih aralığı seçin.');
    }
  };

  const saveDateRangeToDatabase = async (task, subtask, newDateRanges) => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const taskData = allData.find(item => item.Task === task && item.UserID === userData.UserID);

      if (!taskData) {
        throw new Error('Güncellenecek görev bulunamadı.');
      }

      const row_id = taskData.row_id;
      const updatedDates = newDateRanges.join(', '); // Ensure newDateRanges is an array

      const updatedData = { 
        row_id: row_id,
        SubTaskDateRanges: updatedDates // Modify according to your database schema
      };

      await axios.put(apiUrl, updatedData);
      setTaskDateRanges(newDateRanges);
      message.success('Tarih aralığı başarıyla kaydedildi.');
    } catch (error) {
      console.error('Tarih aralığı kaydedilirken hata oluştu:', error);
      message.error('Tarih aralığı kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d11ba7',
          colorPrimaryHover: '#5b10b5',
          colorIcon: 'black',
        },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <Button
            style={{ color: "black", marginRight: '10px', width: '750px' }}
            onClick={() => handleItemClick(task)}
          >
            {isUpdateClicked ? currentTask : task} {showSubTask ? <UpOutlined /> : <DownOutlined />}
          </Button>

          <Popconfirm
            title="Bu görevi silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(task)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              icon={<FileExcelOutlined />}
              type="primary"
              style={{ marginBlockEnd: "10px", width: "100px" }}
            >
              Sil
            </Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            type="primary"
            style={{ marginBlockEnd: "10px", marginLeft: "10px" }}
            onClick={showModal}
          >
            Düzenle
          </Button>
        </div>

        {showSubTask && (
          <div style={{ marginLeft: '20px' }}>
            {subTask.map((subtask, index) => (
              <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => handleSubtaskClick(index)}>{subtask}</Button>
                {clickedSubtaskIndex === index && (
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                    <RangePicker
                      placeholder={['Başlangıç', 'Bitiş']}
                      format="DD-MM-YYYY"
                      style={{ marginLeft: '10px' }}
                      onChange={(dates) => handleDateRangeChange(index, dates)}
                    />
                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => handleAddClick(index)}>
                      Ekle
                    </Button>
                  </div>
                )}
                {dateRanges[index] && (
                  <span style={{ marginLeft: '10px' }}>
                    {dateRanges[index][0].format('DD-MM-YYYY')} / {dateRanges[index][1].format('DD-MM-YYYY')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal title="Görev Düzenle" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="task_form">
          <Form.Item
            name="task"
            label="Görev"
            rules={[{message: 'Lütfen bir görev adı girin' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default TaskList;
