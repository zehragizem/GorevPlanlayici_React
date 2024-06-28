import React, { useState, useEffect } from "react";
import TaskForm from "../components/taskform";
import { Form, Input, Button, message } from 'antd';
import TaskList from "/Users/gizem/Desktop/reactproje/src/components/tasklist.js";
import axios from 'axios';

const TaskWrapper = ({ userData, apiUrl }) => {
  const [todos, setTodos] = useState([]);

  // Function to fetch and filter tasks
  const fetchDataAndFilterTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      const allData = response.data.data;

      const filteredUsers = allData.filter(item => item.UserID === userData.UserID);
      const tasks = filteredUsers.flatMap(user => user.Task.split(',').map(task => task.trim()));

      setTodos(tasks); // Set initial data

    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('Veriler alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchDataAndFilterTasks();
  }, []);

  const addTask = (todo) => {
    setTodos([
      ...todos, todo,
    ]);
  }

  const deleteTask = (taskToDelete) => {
    setTodos(todos.filter(todo => todo !== taskToDelete));
  }

  return (
    <div>
      <h1>Görevler</h1>
      <TaskForm addTask={addTask} userData={userData} apiUrl={apiUrl} />
      {todos.map((todo, index) => (
        <TaskList
          key={index}
          apiUrl={apiUrl}
          userData={userData}
          task={todo}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

export default TaskWrapper;
