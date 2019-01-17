import {BarcodeType} from "./barcode-type";

/**
 * Interface returned by the library
 */
export interface BarcodeResult {
    barcode: string,
    type: BarcodeType
}