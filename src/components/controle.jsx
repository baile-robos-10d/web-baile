import React, { useState, useCallback } from 'react';
import useMQTT from '../hooks/useMQTT';
import Cima from '../assets/seta_up.png';
import Esquerda from '../assets/seta_left.png';
import Direita from '../assets/seta_rigth.jpg';
import Baixo from '../assets/seta_down.png';

function Controle() {
    const { mover, parar, isConnected } = useMQTT('wss://ycff1281.ala.eu-central-1.emqxsl.com:8084/mqtt');
    const [activeDir, setActiveDir] = useState(null);

    const handleStart = useCallback((x, y, dir) => {
        mover(x, y);
        setActiveDir(dir);
    }, [mover]);

    const handleStop = useCallback(() => {
        parar();
        setActiveDir(null);
    }, [parar]);

    return (
        <div className="flex flex-col items-center">
            <div className={`text-sm mb-2 font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? '✅ Robô Conectado' : '❌ Robô Desconectado'}
            </div>
            
            <section className="p-2.5 text-5xl font-bold text-center text-pink-950 max-md:text-4xl">
                Controle Manual
            </section>
            
            <div className="flex flex-row mt-10 space-x-4">
                {/* ESQUERDA - Gira Esquerda */}
                <div className="flex flex-col justify-center items-center">
                    <button
                        onMouseDown={() => handleStart(0, -5, 'esquerda')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(0, -5, 'esquerda')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'esquerda' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Esquerda} alt="seta esquerda" className="w-12 h-12" />
                    </button>
                    <span className="text-xs mt-1 text-gray-600">Girar Esquerda</span>
                </div>
                
                {/* CIMA/BAIXO - Movimento frente/trás */}
                <div className="flex flex-col items-center space-y-4">
                    <button
                        onMouseDown={() => handleStart(5, 0, 'cima')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(5, 0, 'cima')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'cima' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Cima} alt="seta cima" className="w-12 h-12" />
                    </button>
                    <span className="text-xs -mt-2 text-gray-600">Frente</span>
                    <button
                        onMouseDown={() => handleStart(-5, 0, 'baixo')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(-5, 0, 'baixo')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'baixo' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Baixo} alt="seta baixo" className="w-12 h-12" />
                    </button>
                    <span className="text-xs -mt-2 text-gray-600">Trás</span>
                </div>
                
                {/* DIREITA - Gira Direita */}
                <div className="flex flex-col justify-center items-center">
                    <button
                        onMouseDown={() => handleStart(0, 5, 'direita')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(0, 5, 'direita')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 pl-[10%] transition-transform duration-100 ${
                            activeDir === 'direita' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Direita} alt="seta direita" className="w-12 h-12" />
                    </button>
                    <span className="text-xs mt-1 text-gray-600">Girar Direita</span>
                </div>
            </div>

            {/* Instruções dos LEDs automáticos */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center max-w-md">
                <p className="text-sm text-gray-600 font-medium">🎨 Efeitos de LEDs Automáticos:</p>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                    <div><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span> Frente</div>
                    <div><span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span> Trás</div>
                    <div><span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span> Gira Esq</div>
                    <div><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span> Gira Dir</div>
                </div>
            </div>
        </div>
    );
}

export default Controle;
