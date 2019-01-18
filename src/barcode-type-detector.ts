import {BarcodeType} from "./enums";
/**
 * Define how to determine a barcode type
 */
interface IBarcodeTypeDefiner {
    method: (value: string) => boolean,
    type: BarcodeType
}
/**
 * RegExp for only digits with specified length
 * @param length
 */
const onlyDigitsRegexp = (length: number): RegExp => new RegExp(`^\\d{${length}}$`);
/**
 * The value contains only e specified number of digits
 * @param value
 * @param length
 */
const isOnlyDigits = (value: string, length: number): boolean => onlyDigitsRegexp(length).test(value);
/**
 * EAN control key system based on the Luhn formula
 * @param value
 */
const eanKeyController = (value: string): boolean => {
    const lastIndex = value.length-1;
    const sumCtrl = value.slice(0, lastIndex).split('')
        // Chars are only digits
        .map(digit => parseInt(digit, 10))
        // Each even char column index is multiply by 3
        // And we make the sum
        .reduce((acc, digit, index) => acc + (index % 2 ? digit : digit * 3), 0);
    // The calculated control key has to be the same as the last char in value
    return parseInt(value.slice(lastIndex), 10) === (10 - (sumCtrl % 10));
};
/**
 * UPC uses the same control key system as EAN but we have to add a 0 at the beginning of value
 * @param value
 */
const upcKeyController = (value: string): boolean => eanKeyController(`0${value}`);
/**
 * Is the value an EAN with specified length ?
 * @param value
 * @param length
 */
const isEan = (value: string, length: 8|13): boolean => isOnlyDigits(value, length) && eanKeyController(value);
/**
 * Is the value an UPC with specified length ?
 * @param value
 * @param length
 */
const isUpc = (value: string, length: 7|12): boolean => isOnlyDigits(value, length) && eanKeyController(value);
/**
 * EAN_13 = ONLY 13 digits + control key checking
 */
const ean13Definer: IBarcodeTypeDefiner = {method: value => isEan(value, 13), type: BarcodeType.EAN_13};
/**
 * UPC_A = ONLY 12 digits + control key checking
 */
const upcADefiner: IBarcodeTypeDefiner = {method: value => isUpc(value, 7), type: BarcodeType.UPC_A};
/**
 * EAN_8 = ONLY 8 digits + control key checking
 */
const ean8Definer: IBarcodeTypeDefiner = {method: value => isEan(value, 8), type: BarcodeType.EAN_8};
/**
 * UPC_E = ONLY 7 digits + control key checking
 */
const upcEDefiner: IBarcodeTypeDefiner = {method: value => isUpc(value, 7), type: BarcodeType.UPC_E};
/**
 * Detector of barcode type
 */
export class BarcodeTypeDetector {
    /**
     * Type detection
     * @param value
     */
    public static detect(value: string): BarcodeType {
        for (const definer of BarcodeTypeDetector.definers) {
            // The first compatible type is returned
            if (definer.method(value)) {
                return definer.type;
            }
        }
        return BarcodeType.UNKNOWN;
    }
    /**
     * List of definers
     */
    private static readonly definers: IBarcodeTypeDefiner[] = [ean13Definer, upcADefiner, ean8Definer, upcEDefiner];
}