export const ROBOT_APPEARANCES = [
  { name: 'Círculo', shape: 'circle', color: '#f62681' },
  { name: 'Quadrado', shape: 'square', color: '#2563eb' },
  { name: 'Triângulo', shape: 'triangle', color: '#db2777' },
  { name: 'Losango', shape: 'diamond', color: '#7c3aed' },
  { name: 'Hexágono', shape: 'hexagon', color: '#0891b2' },
  { name: 'Pentágono', shape: 'pentagon', color: '#ea580c' },
  { name: 'Estrela', shape: 'star', color: '#ca8a04' },
  { name: 'Octógono', shape: 'octagon', color: '#16a34a' },
];

export const BASE_ROBOT_IDS = Array.from({ length: 8 }, (_, index) => `robo${index + 1}`);

export function getRobotAppearance(id) {
  const knownIndex = BASE_ROBOT_IDS.indexOf(id.toLowerCase());
  if (knownIndex >= 0) return ROBOT_APPEARANCES[knownIndex];

  const code = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return ROBOT_APPEARANCES[code % ROBOT_APPEARANCES.length];
}