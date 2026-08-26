// src/components/coreografia.jsx
import React, { useState } from 'react';
import useMQTT from '../hooks/useMQTT';

function Coreografia() {
    const [isRunning, setIsRunning] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const { iniciarCoreografia, pararCoreografia, isConnected } = useMQTT();

    const handleClick = () => {
        console.log('🎬 INICIAR coreografia pressionado');
        console.log('isConnected:', isConnected);
        console.log('isRunning:', isRunning);
        
        if (!isConnected) {
            setMensagem('⚠️ Sistema desconectado!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }
        
        if (isRunning) {
            setMensagem('⚠️ Coreografia já está em execução!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }
        
        console.log('📤 Enviando comando para iniciar coreografia: DN0CG');
        iniciarCoreografia();
        setIsRunning(true);
        setMensagem('🎬 Coreografia iniciada!');
        setTimeout(() => setMensagem(''), 3000);
    };

    const handleStop = () => {
        console.log('⏹️ PARAR coreografia pressionado');
        console.log('isConnected:', isConnected);
        console.log('isRunning:', isRunning);
        
        if (!isConnected) {
            setMensagem('⚠️ Sistema desconectado!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }
        
        if (!isRunning) {
            setMensagem('⚠️ Nenhuma coreografia em execução!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }
        
        console.log('📤 Enviando comando para parar coreografia: DN0CPA');
        
        pararCoreografia();
        
        // Força o estado para false
        setIsRunning(false);
        setMensagem('⏹️ Coreografia parada!');
        setTimeout(() => setMensagem(''), 2000);
    };

    return (
        <div className="flex flex-col items-center px-6 py-8 w-full font-bold bg-white border-pink-400 border-solid border-[10px] rounded-[32px] text-amber-950">
            <section className="text-5xl max-md:text-4xl mb-2">
                Coreografia
            </section>
            
            <div className={`text-sm mb-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '🎬 Sistema de coreografia pronto' : '⚠️ Coreografia desconectada'}
            </div>
            
            {isRunning && (
                <div className="text-sm text-green-500 animate-pulse mb-4">
                    🎬 Executando coreografia...
                </div>
            )}
            
            {mensagem && (
                <div className="text-sm text-pink-600 mb-4 animate-pulse">
                    {mensagem}
                </div>
            )}
            
            <div className="text-sm text-gray-500 mb-6">
                {isRunning ? (
                    <span>✅ Coreografia em execução</span>
                ) : (
                    <span>⚪ Nenhuma coreografia em execução</span>
                )}
            </div>
            
            <div className="flex gap-6 w-full max-w-md">
                <button
                    onClick={handleClick}
                    disabled={!isConnected || isRunning}
                    className={`
                        flex-1 py-4 rounded-xl font-bold text-white text-xl
                        transition-all duration-200 transform
                        flex items-center justify-center gap-3
                        ${(!isConnected || isRunning)
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95'
                        }
                    `}
                >
                    <span>🎬</span> INICIAR
                </button>
                
                <button
                    onClick={handleStop}
                    disabled={!isConnected || !isRunning}
                    className={`
                        flex-1 py-4 rounded-xl font-bold text-white text-xl
                        transition-all duration-200 transform
                        flex items-center justify-center gap-3
                        ${(!isConnected || !isRunning)
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
                        }
                    `}
                >
                    <span>⏹️</span> PARAR
                </button>
            </div>
            
            <div className="mt-6 text-xs text-gray-400 text-center">
                <p>💡 Clique em INICIAR para executar a coreografia &nbsp;&nbsp; Use PARAR para interromper</p>
            </div>
        </div>
    );
}

export default Coreografia;