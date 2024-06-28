import './App.css';

import { MailOutlined, SettingOutlined, FileTextOutlined, CalendarOutlined, FileAddOutlined,FileExcelOutlined,FieldTimeOutlined} from '@ant-design/icons';
import Login from "/Users/gizem/Desktop/reactproje/src/components/login.js"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/home';



// Define itemsList here
const itemsList = [
  {
    label: "Görevler",
    key: 'task',
    icon: <FileTextOutlined />,
    route: 'task',
  },
  
  {
    label: "Takvim",
    key: 'calendar',
    icon: <CalendarOutlined />,
    route: 'calendar',
  },
  {
    label: "Zaman Çizelgesi",
    key: 'timeline',
    icon: <FieldTimeOutlined />,
    route: 'timeline',
  },
  {
    label: 'Mail',
    key: 'mail',
    icon: <MailOutlined />,
    route: 'mail',
  },
  {
    label: 'Profil',
    key: 'profile',
    icon: <SettingOutlined />,
    route: 'profile',
  }
];

function App() {
  const apiUrl = 'https://v1.nocodeapi.com/izmirvucaj1/google_sheets/KrtIjLvkkVUwAbWn?tabId=login';
  return (
    <Router>
      <div className="App">
        {/* The Login component will always render as the default route */}
        <Routes>
          <Route path="/" element={<Login></Login>} />
          <Route path="/home" element={<Home itemsList={itemsList} apiUrl={apiUrl}/>} />
          
   
          
        </Routes>
      </div>
    </Router>


  );
}

export default App;
