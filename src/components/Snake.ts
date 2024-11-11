import HSLA from 'utils/HSLA';
import { directionMap, normaliseKeyEvent } from 'utils/util';
import Vec2 from 'utils/Vector2';

export default class Snake {
  public static readonly MIN_MOVE_INTVL = 30;
  public static readonly MAX_MOVE_INTVL = 60;
  public static readonly SNAKE_BASE_BODY_LENGTH = 4;
  public static readonly SNAKE_COLOR = new HSLA(120, 100, 50);
  public static readonly SNAKE_BODY_ALPHA = 0.7;

  private readonly _body: BodySegment[];
  private isMoving: boolean;
  private lastMoveTime: number;

  constructor(position: Vec2, direction = Vec2.right, baseLenght = Snake.SNAKE_BASE_BODY_LENGTH) {
    this.isMoving = false;
    this.lastMoveTime = 0;
    this._body = [new BodySegment(position, direction)];

    for (let i = 1; i < baseLenght; i++) this.grow();
  }

  public get head(): BodySegment {
    return this._body[0];
  }

  public get body(): BodySegment[] {
    return this._body.slice(1);
  }

  public move(timestamp: number): void {
    if (!this.canMove(timestamp)) return;

    this.isMoving = !this.isMoving;

    const head = this.head;
    const newHeadPosition = head.position.add(head.direction);

    this._body.unshift(new BodySegment(newHeadPosition, head.direction));
    this._body.pop();

    this.lastMoveTime = timestamp;
    this.isMoving = !this.isMoving;
  }

  private canMove(timestamp: number): boolean {
    const deltaTime = timestamp - this.lastMoveTime;
    const moveInterval = this.calculateMoveInterval();

    return deltaTime > moveInterval;
  }

  public grow(): void {
    const lastSegment = this._body[this._body.length - 1];
    const newSegmentPosition = lastSegment.position.sub(lastSegment.direction);
    this._body.push(new BodySegment(newSegmentPosition, lastSegment.direction));
  }

  private calculateMoveInterval(): number {
    const bodyLength = this._body.length;

    const scaleFactor = 5;

    let newInterval = Snake.MIN_MOVE_INTVL + bodyLength * scaleFactor;
    newInterval = Math.max(Snake.MIN_MOVE_INTVL, Math.min(newInterval, Snake.MAX_MOVE_INTVL));

    return newInterval;
  }

  public didTheSnakeBiteItself(): boolean {
    return this.body.some(({ position }) => this.head.position.equals(position));
  }

  private changeDirection(newDirection: Vec2): void {
    if (
      !this.isMoving &&
      !newDirection.isSameDirection(this.head.direction.normalized) &&
      !newDirection.isSameDirection(this.head.direction.normalized.mul(-1))
    )
      this.head.direction.setXY(newDirection.x, newDirection.y);
  }

  public handleKeyPress(e: KeyboardEvent): void {
    const newDirection = directionMap.get(normaliseKeyEvent(e.key));
    newDirection && this.changeDirection(newDirection);
  }

  public toString(): string {
    return this._body
      .map(
        (segment, index) =>
          `Segment ${index}: Position (${segment.position.x}, ${segment.position.y}), Direction (${segment.direction.x}, ${segment.direction.y})`,
      )
      .join('\n');
  }
}

class BodySegment {
  public readonly position: Vec2;
  public readonly direction: Vec2;

  constructor(position: Vec2, direction: Vec2) {
    this.position = new Vec2(position.x, position.y);
    this.direction = new Vec2(direction.x, direction.y);
  }
}
