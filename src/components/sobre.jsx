// src/components/sobre.jsx
import React from 'react';
import Logo from '../assets/10D_2026.png';

function Sobre() {
  return (
    <div className="flex flex-col items-center p-6 mt-8 w-full max-w-[1099px] mx-auto bg-white border-pink-400 border-solid border-[10px] rounded-[32px]">
      <section className="text-5xl font-bold text-center text-pink-950 max-md:text-4xl mb-4">
        Sobre o Projeto
      </section>
      
      <div className="w-32 h-32 mb-6">
        <img src={Logo} alt="Logo 10 Dimensões" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-2xl text-center text-gray-700 space-y-4">
        <p className="text-lg">
          O <strong className="text-pink-700">Robô 10 Dimensões</strong> é um projeto inovador que combina 
          robótica, música e coreografias para criar experiências interativas únicas.
        </p>
        
        <div className="bg-pink-50 rounded-xl p-4 my-4 text-left">
          <h3 className="font-bold text-pink-800 mb-2">✨ Funcionalidades:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Controle remoto via MQTT</li>
            <li>8 LEDs programáveis para efeitos visuais</li>
            <li>Reprodução de músicas (Michael Jackson)</li>
            <li>Coreografias automatizadas</li>
            <li>Monitoramento via giroscópio</li>
            <li>Atualização de firmware via OTA</li>
          </ul>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 my-4 text-left">
          <h3 className="font-bold text-orange-800 mb-2">🔧 Tecnologias utilizadas:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>ESP32 como microcontrolador principal</li>
            <li>MQTT para comunicação em tempo real</li>
            <li>React + Tailwind CSS para interface web</li>
            <li>DFPlayer Mini para áudio</li>
            <li>Encoders para calibração de movimento</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 my-4 text-left">
          <h3 className="font-bold text-gray-800 mb-2">👥 Equipe 10 Dimensões:</h3>
          <p className="text-gray-600">
            Projeto desenvolvido por estudantes e pesquisadores da UFRN, 
            com foco em inovação tecnológica e educação.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          © 2024 - 10 Dimensões | Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

export default Sobre;