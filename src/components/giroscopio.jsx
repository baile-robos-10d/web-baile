// src/components/giroscopio.jsx
import React, { useState, useEffect, useCallback } from 'react';

function Giroscopio() {
  const [gyroData, setGyroData] = useState({
    alpha: null,
    beta: null,
    gamma: null
  });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const handleOrientation = (event) => {
    setGyroData({
      alpha: event.alpha?.toFixed(2),
      beta: event.beta?.toFixed(2),
      gamma: event.gamma?.toFixed(2)
    });
  };

  const requestPermission = useCallback(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS: precisa de permissão explícita
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            setPermissionGranted(true);
          }
        })
        .catch(err => {
          console.error('Erro ao solicitar permissão:', err);
          setIsSupported(false);
        });
    } else {
      // Android e outros: permissão automática
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
        setPermissionGranted(true);
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const stopGyroscope = () => {
    window.removeEventListener('deviceorientation', handleOrientation);
    setPermissionGranted(false);
    setGyroData({ alpha: null, beta: null, gamma: null });
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 mt-8 w-full max-w-[1099px] mx-auto bg-white border-pink-400 border-solid border-[10px] rounded-[32px]">
      <section className="text-5xl font-bold text-center text-pink-950 max-md:text-4xl mb-4">
        Giroscópio
      </section>
      
      <div className="text-sm text-center text-gray-500 mb-6">
        Monitore a orientação do seu dispositivo em tempo real
      </div>

      {!isSupported && (
        <div className="text-red-500 text-center mb-4">
          ⚠️ Seu dispositivo/navegador não suporta o sensor de orientação
        </div>
      )}

      {isSupported && !permissionGranted && (
        <button
          onClick={requestPermission}
          className="bg-[#F68621] text-white py-3 px-8 rounded-xl hover:bg-[#f47902] transition-colors text-lg font-semibold"
        >
          🎯 Permitir acesso ao Giroscópio
        </button>
      )}

      {isSupported && permissionGranted && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-6">
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-2">🔄</div>
              <div className="text-sm text-gray-500 mb-1">Alpha (Z)</div>
              <div className="text-3xl font-bold text-pink-700">
                {gyroData.alpha !== null ? `${gyroData.alpha}°` : '---'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Bússola / Rotação Z</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-2">⬆️⬇️</div>
              <div className="text-sm text-gray-500 mb-1">Beta (X)</div>
              <div className="text-3xl font-bold text-pink-700">
                {gyroData.beta !== null ? `${gyroData.beta}°` : '---'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Inclinação frente/trás</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-2">⬅️➡️</div>
              <div className="text-sm text-gray-500 mb-1">Gamma (Y)</div>
              <div className="text-3xl font-bold text-pink-700">
                {gyroData.gamma !== null ? `${gyroData.gamma}°` : '---'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Inclinação lateral</div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={stopGyroscope}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
            >
              ⏹️ Parar leitura
            </button>
            <button
              onClick={() => {
                stopGyroscope();
                requestPermission();
              }}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Reiniciar
            </button>
          </div>
        </>
      )}

      <div className="mt-8 text-sm text-gray-400 text-center">
        <p>📱 O giroscópio detecta a orientação do seu celular/tablet</p>
        <p>💡 Use em um dispositivo móvel para melhores resultados</p>
      </div>
    </div>
  );
}

export default Giroscopio;