import React, { useMemo } from 'react';
import './ControleMultiRobo.css';
import { BASE_ROBOT_IDS, ROBOT_APPEARANCES, getRobotAppearance } from './robotAppearance';

const METERS_TO_PIXELS = 72;
const MAX_COORDINATE = 3.8;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function RobotMarker({ id, pose }) {
  const x = clamp(Number(pose.x) || 0, -MAX_COORDINATE, MAX_COORDINATE);
  const y = clamp(Number(pose.y) || 0, -MAX_COORDINATE, MAX_COORDINATE);
  const theta = (Number(pose.theta) || 0) * (180 / Math.PI);
  const appearance = getRobotAppearance(id);

  return (
    <div
      className="robot-marker"
      style={{ left: `calc(50% + ${x * METERS_TO_PIXELS}px)`, top: `calc(50% - ${y * METERS_TO_PIXELS}px)` }}
      title={`${id}: x ${x.toFixed(2)} m, y ${y.toFixed(2)} m`}
    >
      <div
        className={`robot-body robot-shape-${appearance.shape}`}
        style={{ '--robot-color': appearance.color, transform: `translate(-50%, -50%) rotate(${theta}deg)` }}
      >
        <span className="robot-arrow" aria-hidden="true">▲</span>
      </div>
      <span className="robot-label">{id}</span>
    </div>
  );
}

export default function ControleMultiRobo({ robotsPose = {}, mqttOnline }) {
  const robots = useMemo(() => Object.entries(robotsPose), [robotsPose]);

  return (
    <main className="multi-robot-page">
      <section className="multi-robot-card" aria-labelledby="multi-robot-title">
        <div className="multi-robot-heading">
          <div>
            <p className="multi-robot-eyebrow">MAPA AO VIVO</p>
            <h1 id="multi-robot-title">Área dos robôs</h1>
          </div>
          <span className={`mqtt-indicator ${mqttOnline ? 'is-online' : ''}`}>
            <i aria-hidden="true" />
            {mqttOnline ? 'MQTT conectado' : 'Aguardando conexão MQTT'}
          </span>
        </div>

        <div className="floor-map" aria-label="Mapa da área de movimentação dos robôs">
          <div className="floor-origin" aria-hidden="true">0,0</div>
          {robots.map(([id, pose]) => <RobotMarker key={id} id={id} pose={pose} />)}
          {robots.length === 0 ? (
            <div className="empty-floor-message">
              <span aria-hidden="true">🤖</span>
              <strong>Nenhum robô na área</strong>
              <small>Quando um robô enviar sua posição, ele aparecerá aqui.</small>
            </div>
          ) : null}
          <span className="floor-axis floor-axis-x" aria-hidden="true">X</span>
          <span className="floor-axis floor-axis-y" aria-hidden="true">Y</span>
        </div>

        <p className="multi-robot-summary">
          {robots.length === 0
            ? 'O mapa continua disponível mesmo sem robôs conectados.'
            : `${robots.length} robô${robots.length > 1 ? 's' : ''} detectado${robots.length > 1 ? 's' : ''}.`}
        </p>
        <div className="robot-legend" aria-label="Legenda dos oito robôs possíveis">
          {BASE_ROBOT_IDS.map((id, index) => {
            const appearance = ROBOT_APPEARANCES[index];
            return <span key={id}><i className={`legend-shape robot-shape-${appearance.shape}`} style={{ '--robot-color': appearance.color }} />{id}</span>;
          })}
        </div>
      </section>
    </main>
  );
}