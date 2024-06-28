import React from 'react';
import { Typography, Form, Input, Button, ConfigProvider } from 'antd';
import { UserOutlined,LockOutlined} from '@ant-design/icons';
import LoginData from '../services/logindata';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { formRef, handleLogin, isLoading, userData } = LoginData();

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#d11ba7',
                    colorPrimaryHover: '#5b10b5',
                    colorIcon: 'black'
                },
                components: {
                    Input: {
                        activeBorderColor: '#d11ba7',
                        colorText: '#black',
                    },
                },
            }}
        >
            <div className="appBg">
                <Form className="loginForm" onFinish={handleLogin}>
                    <Typography.Title style={{ textAlign: 'center', color: '#fff' }}>Hoş Geldiniz</Typography.Title>

                    <Form.Item
                        name="Email"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Please enter a valid email address.'
                            }
                        ]}
                    >
                        <Input placeholder="Email" prefix={<UserOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                        name="myPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password.'
                            }
                        ]}
                    >
                        <Input.Password placeholder="Şifre" prefix={<LockOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            onClick={() => isLoading && navigate('home')}
                        >
                            Giriş Yap
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </ConfigProvider>
    );
};

export default Login;
