import Vec2 from './Vector2';

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getRandInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const normaliseKeyEvent = (key: string): string => {
  return /^[a-zA-Z]$/.test(key) ? key.toLowerCase() : key;
};

export const KeyCodes = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  W: 'w',
  A: 'a',
  S: 's',
  D: 'd',
  Space: String.fromCharCode(32), // Space key
};

export const directionMap = new Map([
  [KeyCodes.W, Vec2.top],
  [KeyCodes.S, Vec2.down],
  [KeyCodes.A, Vec2.left],
  [KeyCodes.D, Vec2.right],
  [KeyCodes.ArrowUp, Vec2.top],
  [KeyCodes.ArrowDown, Vec2.down],
  [KeyCodes.ArrowLeft, Vec2.left],
  [KeyCodes.ArrowRight, Vec2.right],
]);
