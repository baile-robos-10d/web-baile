import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';


export function useMQTT(brokerUrl = 'wss://wf671196.ala.us-east-1.emqxsl.com:8084/mqtt') {
//export function useMQTT(brokerUrl = 'wss://broker.emqx.io:8084/mqtt') {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('✅ Conectado ao broker MQTT');
      setIsConnected(true);
      client.subscribe('status');
      client.subscribe('robot/resposta');
    });

    client.on('message', (topic, payload) => {
      const msg = payload.toString();
      console.log(`📨 [${topic}]: ${msg}`);
      if (topic === 'status') {
        setStatus(msg);
      }
    });

    client.on('error', (err) => {
      console.error('❌ MQTT Error:', err);
      setIsConnected(false);
    });

    client.on('close', () => {
      console.log('⚠️ Desconectado');
      setIsConnected(false);
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [brokerUrl]);

  // Formato que o ESP32 entende: DN0X+5Y+3
  const sendCommand = (comando) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish('cmd', comando);
      console.log(`📤 Enviado: ${comando}`);
      return true;
    }
    console.warn('⚠️ Não conectado');
    return false;
  };

  const mover = (x, y) => {
    const dirX = x >= 0 ? '+' : '-';
    const dirY = y >= 0 ? '+' : '-';
    const velX = Math.min(Math.abs(x), 9);
    const velY = Math.min(Math.abs(y), 9);
    const comando = `DN0X${dirX}${velX}Y${dirY}${velY}`;
    sendCommand(comando);
  };

  const parar = () => {
    sendCommand('DN0CPA');
  };

  const ligarLed = (ledNum) => {
    if (ledNum >= 0 && ledNum <= 7) {
      sendCommand(`DN0CL${ledNum}`);
    }
  };

  const desligarLed = (ledNum) => {
    if (ledNum >= 0 && ledNum <= 7) {
      sendCommand(`DN0CD${ledNum}`);
    }
  };

  const iniciarCoreografia = () => {
    sendCommand('DN0CG');
  };

  const tocarMusica = (musicaId) => {
    sendCommand(`DN0CM${musicaId}`);
  };

  const pararCoreografia = () => {
    sendCommand('DN0CPA'); // Usa o mesmo comando PA (PARAR)
  };

  const pararMusica = () => {
    sendCommand('DN0CPS');  // Comando para parar a música
    console.log('⏹️ Comando de parar música enviado');
  };

  return {
    isConnected,
    status,
    mover,
    parar,
    ligarLed,
    desligarLed,
    iniciarCoreografia,
    tocarMusica,
    pararMusica,
    pararCoreografia,
    sendCommand
  };
}

export default useMQTT;