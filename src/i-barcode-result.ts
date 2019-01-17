import { BarcodeType } from './barcode-type';

/**
 * Interface returned by the library
 */
export interface IBarcodeResult {
  barcode: string;
  type: BarcodeType;
}

/**
 * Transform array of keys into a IBarcodeResult
 * @param keys
 */
export const keysToBarcodeResult = (keys: string[]) => {
    const result: IBarcodeResult = { barcode: keys.join(''), type: BarcodeType.UNKNOWN };
    if (/\d{13}/.test(result.barcode)) {
        result.type = BarcodeType.EAN_13;
    }
    return result;
};