import { BarcodeType } from './enums';
/**
 * Define a barcodeResult
 */
export class BarcodeResult {
  /**
   * The barcode value
   */
  private readonly _barcode: string;
  /**
   * The target of the last KeyboardEvent
   */
  private readonly _target: EventTarget | null;
  /**
   * Construct from an array of strings
   * @param keys
   */
  constructor(keys: KeyboardEvent[]) {
    this._barcode = keys.reduce((prev, curr) => `${prev}${curr.key}`, '');
    const lastKeyIndex = keys.length - 1;
    this._target = lastKeyIndex > -1 ? keys[lastKeyIndex].target : null;
  }
  /**
   * Getting the barcode value
   */
  get barcode(): string {
    return this._barcode;
  }
  /**
   * Getting the barcode type
   */
  get type(): BarcodeType {
    if (/\d{13}/.test(this._barcode)) {
      return BarcodeType.EAN_13;
    }
    return BarcodeType.UNKNOWN;
  }
  /**
   * Getting the target of the last KeyboardEvent
   */
  get target(): EventTarget | null {
    return this._target;
  }
}
