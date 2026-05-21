import { useEffect, useState } from 'react';
 
const BROKER = 'wf671196.ala.us-east-1.emqxsl.com';
const URL_WSS = `wss://${BROKER}:8084/mqtt`;
const URL_WS  = `ws://${BROKER}:8083/mqtt`;
const URL_HTTPS = `https://${BROKER}`;
 
export default function MqttDiag() {
  const [results, setResults] = useState([]);
 
  const add = (label, status, detail) =>
    setResults(r => [...r, { label, status, detail, time: new Date().toLocaleTimeString() }]);
 
  useEffect(() => {
    // Teste 1: HTTPS (certificado)
    fetch(URL_HTTPS, { mode: 'no-cors' })
      .then(() => add('Certificado SSL', 'ok', `${BROKER} acessível`))
      .catch(e => add('Certificado SSL', 'erro', e.message));
 
    // Teste 2: WebSocket WSS porta 8084
    try {
      const ws = new WebSocket(URL_WSS, ['mqtt']);
      const t = setTimeout(() => {
        ws.close();
        add('WebSocket WSS :8084', 'timeout', 'Sem resposta em 5s');
      }, 5000);
      ws.onopen = () => {
        clearTimeout(t);
        add('WebSocket WSS :8084', 'ok', 'Conexão aberta com sucesso');
        ws.close();
      };
      ws.onerror = (e) => {
        clearTimeout(t);
        add('WebSocket WSS :8084', 'erro', 'Falhou ao abrir (ver abaixo)');
      };
    } catch (e) {
      add('WebSocket WSS :8084', 'erro', e.message);
    }
 
    // Teste 3: WebSocket WS porta 8083 (sem TLS)
    try {
      const ws2 = new WebSocket(URL_WS, ['mqtt']);
      const t2 = setTimeout(() => {
        ws2.close();
        add('WebSocket WS :8083', 'timeout', 'Sem resposta em 5s');
      }, 5000);
      ws2.onopen = () => {
        clearTimeout(t2);
        add('WebSocket WS :8083', 'ok', 'Abriu (sem TLS)');
        ws2.close();
      };
      ws2.onerror = () => {
        clearTimeout(t2);
        add('WebSocket WS :8083', 'erro', 'Falhou');
      };
    } catch (e) {
      add('WebSocket WS :8083', 'erro', e.message);
    }
 
    add('URL configurada', 'info', URL_WSS);
    add('Navigator online', navigator.onLine ? 'ok' : 'erro', navigator.onLine ? 'Sim' : 'Offline');
  }, []);
 
  const color = (s) => s === 'ok' ? '#16a34a' : s === 'erro' ? '#dc2626' : s === 'timeout' ? '#d97706' : '#2563eb';
  const bg    = (s) => s === 'ok' ? '#f0fdf4' : s === 'erro' ? '#fef2f2' : s === 'timeout' ? '#fffbeb' : '#eff6ff';
 
  return (
    <div style={{ padding: 20, maxWidth: 560, fontFamily: 'monospace', fontSize: 13 }}>
      <h3 style={{ fontFamily: 'sans-serif', marginBottom: 12 }}>Diagnóstico MQTT</h3>
      {results.length === 0 && <p style={{ color: '#888' }}>Testando...</p>}
      {results.map((r, i) => (
        <div key={i} style={{
          background: bg(r.status),
          border: `1px solid ${color(r.status)}`,
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 8
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: color(r.status) }}>{r.status.toUpperCase()}</strong>
            <span style={{ color: '#888' }}>{r.time}</span>
          </div>
          <div style={{ marginTop: 2 }}>{r.label}</div>
          <div style={{ color: '#555', marginTop: 2, wordBreak: 'break-all' }}>{r.detail}</div>
        </div>
      ))}
    </div>
  );
}