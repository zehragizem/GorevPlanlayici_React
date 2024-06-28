import React from "react";
import { Card, Descriptions, Avatar, ConfigProvider } from 'antd';

const Profile = ({ userData }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily:'Arial',
                    borderRadiusLG:15,
                    colorBorderSecondary:'#d11ba7',
                    colorText: 'black',
                    colorTextDescription: '#d11ba7',
                },
                components: {
                    Card: {
                        headerBg: '#d11ba7',

                    }
                }
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card
                    title="Kullanıcı Profili"
                    bordered={false}
                    style={{
                        width: 450,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '50px auto',
                        borderRadius: '20px',
                        boxShadow: '0 4px 4px 4px #d11ba7',
                    }}

                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <Avatar
                            size={158}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFq_XICspIbMdmG2muTxEwmrZfmtUn0TDdT1rq3CP-MsHNyuBDCMhSnV9Phd8QnGNr9Uo&usqp=CAU"
                            style={{
                                boxShadow: '0 4px 8px #d11ba7',
                            }}
                        />
                    </div>
                    <Descriptions column={1} bordered style={{ borderColor: 'black' }}>
                        <Descriptions.Item label="İsim" style={{ fontWeight: 'bold', color: '#d11ba7' }}>{userData.User}</Descriptions.Item>
                        <Descriptions.Item label="E-Posta" style={{ fontWeight: 'bold', color: '#d11ba7' }}>{userData.Email}</Descriptions.Item>
                        <Descriptions.Item label="Telefon" style={{ fontWeight: 'bold', color: '#d11ba7' }}>{userData.Telephone}</Descriptions.Item>
                        <Descriptions.Item label="Adres" style={{ fontWeight: 'bold', color: '#d11ba7' }}>{userData.Address}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default Profile;
