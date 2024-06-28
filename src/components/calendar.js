import React, { useEffect, useState } from 'react';
import { Badge, Calendar, message, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faFlag } from '@fortawesome/free-solid-svg-icons';

const colors = [
  'pink', 'green', 'purple', 'blue', 'red', 'yellow', 'orange', 'cyan', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
];

const TaskCalendar = ({ apiUrl, userData }) => {
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Fetch data and filter tasks
  const fetchDataAndFilterTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;

      console.log('Tüm veriler:', allData); // Log all data to console

      // Filter tasks based on UserID and transform tasks into a usable format
      const filteredUsers = allData.filter(item => item.UserID === userData.UserID);
      const tasksWithDates = filteredUsers.map(user => {
        const [startDate, endDate] = user.Date.split(' / ').map(date => moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'));

        // Process subtasks if available
        const subtasks = user.SubTask ? user.SubTask.split(',').map(subtask => subtask.trim()) : [];
        return {
          task: user.Task,
          startDate,
          endDate,
          subtasks,
        };
      });

      setTodos(tasksWithDates);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error(`Veriler alınamadı. Lütfen daha sonra tekrar deneyin. Hata: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDataAndFilterTasks();
  }, []);

  // Handle modal open
  const handleModalOpen = (task) => {
    setModalContent(task);
    setModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // Function to group tasks by date
  const groupTasksByDate = () => {
    const groupedTasks = {};
    todos.forEach(task => {
      const startDate = moment(task.startDate);
      const endDate = moment(task.endDate);

      for (let date = startDate; date.isSameOrBefore(endDate, 'day'); date.add(1, 'day')) {
        const formattedDate = date.format('YYYY-MM-DD');
        if (!groupedTasks[formattedDate]) {
          groupedTasks[formattedDate] = [];
        }
        groupedTasks[formattedDate].push(task);
      }
    });
    return groupedTasks;
  };

  // Render tasks on calendar
  const renderTasksOnCalendar = (value) => {
    const groupedTasks = groupTasksByDate();

    const date = value.format('YYYY-MM-DD');
    const tasksForDate = groupedTasks[date] || [];

    return (
      <ul style={{ padding: 0 }}>
        {tasksForDate.map((task, index) => (
          <li key={index} style={{ marginBottom: 4 }}>
            <div onClick={() => handleModalOpen(task)}>
              <Badge color={colors[index % colors.length]} text={task.task} />
              {task.subtasks && task.subtasks.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {task.subtasks.map((subtask, subIndex) => (
                    <Badge
                      key={subIndex}
                      color={colors[index % colors.length]}
                      text={subtask}
                      style={{ marginLeft: 8 }}
                    />
                  ))}
                </div>
              )}
              {moment(task.startDate).isSame(moment(date), 'day') && (
                <span style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              )}
              {moment(task.endDate).isSame(moment(date), 'day') && (
                <span style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
                  <FontAwesomeIcon icon={faFlag} />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Calendar
        dateCellRender={renderTasksOnCalendar}
      />

      <Modal
        title="Görev Detayları"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <div>
          <h3>{modalContent.task}</h3>
          <p>Başlangıç Tarihi: {moment(modalContent.startDate).format('DD/MM/YYYY')}</p>
          <p>Bitiş Tarihi: {moment(modalContent.endDate).format('DD/MM/YYYY')}</p>
          {modalContent.subtasks && modalContent.subtasks.length > 0 && (
            <div>
              <h4>Alt Görevler:</h4>
              <ul>
                {modalContent.subtasks.map((subtask, idx) => (
                  <li key={idx}>{subtask}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TaskCalendar;
