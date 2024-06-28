const DefaultPage=({userData})=>{
    return(
        <div style={{  padding: '20px' }}> {/* Drawer genişliği kadar sol taraftan içeri kaydır */}
                <h1>Hoş Geldiniz {userData.User}</h1>
                
                
            </div>
    );
}
export default DefaultPage;