import React from 'react';
import { useLocation } from 'react-router-dom';
import TaskForm from '../components/taskform';
import TaskWrapper from '../services/taskwrapper';
import Draw from '../common/drawer';


const Home = ({itemsList,apiUrl}) => {
    const { state } = useLocation();
    const userData = state?.userData;

    return (
        <div>
            
            <Draw userData={userData} itemsList={itemsList} apiUrl={apiUrl}></Draw>
                  
        </div>
    );
};

export default Home;
