import React, { useState, useCallback } from 'react';
import useMQTT from '../hooks/useMQTT';
import Cima from '../assets/seta_up.png';
import Esquerda from '../assets/seta_left.png';
import Direita from '../assets/seta_rigth.jpg';
import Baixo from '../assets/seta_down.png';

function Controle() {
    const { mover, parar, isConnected } = useMQTT();
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
                Controle
            </section>
            
            <div className="flex flex-row mt-10 space-x-4">
                {/* ESQUERDA */}
                <div className="flex flex-col justify-center items-center">
                    <button
                        onMouseDown={() => handleStart(-5, 0, 'esquerda')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(-5, 0, 'esquerda')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'esquerda' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Esquerda} alt="seta esquerda" className="w-12 h-12" />
                    </button>
                </div>
                
                {/* CIMA/BAIXO */}
                <div className="flex flex-col items-center space-y-4">
                    <button
                        onMouseDown={() => handleStart(0, 5, 'cima')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(0, 5, 'cima')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'cima' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Cima} alt="seta cima" className="w-12 h-12" />
                    </button>
                    <button
                        onMouseDown={() => handleStart(0, -5, 'baixo')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(0, -5, 'baixo')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 transition-transform duration-100 ${
                            activeDir === 'baixo' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Baixo} alt="seta baixo" className="w-12 h-12" />
                    </button>
                </div>
                
                {/* DIREITA */}
                <div className="flex flex-col justify-center items-center">
                    <button
                        onMouseDown={() => handleStart(5, 0, 'direita')}
                        onMouseUp={handleStop}
                        onTouchStart={() => handleStart(5, 0, 'direita')}
                        onTouchEnd={handleStop}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex justify-center items-center w-16 h-16 pl-[10%] transition-transform duration-100 ${
                            activeDir === 'direita' ? 'scale-110' : 'hover:scale-105'
                        }`}
                    >
                        <img src={Direita} alt="seta direita" className="w-12 h-12" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Controle;