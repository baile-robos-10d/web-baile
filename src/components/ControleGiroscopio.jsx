// src/components/ControleGiroscopio.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useMQTT from '../hooks/useMQTT';

function ControleGiroscopio() {
    const { mover, parar, isConnected } = useMQTT();
    const [gyroActive, setGyroActive] = useState(false);
    const [calibration, setCalibration] = useState({ beta: 0, gamma: 0 });
    const [sensitivity, setSensitivity] = useState(0.5);
    const [lastCommand, setLastCommand] = useState('');
    const lastSendRef = useRef(0);
    const lastCommandRef = useRef('');

    // Mapeia ângulo para velocidade (-9 a 9)
    const mapAngleToSpeed = (angle, center, sens) => {
        let diff = angle - center;
        let speed = diff * sens;
        speed = Math.max(-9, Math.min(9, speed));
        return Math.round(speed);
    };

    const handleOrientation = useCallback((event) => {
        if (!gyroActive) return;

        // Throttle: máximo 20 comandos por segundo (50ms)
        const now = Date.now();
        if (now - lastSendRef.current < 50) return;
        lastSendRef.current = now;

        let rawBeta = event.beta || 0;
        let rawGamma = event.gamma || 0;

        let speedY = mapAngleToSpeed(rawBeta, calibration.beta, sensitivity);
        let speedX = mapAngleToSpeed(rawGamma, calibration.gamma, sensitivity);

        // Deadzone
        if (Math.abs(speedY) < 1) speedY = 0;
        if (Math.abs(speedX) < 1) speedX = 0;

        const command = `${speedX},${-speedY}`;
        
        if (command !== lastCommandRef.current) {
            if (speedX !== 0 || speedY !== 0) {
                mover(speedX, -speedY);
                setLastCommand(`Mover: X=${speedX}, Y=${-speedY}`);
            } else {
                parar();
                setLastCommand('Parado');
            }
            lastCommandRef.current = command;
        }
    }, [gyroActive, calibration, sensitivity, mover, parar]);

    const calibrate = () => {
        if (window.DeviceOrientationEvent) {
            const handler = (e) => {
                setCalibration({
                    beta: e.beta || 0,
                    gamma: e.gamma || 0
                });
                setGyroActive(true);
                window.removeEventListener('deviceorientation', handler);
            };
            window.addEventListener('deviceorientation', handler, { once: true });
        }
    };

    useEffect(() => {
        let handler = null;
        
        if (gyroActive) {
            handler = handleOrientation;
            window.addEventListener('deviceorientation', handler);
        }
        
        return () => {
            if (handler) {
                window.removeEventListener('deviceorientation', handler);
            }
        };
    }, [gyroActive, handleOrientation]);

    const requestPermission = () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        calibrate();
                    }
                })
                .catch(console.error);
        } else {
            calibrate();
        }
    };

    return (
        <div className="flex flex-col items-center p-6 mt-8 w-full max-w-[1099px] mx-auto bg-white border-pink-400 border-solid border-[10px] rounded-[32px]">
            <section className="text-5xl font-bold text-center text-pink-950 max-md:text-4xl mb-4">
                🎮 Controle por Giroscópio
            </section>
            
            <div className={`text-sm mb-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '✅ Sistema conectado' : '❌ Sistema desconectado'}
            </div>

            {!isConnected && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    ⚠️ Aguardando conexão com o robô...
                </div>
            )}

            {!gyroActive ? (
                <button
                    onClick={requestPermission}
                    disabled={!isConnected}
                    className={`bg-[#F68621] text-white py-3 px-8 rounded-xl transition-colors text-lg font-semibold ${
                        !isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f47902]'
                    }`}
                >
                    📱 Ativar Controle por Giroscópio
                </button>
            ) : (
                <div className="w-full max-w-md space-y-4">
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        <div className="text-2xl mb-2">🎯 Giroscópio Ativo!</div>
                        <div className="text-sm text-gray-600">
                            Incline o celular para controlar o robô
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sensibilidade: {sensitivity.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Menos sensível</span>
                            <span>Mais sensível</span>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-3 rounded-lg text-center text-sm">
                        <span className="font-bold">🎯 Posição neutra:</span><br/>
                        β: {calibration.beta.toFixed(1)}° | γ: {calibration.gamma.toFixed(1)}°
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-center text-xs text-gray-600">
                        📡 Último comando: {lastCommand}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                calibrate();
                                setLastCommand('Recalibrado');
                            }}
                            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                        >
                            🔄 Recalibrar
                        </button>
                        <button
                            onClick={() => {
                                setGyroActive(false);
                                parar();
                                setLastCommand('Desativado');
                            }}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                        >
                            ⏹️ Desativar
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 text-sm text-gray-400 text-center">
                <p>📱 Como usar:</p>
                <p>1. Mantenha o celular na posição neutra (reto)</p>
                <p>2. Incline para frente/trás → move frente/trás</p>
                <p>3. Incline para esquerda/direita → vira</p>
                <p>4. Volte à posição neutra para parar</p>
            </div>
        </div>
    );
}

export default ControleGiroscopio;