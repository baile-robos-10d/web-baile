import { useEffect, useRef, useState, useCallback } from 'react';
import mqtt from 'mqtt';

const DEFAULT_BROKER = 'wss://wf671196.ala.us-east-1.emqxsl.com:8084/mqtt';

export function useMQTT(brokerUrl = process.env.REACT_APP_MQTT_BROKER || DEFAULT_BROKER) {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    const username = process.env.REACT_APP_MQTT_USERNAME || 'baile';
    const password = process.env.REACT_APP_MQTT_PASSWORD || 'baile10';

    const options = {
      protocolVersion: 4,
      clientId: `web_${Date.now().toString(16)}_${Math.random().toString(16).slice(2, 6)}`,
      keepalive: 30,
      reconnectPeriod: 6000,
      connectTimeout: 15000,
      clean: true,
      username,
      password,
      wsOptions: {
        headers: {
          'Sec-WebSocket-Protocol': 'mqtt',
        },
      },
    };

    console.log('🔄 Conectando ao broker:', brokerUrl);

    let client;
    try {
      client = mqtt.connect(brokerUrl, options);
    } catch (err) {
      console.error('❌ Falha ao criar cliente MQTT:', err);
      return;
    }
    clientRef.current = client;

    client.on('connect', (connack) => {
      console.log('✅ MQTT conectado!');
      setIsConnected(true);
      client.subscribe('status', { qos: 0 });
      client.subscribe('robot/resposta', { qos: 1 });
    });

    client.on('message', (topic, payload) => {
      const msg = payload.toString();
      console.log(`📨 [${topic}]: ${msg}`);
      if (topic === 'status') setStatus(msg);
    });

    client.on('error', (err) => {
      console.error('❌ MQTT Error:', err.message || err);
      setIsConnected(false);
    });

    client.on('reconnect', () => console.log('🔁 Reconectando...'));
    client.on('offline', () => { console.log('⚠️ MQTT offline'); setIsConnected(false); });
    client.on('close', () => { console.log('🔌 Conexão fechada'); setIsConnected(false); });

    return () => {
      console.log('🧹 Encerrando cliente MQTT');
      client.end(true);
      clientRef.current = null;
    };
  }, [brokerUrl]);

  const sendCommand = useCallback((comando) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn('⚠️ MQTT não conectado. Comando ignorado:', comando);
      return false;
    }
    clientRef.current.publish('cmd', comando, { qos: 0, retain: false });
    console.log('📤 Enviado:', comando);
    return true;
  }, []);

  const mover = useCallback((x, y) => {
    const dirX = x >= 0 ? '+' : '-';
    const dirY = y >= 0 ? '+' : '-';
    const velX = Math.min(Math.abs(x), 9);
    const velY = Math.min(Math.abs(y), 9);
    sendCommand(`DN0X${dirX}${velX}Y${dirY}${velY}`);
  }, [sendCommand]);

  const parar = useCallback(() => sendCommand('DN0CPA'), [sendCommand]);
  
  const ligarLed = useCallback((n) => {
    if (n >= 0 && n <= 7) {
      sendCommand(`DN0CL${n}`);
    }
  }, [sendCommand]);
  
  const desligarLed = useCallback((n) => {
    if (n >= 0 && n <= 7) {
      sendCommand(`DN0CD${n}`);
    }
  }, [sendCommand]);
  
  const iniciarCoreografia = useCallback(() => {
    console.log('📤 Enviando DN0CG para iniciar coreografia');
    sendCommand('DN0CG');
  }, [sendCommand]);
  
  const pararCoreografia = useCallback(() => {
    console.log('📤 Enviando DN0CPA para parar coreografia');
    sendCommand('DN0CPA');
  }, [sendCommand]);
  
  const tocarMusica = useCallback((id) => sendCommand(`DN0CM${id}`), [sendCommand]);
  const pararMusica = useCallback(() => sendCommand('DN0CPS'), [sendCommand]);

  return {
    isConnected, status,
    mover, parar,
    ligarLed, desligarLed,
    iniciarCoreografia, pararCoreografia,
    tocarMusica, pararMusica,
    sendCommand,
  };
}

export default useMQTT;