import { useRef, useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginData = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = 'https://v1.nocodeapi.com/izmirvucaj1/google_sheets/KrtIjLvkkVUwAbWn?tabId=login';

    const handleLogin = async (values) => {
        const { Email, myPassword } = values;

        // Check if the user exists in the fetched data
        const user = data.find(item => item.Email === Email && item.Password === myPassword);

        if (user) {
            message.success('Successful login');
            setIsLoading(true);
            setUserData(user);

            // Simulated redirection (after 1.1 seconds)
            setTimeout(() => {
                setIsLoading(false);
                navigate('/home', { state: { userData: user } }); // Pass userData to Home component
                console.log("gizem");
                console.log(user.User);
            }, 1100);
            setTimeout(() => {
                message.destroy();
            }, 500);
        } else {
            message.error('Incorrect email or password');
        }
    };

    const getData = async () => {
        try {
            const response = await axios.get(apiUrl);
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        getData(); // Fetch data
    }, []);

    // Return the necessary variables and functions for the Login component
    return { formRef, handleLogin, isLoading, userData };
};

export default LoginData;
