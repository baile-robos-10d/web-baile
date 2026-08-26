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
import Sobre from './components/sobre';
import ControleMultiRobo from './components/ControleMultiRobo';
import DigitalTwin from './components/DigitalTwin';
import ControleGiroscopio from './components/ControleGiroscopio';
import useMQTT from './hooks/useMQTT';

function App() {
    const [currentPage, setCurrentPage] = useState('controle');
    const [userRobotId, setUserRobotId] = useState(() => localStorage.getItem('digitalTwinRobotId') || 'robo1');
    const brokerUrl = process.env.REACT_APP_MQTT_BROKER || 'wss://e2792d91.ala.us-east-1.emqxsl.com:8084/mqtt';
    const { isConnected, status, robotsPose } = useMQTT(brokerUrl);

    // Navegação com animação
    const navItems = [
        { id: 'controle', label: '🎮 Controle Manual', icon: '🎮' },
        { id: 'giroscopio', label: '🎯 Controle por Giro', icon: '🎯' },
        { id: 'multi', label: '🤖 Multi-Robô', icon: '🤖' },
        { id: 'twin', label: '🔄 Digital Twins', icon: '🔄' },
        { id: 'sobre', label: '📖 Sobre', icon: '📖' },
    ];

    const renderPage = () => {
        switch(currentPage) {
            case 'controle':
                return (
                    <div className="page-container animate-fadeIn">
                        <main className="flex justify-center items-center flex-col py-12 px-6 mt-6 w-full bg-white/95 backdrop-blur-sm border-2 border-amber-200/50 max-w-[1100px] rounded-3xl shadow-2xl shadow-amber-500/10">
                            <Controle 
                                robotsPose={robotsPose}
                                robotId={userRobotId}
                                onRobotIdChange={(id) => { 
                                    setUserRobotId(id); 
                                    localStorage.setItem('digitalTwinRobotId', id); 
                                }}
                            />
                        </main>
                        <aside className="flex mt-8 w-full max-w-[1100px] gap-6 max-md:flex-col max-md:gap-4">
                            <div className="flex-1">
                                <Musicas/>
                            </div>
                            <div className="flex-1">
                                <Coreografia/>
                            </div>
                        </aside>
                    </div>
                );
            case 'giroscopio':
                return (
                    <div className="page-container animate-fadeIn">
                        <ControleGiroscopio 
                            robotsPose={robotsPose}
                            robotId={userRobotId}
                            onRobotIdChange={(id) => { 
                                setUserRobotId(id); 
                                localStorage.setItem('digitalTwinRobotId', id); 
                            }}
                        />
                    </div>
                );
            case 'multi':
                return (
                    <div className="page-container animate-fadeIn">
                        <ControleMultiRobo robotsPose={robotsPose} mqttOnline={isConnected} />
                    </div>
                );
            case 'twin':
                return (
                    <div className="page-container animate-fadeIn">
                        <DigitalTwin robotsPose={robotsPose} mqttOnline={isConnected} robotId={userRobotId} onRobotIdChange={(id) => { setUserRobotId(id); localStorage.setItem('digitalTwinRobotId', id); }} />
                    </div>
                );
            case 'sobre':
                return (
                    <div className="page-container animate-fadeIn">
                        <Sobre />
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        console.log('🚀 App iniciado');
        console.log('🔗 Broker MQTT:', brokerUrl);
    }, [brokerUrl]);

    return (
        <div className="app-container min-h-screen bg-gradient-to-br from-[#f62681] via-[#f62681]/90 to-[#fffaec]">
            {/* Status Bar - Mais elegante */}
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl backdrop-blur-md transition-all duration-500 ${
                isConnected 
                    ? 'bg-emerald-500/90 text-white shadow-emerald-500/30' 
                    : 'bg-rose-500/90 text-white shadow-rose-500/30'
            }`}>
                <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
                        isConnected ? 'bg-white' : 'bg-white/50'
                    }`}></span>
                    {isConnected ? '🚀 Online' : '⚠️ Offline'}
                    {status && <span className="ml-2 text-xs opacity-70">({status})</span>}
                </div>
            </div>
            
            {/* Header com navegação refinada */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/30 shadow-sm">
                <nav className="flex justify-center items-center px-6 py-3 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo com efeito */}
                        <button 
                            onClick={() => setCurrentPage('controle')}
                            className="flex items-center gap-3 group transition-transform hover:scale-105"
                        >
                            <img 
                                src={Logo} 
                                alt="Logo" 
                                className="w-14 h-14 object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" 
                            />
                            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-[#f62681] to-[#F68621] bg-clip-text text-transparent">
                                10 Dimensões
                            </span>
                        </button>

                        {/* Menu de navegação - Design moderno */}
                        <div className="flex items-center gap-1.5 bg-amber-50/50 p-1.5 rounded-2xl border border-amber-200/30">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentPage(item.id)}
                                    className={`
                                        relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                                        ${currentPage === item.id 
                                            ? 'text-white shadow-lg' 
                                            : 'text-amber-800/70 hover:text-amber-800 hover:bg-amber-100/50'
                                        }
                                    `}
                                    style={{
                                        background: currentPage === item.id 
                                            ? 'linear-gradient(135deg, #f62681, #F68621)' 
                                            : 'transparent'
                                    }}
                                >
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <span>{item.icon}</span>
                                        <span className="hidden md:inline">{item.label}</span>
                                        <span className="md:hidden">{item.id === 'controle' ? 'Controle' : item.id === 'giroscopio' ? 'Giro' : item.id === 'multi' ? 'Multi' : item.id === 'twin' ? 'Twins' : 'Sobre'}</span>
                                    </span>
                                    {currentPage === item.id && (
                                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f62681] to-[#F68621] opacity-20 blur-sm -z-0"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Espaço para ícone de conexão mobile */}
                        <div className="sm:hidden">
                            <div className={`w-3 h-3 rounded-full ${
                                isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}></div>
                        </div>
                    </div>
                </nav>
            </header>
            
            {/* Conteúdo principal */}
            <main className="flex flex-col items-center px-4 py-6 max-w-7xl mx-auto">
                {renderPage()}
            </main>
            
            {/* Footer refinado */}
            <footer className="mt-16 bg-white/80 backdrop-blur-md border-t border-amber-200/30">
                <div className="flex flex-col items-center px-6 py-8 max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-8 w-full">
                        <img src={Logo} className="h-16 w-auto object-contain opacity-80" alt="Logo" />
                        <div className="hidden sm:block w-px h-12 bg-amber-200/50" />
                        <img src={Lance} className="h-12 w-auto object-contain opacity-80" alt="Lance" />
                        <div className="hidden sm:block w-px h-12 bg-amber-200/50" />
                        <img src={UFRN} className="h-12 w-auto object-contain opacity-80" alt="UFRN" />
                    </div>
                    <div className="flex gap-6 mt-6">
                        <a href='https://www.facebook.com/10dimensoes/' target="_blank" rel="noopener noreferrer" 
                           className="hover:scale-110 transition-transform duration-300">
                            <img src={Facebook} className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity" alt="Facebook" />
                        </a>
                        <a href='https://www.instagram.com/10dimensoes/' target="_blank" rel="noopener noreferrer"
                           className="hover:scale-110 transition-transform duration-300">
                            <img src={Instagram} className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity" alt="Instagram" />
                        </a>
                        <a href='https://x.com/10dimensoes' target="_blank" rel="noopener noreferrer"
                           className="hover:scale-110 transition-transform duration-300">
                            <img src={Twitter} className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity" alt="Twitter" />
                        </a>
                    </div>
                    <p className="text-xs text-amber-800/40 mt-6">
                        © 2026 - 10 Dimensões | Todos os direitos reservados
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;