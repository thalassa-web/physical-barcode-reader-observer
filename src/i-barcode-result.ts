import { BarcodeType } from './barcode-type';

/**
 * Interface returned by the library
 */
export interface IBarcodeResult {
  barcode: string;
  type: BarcodeType;
}
