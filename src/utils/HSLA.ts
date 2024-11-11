import { clamp } from './util';

export default class HSLA {
  private _hue: number;
  private _saturation: number;
  private _lightness: number;
  private _alpha: number;

  // Static properties for range limits
  public static readonly HUE_MIN = 0;
  public static readonly HUE_MAX = 360;
  public static readonly SATURATION_MIN = 0;
  public static readonly SATURATION_MAX = 100;
  public static readonly LIGHTNESS_MIN = 0;
  public static readonly LIGHTNESS_MAX = 100;
  public static readonly ALPHA_MIN = 0;
  public static readonly ALPHA_MAX = 1;

  public constructor(hue: number, saturation: number, lightness: number, alpha: number = 1) {
    this._hue = clamp(hue, HSLA.HUE_MIN, HSLA.HUE_MAX);
    this._saturation = clamp(saturation, HSLA.SATURATION_MIN, HSLA.SATURATION_MAX);
    this._lightness = clamp(lightness, HSLA.LIGHTNESS_MIN, HSLA.LIGHTNESS_MAX);
    this._alpha = clamp(alpha, HSLA.ALPHA_MIN, HSLA.ALPHA_MAX);
  }

  public get hue(): number {
    return this._hue;
  }

  public get saturation(): number {
    return this._saturation;
  }

  public get lightness(): number {
    return this._lightness;
  }

  public get alpha(): number {
    return this._alpha;
  }

  public set hue(h: number) {
    this._hue = clamp(h, HSLA.HUE_MIN, HSLA.HUE_MAX);
  }

  public set saturation(s: number) {
    this._saturation = clamp(s, HSLA.SATURATION_MIN, HSLA.SATURATION_MAX);
  }

  public set lightness(l: number) {
    this._lightness = clamp(l, HSLA.LIGHTNESS_MIN, HSLA.LIGHTNESS_MAX);
  }

  public set alpha(a: number) {
    this._alpha = clamp(a, HSLA.ALPHA_MIN, HSLA.ALPHA_MAX);
  }

  public clone(): HSLA {
    return new HSLA(this.hue, this.saturation, this.lightness, this.alpha);
  }

  public toString(): string {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
  }
}
