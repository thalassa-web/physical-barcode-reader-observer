import {BarcodeType} from './enums';

/**
 * Define a barcodeResult
 */
export class BarcodeResult {
    /**
     * The barcode value
     */
    private _barcode: string;
    /**
     * Construct from an array of strings
     * @param keys
     */
    constructor(keys: string[]) {
        this._barcode = keys.join('');
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
}