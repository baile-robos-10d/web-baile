import React, { useState, useEffect } from 'react';
import './App.css';
import Logo from './assets/10D_2026.png';
import Twitter from './assets/twitter-logo.png';
import Facebook from './assets/face-logo.png';
import Instagram from './assets/insta-logo.png';
import UFRN from './assets/ufrn-logo.png';
import Lance from './assets/lance-logo.png';
import Controle from './components/controle';
import Musicas from './components/musicasV2';
import Coreografia from './components/coreografia';
// import LigaLeds from './components/leds'; // REMOVIDO
import Sobre from './components/sobre';
import ControleMultiRobo from './components/ControleMultiRobo';
import DigitalTwin from './components/DigitalTwin';
import ControleGiroscopio from './components/ControleGiroscopio';
import useMQTT from './hooks/useMQTT';

function App() {
    const [currentPage, setCurrentPage] = useState('controle');
    const [userRobotId, setUserRobotId] = useState(() => localStorage.getItem('digitalTwinRobotId') || 'robo1');
    const brokerUrl = process.env.REACT_APP_MQTT_BROKER || 'wss://ycff1281.ala.eu-central-1.emqxsl.com:8084/mqtt';
    const { isConnected, status, robotsPose } = useMQTT(brokerUrl);

    const renderPage = () => {
        switch(currentPage) {
            case 'controle':
                return (
                    <>
                        <main className="flex justify-center items-center flex-col py-16 pl-16 mt-8 w-full bg-white border-amber-500 border-solid border-[6px] max-w-[1100px] rounded-[32px] max-md:pl-5 max-md:max-w-full">
                            <Controle/>
                        </main>
                        <aside className="flex mt-8 w-full max-w-[1099px] max-md:flex-col max-md:gap-4">
                            <div className="flex-1">
                                <Musicas/>
                            </div>
                            <div className="flex-1">
                                <Coreografia/>
                            </div>
                        </aside>
                    </>
                );
            case 'giroscopio':
                return <ControleGiroscopio />;
            case 'multi':
                return <ControleMultiRobo robotsPose={robotsPose} mqttOnline={isConnected} />;
            case 'twin':
                return <DigitalTwin robotsPose={robotsPose} mqttOnline={isConnected} robotId={userRobotId} onRobotIdChange={(id) => { setUserRobotId(id); localStorage.setItem('digitalTwinRobotId', id); }} />;
            case 'sobre':
                return <Sobre />;
            default:
                return null;
        }
    };

    useEffect(() => {
        console.log('🚀 App iniciado');
        console.log('🔗 Broker MQTT:', brokerUrl);
    }, [brokerUrl]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#f62681] via-[#f62681] to-[#fffaec]">
            <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-sm font-bold z-50 shadow-lg ${
                isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
                {isConnected ? '🚀 MQTT Online' : '⚠️ MQTT Offline'}
                {status && <span className="ml-2 text-xs">({status})</span>}
            </div>
            
            <header className="flex flex-col self-stretch pb-2.5 w-full max-md:max-w-full">
                <nav className="flex justify-center items-center px-16 bg-white border-pink-900-solid border-b-[3px] max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-5 justify-between w-full max-w-[1212px] max-md:flex-wrap max-md:max-w-full">
                        <div className="flex flex-col justify-center items-start px-3 bg-white bg-opacity-0 max-md:pr-5">
                            <button onClick={() => setCurrentPage('controle')}>
                                <img src={Logo} alt="Logo" className="w-20 h-20 hover:opacity-80 transition-opacity"/>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex gap-3 px-7 py-1.5 text-base font-bold text-center max-md:flex-wrap max-md:px-5">
                                <button 
                                    onClick={() => setCurrentPage('controle')}
                                    className={`py-2 px-4 border rounded transition-colors ${
                                        currentPage === 'controle' 
                                            ? 'bg-[#F68621] text-white border-[#F68621]' 
                                            : 'border-[#D96204] hover:text-[#A0470C] hover:border-[#A0470C]'
                                    }`}
                                >
                                    🎮 Controle Manual
                                </button>
                                <button 
                                    onClick={() => setCurrentPage('giroscopio')}
                                    className={`py-2 px-4 border rounded transition-colors ${
                                        currentPage === 'giroscopio' 
                                            ? 'bg-[#F68621] text-white border-[#F68621]' 
                                            : 'border-[#D96204] hover:text-[#A0470C] hover:border-[#A0470C]'
                                    }`}
                                >
                                    🎯 Controle por Giro
                                </button>
                                <button 
                                    onClick={() => setCurrentPage('multi')}
                                    className={`py-2 px-4 border rounded transition-colors ${
                                        currentPage === 'multi' 
                                            ? 'bg-[#F68621] text-white border-[#F68621]' 
                                            : 'border-[#D96204] hover:text-[#A0470C] hover:border-[#A0470C]'
                                    }`}
                                >
                                    🤖 Multi-Robô
                                </button>
                                <button onClick={() => setCurrentPage('twin')} className={`py-2 px-4 border rounded transition-colors ${
                                    currentPage === 'twin' ? 'bg-[#F68621] text-white border-[#F68621]' : 'bg-transparent hover:text-[#A0470C] border-[#D96204] hover:border-[#A0470C]'
                                }`}>
                                    Digital Twins
                                </button>
                                <button 
                                    onClick={() => setCurrentPage('sobre')}
                                    className={`py-2 px-4 border rounded transition-colors ${
                                        currentPage === 'sobre'
                                            ? 'bg-[#F68621] text-white border-[#F68621]'
                                            : 'bg-[#F68621] text-[#461C04] hover:bg-[#f47902]'
                                    }`}
                                >
                                    Sobre
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            
            {renderPage()}
            
            <footer className="flex flex-col justify-center self-stretch mt-20 w-full bg-stone-500 bg-opacity-80 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col items-center px-16 pt-6 pb-3.5 w-full max-md:px-5 max-md:max-w-full">
                    <div className="flex flex-col max-w-full w-[604px]">
                        <div className="flex gap-5 justify-between items-center max-md:flex-wrap">
                            <img src={Logo} className="shrink-0 self-stretch max-w-full aspect-[0.93] w-[130px]" alt="Logo" />
                            <div className="shrink-0 self-stretch my-auto w-px bg-black border border-solid h-[111px]" />
                            <img src={Lance} className="shrink-0 self-stretch my-auto w-48 max-w-full aspect-[1.67]" alt="Lance" />
                            <div className="shrink-0 self-stretch my-auto w-px bg-black border border-solid h-[111px]" />
                            <img src={UFRN} className="shrink-0 self-stretch my-auto w-40 max-w-full aspect-[1.69]" alt="UFRN" />
                        </div>
                        <div className="flex gap-5 justify-between self-center mt-16 max-w-full w-[394px] max-md:mt-10">
                            <a href='https://www.facebook.com/10dimensoes/' target="_blank" rel="noopener noreferrer">
                                <img src={Facebook} className="shrink-0 my-auto aspect-square w-[86px] hover:opacity-80 transition-opacity" alt="Facebook" />
                            </a>
                            <div className="flex gap-5 justify-between">
                                <a href='https://www.instagram.com/10dimensoes/' target="_blank" rel="noopener noreferrer">
                                    <img src={Instagram} className="shrink-0 my-auto aspect-square w-[88px] hover:opacity-80 transition-opacity" alt="Instagram" />
                                </a>
                                <a href='https://x.com/10dimensoes' target="_blank" rel="noopener noreferrer">
                                    <img src={Twitter} className="shrink-0 max-w-full aspect-[1.37] w-[141px] hover:opacity-80 transition-opacity" alt="Twitter" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
