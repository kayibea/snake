import './style.css';
import 'utils/proto';

import Board from 'components/Board';
import { KeyCodes, normaliseKeyEvent } from 'utils/util';

const gameOverScreen = document.getElementById('game-over-screen') as HTMLDivElement;
const gameOverMessage = document.getElementById('game-over-message') as HTMLHeadingElement;
const finalScoreDisplay = document.getElementById('final-score') as HTMLSpanElement;
const restartButton = document.getElementById('restart-button') as HTMLButtonElement;
const countdown = document.getElementById('countdown') as HTMLDivElement;
const splashScreen = document.getElementById('splash-screen') as HTMLDivElement;
const pauseScreen = document.getElementById('pause-screen') as HTMLDivElement;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const scoreDisplay = document.getElementById('score') as HTMLParagraphElement;

const gameOverMessages = [
  'Oops! Snake got a taste of itself!',
  'Snake was feeling... snacky.',
  "It's a wrap! Snake tied itself in knots.",
  "That's what happens when you’re too into yourself!",
  'Looks like snake couldn’t resist a bite!',
  'Mmm... tastes like chicken? Not quite.',
  'Self-love has its limits. Game over!',
];

let board: Board;
let animationFrameId: number;

function main(timestamp: number) {
  if (board.isGameOver) {
    showGameOverScreen();
    cancelAnimationFrame(animationFrameId);
    return;
  }

  board.update(timestamp);
  board.render();

  animationFrameId = requestAnimationFrame(main);
}

function showGameOverScreen(): void {
  const message = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)];
  gameOverMessage.innerText = message;
  finalScoreDisplay.innerText = board.score.toString();
  gameOverScreen.setVisible(true);
}

function toggleGamePause(): void {
  if (!countdown.isVisible() || board.isGameOver) return;

  if (!board.isGamePaused) {
    board.toggleGamePause();
    scoreDisplay.innerText = board.score.toString();
    pauseScreen.setVisible(true);
  } else {
    pauseScreen.setVisible(false);
    startCountdown(() => board.toggleGamePause());
  }
}

function startCountdown(callback: Function) {
  let count = 3; // Starting from 3
  countdown.setVisible(true);

  countdown.innerText = count.toString();

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.innerText = count.toString();
    } else if (count === 0) {
      countdown.innerText = 'Go!';
    } else {
      clearInterval(interval);
      countdown.setVisible(false);
      callback();
    }
  }, 1000);
}

function initBoard() {
  document.getElementById('board')?.remove();

  board = new Board();
  board.setVisible(false);
  board.setAttribute('id', 'board');
  board.setAttribute('is', 'custom-board');

  board.render();
  document.body.appendChild(board);
}

startButton.addEventListener('click', () => {
  initBoard();
  board.setVisible(true);
  splashScreen.setVisible(false);

  startCountdown(main);
});

restartButton.addEventListener('click', () => {
  gameOverScreen.setVisible(false);
  initBoard();
  board.setVisible(true);
  startCountdown(main);
});

window.addEventListener('keypress', (e) => {
  const key = normaliseKeyEvent(e.key);
  switch (key) {
    case KeyCodes.Space:
      toggleGamePause();
      break;
    default:
      board.handleKeyPress(e);
  }
});
