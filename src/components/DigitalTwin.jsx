import React, { useEffect, useMemo, useState } from 'react';
import './DigitalTwin.css';
import { BASE_ROBOT_IDS, getRobotAppearance } from './robotAppearance';

function formatNumber(value, suffix = '') {
  return Number.isFinite(Number(value)) ? `${Number(value).toFixed(2)}${suffix}` : '—';
}

export default function DigitalTwin({ robotsPose = {}, mqttOnline, robotId, onRobotIdChange }) {
  const [draftId, setDraftId] = useState(robotId);
  const availableRobots = useMemo(
    () => [...new Set([...BASE_ROBOT_IDS, ...Object.keys(robotsPose)])],
    [robotsPose],
  );
  const pose = robotsPose[robotId];
  const appearance = getRobotAppearance(robotId);
  const lastUpdate = pose?.lastUpdate ? new Date(pose.lastUpdate).toLocaleTimeString() : null;

  useEffect(() => setDraftId(robotId), [robotId]);

  function selectRobot(event) {
    const nextId = event.target.value.trim();
    setDraftId(nextId);
    if (nextId) onRobotIdChange(nextId);
  }

  return (
    <main className="twin-page">
      <section className="twin-card" aria-labelledby="twin-title">
        <div className="twin-heading">
          <div><p>SEU DIGITAL TWIN</p><h1 id="twin-title">Painel do robô</h1></div>
          <span className={`twin-connection ${mqttOnline ? 'online' : ''}`}>{mqttOnline ? '● Online' : '● Offline'}</span>
        </div>

        <label className="robot-picker" htmlFor="robot-id">Robô associado a este celular
          <select id="robot-id" value={draftId} onChange={selectRobot}>
            {availableRobots.map(id => <option value={id} key={id}>{id}</option>)}
          </select>
        </label>

        <div className="twin-layout">
          <article className="twin-robot-stage">
            <div className="twin-grid" aria-hidden="true" />
            <div className={`twin-robot robot-shape-${appearance.shape}`} style={{ '--robot-color': appearance.color }}>
              <span>▲</span>
            </div>
            <strong>{robotId}</strong>
            <small>{pose ? `Última atualização: ${lastUpdate}` : 'Aguardando a primeira posição do robô'}</small>
          </article>

          <section className="twin-telemetry" aria-label="Telemetria do robô selecionado">
            <h2>Telemetria</h2>
            <div className="telemetry-grid">
              <div><span>Posição X</span><strong>{formatNumber(pose?.x, ' m')}</strong></div>
              <div><span>Posição Y</span><strong>{formatNumber(pose?.y, ' m')}</strong></div>
              <div><span>Orientação</span><strong>{Number.isFinite(Number(pose?.theta)) ? `${Math.round(Number(pose.theta) * 180 / Math.PI)}°` : '—'}</strong></div>
              <div><span>Velocidade</span><strong>{formatNumber(Math.hypot(Number(pose?.vx) || 0, Number(pose?.vy) || 0), ' m/s')}</strong></div>
            </div>
            <p className="twin-note">A escolha fica salva neste celular. Os dados aparecem quando o robô selecionado publica sua pose no MQTT.</p>
          </section>
        </div>
      </section>
    </main>
  );
}