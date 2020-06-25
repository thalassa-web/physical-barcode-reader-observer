import { detectBarcodeType, getAIMSymbology } from './barcode-type-detector';
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
  constructor(keys: Event[]) {
    this._barcode = keys.map(ev => (ev instanceof KeyboardEvent ? ev.key : '')).join('');
    const lastKeyIndex = keys.length - 1;
    this._target = lastKeyIndex > -1 ? keys[lastKeyIndex].target : null;
  }
  /**
   * Getting the barcode value
   */
  get barcode(): string {
    // Nettoie le codebarre pour enlever les potentiels préfixes
    return getAIMSymbology(this._barcode).value;
  }
  /**
   * Getting the barcode type
   */
  get type(): BarcodeType {
    return detectBarcodeType(this._barcode);
  }
  /**
   * Getting the target of the last KeyboardEvent
   */
  get target(): EventTarget | null {
    return this._target;
  }
}
