import React, { useState } from 'react';
import CoreoBtn from '../assets/coreoBotao.png';
import PararBtn from '../assets/pararCoreo.png';
import useMQTT from '../hooks/useMQTT';

function Coreografia() {
    const [isRunning, setIsRunning] = useState(false);
    const { iniciarCoreografia, pararCoreografia, isConnected } = useMQTT();

    const handleClick = () => {
        if (!isRunning && isConnected) {
            iniciarCoreografia();
            setIsRunning(true);
        }
    };

    const handleStop = () => {
        if (isRunning) {
            pararCoreografia();
            setIsRunning(false);
        }
    };

    return (
        <div className="flex grow justify-center items-center px-16 py-12 w-full font-bold text-center bg-white border-pink-400 border-solid border-[10px] rounded-[32px] text-amber-950 max-md:px-5 max-md:mt-2.5 max-md:max-w-full">
            <div className="flex flex-col max-w-full max-h-full">
                <section className="text-5xl max-md:text-4xl">
                    Coreografia <br />
                </section>
                
                <div className={`text-sm mt-2 ${isRunning ? 'text-green-500 animate-pulse' : 'text-gray-500'}`}>
                    {isRunning ? '🎬 Executando coreografia...' : '⏸️ Aguardando'}
                </div>
                
                <div className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? '🔌 Sistema conectado' : '⚠️ Desconectado'}
                </div>
                
                <section className="flex flex-col justify-center px-4 mt-48 text-3xl max-md:mt-10">
                    <button 
                        className={`items-center gap-5 px-7 py-1.5 rounded-lg transition-all ${
                            isRunning ? 'scale-105 opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                        }`}
                        onClick={handleClick}
                        disabled={!isConnected || isRunning}
                    >
                        <img src={CoreoBtn} alt='Iniciar Coreografia' className="w-67 h-16" />
                    </button>

                    <button 
                        className={`items-center gap-5 px-7 py-1.5 rounded-lg transition-all ${
                            !isRunning ? 'scale-105 opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                        }`}
                        onClick={handleStop}
                        disabled={!isConnected || !isRunning}
                    >
                        {PararBtn ? (
                            <img src={PararBtn} alt='Parar Coreografia' className="w-67 h-16" />
                        ) : (
                            <div className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold">
                                ⏹️ PARAR
                            </div>
                        )}
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Coreografia;