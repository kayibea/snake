import { getRandInt } from './util';

export default class Vec2 {
  public constructor(public x = 0, public y = 0) {}

  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public get normalized(): Vec2 {
    const len = this.length;
    return new Vec2(this.x / len, this.y / len);
  }

  public setXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  public sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  public mul(scalar: number) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  public clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  public equals(v: Vec2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  public isSameDirection(other: Vec2): boolean {
    const normalizedThis = this.normalized;
    const normalizedOther = other.normalized;

    return normalizedThis.x === normalizedOther.x && normalizedThis.y === normalizedOther.y;
  }

  public static get top(): Vec2 {
    return new Vec2(0, -1);
  }

  public static get left(): Vec2 {
    return new Vec2(-1, 0);
  }

  public static get down(): Vec2 {
    return new Vec2(0, 1);
  }

  public static get right(): Vec2 {
    return new Vec2(1, 0);
  }

  public static randomUnitVector(): Vec2 {
    const directions = [Vec2.top, Vec2.left, Vec2.down, Vec2.right];
    return directions[getRandInt(0, 3)];
  }

  public toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
