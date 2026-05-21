import { useEffect, useRef, useState, useCallback } from 'react';
import mqtt from 'mqtt';

// EMQX Cloud — porta 8084 é WSS (TLS). Se o certificado do broker
// for autoassinado ou de CA privada, o browser bloqueia.
// Solução: usar a porta 8083 (WS sem TLS) OU garantir cert válido na 8084.
// Para EMQX Cloud (*.emqxsl.com) o cert é Let's Encrypt — deve funcionar na 8084.
// Se continuar falhando, troque para 8083 abaixo.
const DEFAULT_BROKER = 'wss://wf671196.ala.us-east-1.emqxsl.com:8084/mqtt';

export function useMQTT(brokerUrl = process.env.REACT_APP_MQTT_BROKER || DEFAULT_BROKER) {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    // Destrói conexão anterior se brokerUrl mudou
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
      reconnectPeriod: 6000,       // tenta reconectar a cada 6s
      connectTimeout: 15000,       // 15s para receber CONNACK
      clean: true,
      username,
      password,
      // CRÍTICO: informa ao broker que é MQTT sobre WebSocket
      // A lib mqtt.js já faz isso, mas reforçamos:
      wsOptions: {
        headers: {
          'Sec-WebSocket-Protocol': 'mqtt',
        },
      },
      // Rejeita certificados inválidos apenas em produção pode causar falha —
      // mas em browser não temos como desabilitar (é o próprio browser que valida)
    };

    console.log('🔄 Conectando ao broker:', brokerUrl);
    console.log('👤 Usuário:', username);

    let client;
    try {
      client = mqtt.connect(brokerUrl, options);
    } catch (err) {
      console.error('❌ Falha ao criar cliente MQTT:', err);
      return;
    }
    clientRef.current = client;

    client.on('connect', (connack) => {
      console.log('✅ MQTT conectado! CONNACK:', connack);
      setIsConnected(true);
      client.subscribe('status', { qos: 0 }, (err) => {
        if (err) console.error('Erro subscribe status:', err);
      });
      client.subscribe('robot/resposta', { qos: 1 }, (err) => {
        if (err) console.error('Erro subscribe robot/resposta:', err);
      });
    });

    client.on('message', (topic, payload) => {
      const msg = payload.toString();
      console.log(`📨 [${topic}]: ${msg}`);
      if (topic === 'status') setStatus(msg);
    });

    client.on('error', (err) => {
      // Erros comuns:
      // "connack timeout"  → broker não respondeu (credenciais erradas ou porta bloqueada)
      // "Connection refused: Bad username or password" → usuário/senha errados no EMQX
      console.error('❌ MQTT Error:', err.message || err);
      setIsConnected(false);
    });

    client.on('reconnect', () => console.log('🔁 Reconectando...'));
    client.on('offline',   () => { console.log('⚠️ MQTT offline'); setIsConnected(false); });
    client.on('close',     () => { console.log('🔌 Conexão fechada'); setIsConnected(false); });

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

  // Formato do ESP32: DN0X+5Y+3
  const mover = useCallback((x, y) => {
    const dirX = x >= 0 ? '+' : '-';
    const dirY = y >= 0 ? '+' : '-';
    const velX = Math.min(Math.abs(x), 9);
    const velY = Math.min(Math.abs(y), 9);
    sendCommand(`DN0X${dirX}${velX}Y${dirY}${velY}`);
  }, [sendCommand]);

  const parar             = useCallback(() => sendCommand('DN0CPA'), [sendCommand]);
  const ligarLed          = useCallback((n) => n >= 0 && n <= 7 && sendCommand(`DN0CL${n}`), [sendCommand]);
  const desligarLed       = useCallback((n) => n >= 0 && n <= 7 && sendCommand(`DN0CD${n}`), [sendCommand]);
  const iniciarCoreografia= useCallback(() => sendCommand('DN0CG'), [sendCommand]);
  const pararCoreografia  = useCallback(() => sendCommand('DN0CPA'), [sendCommand]);
  const tocarMusica       = useCallback((id) => sendCommand(`DN0CM${id}`), [sendCommand]);
  const pararMusica       = useCallback(() => sendCommand('DN0CPS'), [sendCommand]);

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