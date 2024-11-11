import { getRandInt } from 'utils/util';
import Food from './Food';
import Snake from './Snake';
import Vec2 from 'utils/Vector2';

export default class Board extends HTMLCanvasElement {
  public static readonly MIN_SIZE = 300;
  public static readonly MAX_SIZE = 1200;
  public static readonly TARGET_CELL_SIZE = 10;

  private _isGameOver: boolean;
  private _isGamePaused: boolean;
  private readonly rows: number;
  private readonly cols: number;
  private readonly snake: Snake;
  private readonly foods: Food[];
  private readonly ctx: CanvasRenderingContext2D;

  constructor() {
    super();

    ({ width: this.width, height: this.height } = Board.getDynamicSize());

    this.cols = Math.floor(this.width / Board.TARGET_CELL_SIZE);
    this.rows = Math.floor(this.height / Board.TARGET_CELL_SIZE);
    this.foods = [];

    this._isGameOver = false;
    this._isGamePaused = false;
    this.ctx = this.getContext('2d')!;

    this.snake = new Snake(this.getCenterPosition(), Vec2.randomUnitVector());
    this.spawnFood();
  }

  public get isGameOver(): boolean {
    return this._isGameOver;
  }

  public get score(): number {
    return this.snake.body.length - Snake.SNAKE_BASE_BODY_LENGTH + 1;
  }

  public get isGamePaused(): boolean {
    return this._isGamePaused;
  }

  public toggleGamePause(): void {
    this._isGamePaused = !this._isGamePaused;
  }

  public update(timestamp: number) {
    if (this.isGamePaused) return;

    const snake = this.snake;

    this._isGameOver = snake.didTheSnakeBiteItself();

    this.checkSnakeChomp();
    this.teleportSnakeIfOutOfBounds();
    snake.move(timestamp);
  }

  public render() {
    if (this.isGamePaused) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // this.drawGrid();
    this.drawSnake();
    this.drawFoods();
  }

  private static getDynamicSize(): { width: number; height: number } {
    let width = Math.min(Math.max(window.innerWidth * 0.7, Board.MIN_SIZE), Board.MAX_SIZE);
    let height = Math.min(Math.max(window.innerHeight * 0.7, Board.MIN_SIZE), Board.MAX_SIZE);

    width = Math.floor(width / 2) * 2;
    height = Math.floor(height / 2) * 2;

    return { width, height };
  }

  private getCellSize() {
    return {
      cellWidth: this.width / this.cols,
      cellHeight: this.height / this.rows,
    };
  }

  private getCenterPosition(): Vec2 {
    return new Vec2(Math.floor(this.cols / 2), Math.floor(this.rows / 2));
  }

  private teleportSnakeIfOutOfBounds(): void {
    const head = this.snake.head;
    const { x, y } = head.position;

    head.position.x = (x + this.cols) % this.cols;
    head.position.y = (y + this.rows) % this.rows;
  }

  // @ts-ignore
  private drawGrid() {
    const { cellWidth, cellHeight } = this.getCellSize();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  private spawnFood(): void {
    const occupiedPositions = new Set();
    const snake = this.snake;

    occupiedPositions.add(`${snake.head.position.x},${snake.head.position.y}`);
    for (const segment of snake.body) {
      occupiedPositions.add(`${segment.position.x},${segment.position.y}`);
    }

    for (const food of this.foods) {
      occupiedPositions.add(`${food.position.x},${food.position.y}`);
    }

    const availablePositions = [];
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (!occupiedPositions.has(`${x},${y}`)) {
          availablePositions.push(new Vec2(x, y));
        }
      }
    }

    if (availablePositions.length > 0) {
      const randomIndex = getRandInt(0, availablePositions.length);
      const foodPosition = availablePositions[randomIndex];
      this.foods.push(new Food(foodPosition));
    } else {
      console.log('No empty cells available for new food!');
    }
  }

  private drawSnake(): void {
    const snake = this.snake;
    const { cellWidth, cellHeight } = this.getCellSize();

    this.ctx.fillStyle = Snake.SNAKE_COLOR.toString();

    const headX = snake.head.position.x;
    const headY = snake.head.position.y;
    this.ctx.fillRect(headX * cellWidth, headY * cellHeight, cellWidth, cellHeight);

    const bodyColor = Snake.SNAKE_COLOR.clone();
    bodyColor.alpha = Snake.SNAKE_BODY_ALPHA;

    this.ctx.fillStyle = bodyColor.toString();
    for (const segment of snake.body) {
      const segmentX = segment.position.x;
      const segmentY = segment.position.y;
      this.ctx.fillRect(segmentX * cellWidth, segmentY * cellHeight, cellWidth, cellHeight);
    }
  }

  private drawFoods() {
    const { cellWidth, cellHeight } = this.getCellSize();

    this.ctx.fillStyle = Snake.SNAKE_COLOR.toString();

    for (const food of this.foods) {
      const foodX = food.position.x;
      const foodY = food.position.y;

      this.ctx.fillRect(foodX * cellWidth, foodY * cellHeight, cellWidth, cellHeight);
    }
  }

  public handleKeyPress(e: KeyboardEvent): void {
    if (this.isGamePaused) return;

    this.snake.handleKeyPress(e);
  }

  private checkSnakeChomp(): void {
    const headPosition = this.snake.head.position;
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];
      if (food.position.equals(headPosition)) {
        this.snake.grow();
        this.foods.splice(i, 1);
        this.spawnFood();
        break;
      }
    }
  }
}

customElements.define('custom-board', Board, { extends: 'canvas' });
