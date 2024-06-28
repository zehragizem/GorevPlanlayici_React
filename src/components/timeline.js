import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, ConfigProvider, Modal, message, Timeline } from 'antd';
import axios from 'axios';


const TimeLine = ({ userData, apiUrl }) => {


  const [tasks, setTasks] = useState([]);

  const sortedTasks = tasks.sort((a, b) => {
    const [aStart, aEnd] = a.date.split(' / ').map(date => new Date(date.split('-').reverse().join('-')));
    const [bStart, bEnd] = b.date.split(' / ').map(date => new Date(date.split('-').reverse().join('-')));
    return aStart - bStart || aEnd - bEnd;
  });


  const fetchDataAndFilterTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;
      const filteredUsers = allData.filter(item => item.UserID === userData.UserID);
      const tasksWithSubtasks = filteredUsers.map(user => ({
        task: user.Task,
        date: user.Date,
        subtasks: user.SubTask ? user.SubTask.split(',').map(subtask => subtask.trim()) : [],
        subdate: user.SubTaskDateRanges ? user.SubTaskDateRanges.split(',').map(subtaskdate => subtaskdate.trim()) : []
      }));
      
      setTasks(tasksWithSubtasks);
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('Veriler alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  useEffect(() => {
    fetchDataAndFilterTasks();
  }, []);

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
              <h2>{userData.User} Görev Zaman Çizelgesi</h2>
            </div>
            <div style={{ maxHeight: '700px' }}>
              <Timeline mode="alternate">
                {sortedTasks.map((taskObj, index) => (
                  <Timeline.Items key={index}>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>{taskObj.task}</p>
                    <p>{taskObj.date}</p>
                    
                    <div style={{ listStyleType: 'none', padding: 0 }}>
                      {taskObj.subtasks.map((subtask, subIndex) => (
                        <ul key={subIndex} style={{ display: 'flex', gap: '20px', fontWeight: 'normal', fontSize: '14px' }}>
                          <li>{subtask}{" "}{taskObj.subdate[subIndex]}</li>
                          
                        </ul>
                      ))}
                    </div>
                  </Timeline.Items>
                ))}
              </Timeline>

            </div>


          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default TimeLine;