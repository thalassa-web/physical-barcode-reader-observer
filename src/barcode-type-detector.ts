import { BarcodeType } from './enums';

/**
 * Define how to determine a barcode type
 */
interface IBarcodeTypeDefiner {
  method: (value: string) => boolean;
  type: BarcodeType;
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
const isOnlyDigits = (value: string, length: number): boolean => onlyDigitsRegexp(length).test(value);
/**
 * Control key calculation
 * @param value Barcode without control key
 */
const getEanControlKey = (value: string): number => {
  // Split the string into array of chars
  const sumCtrl =
    value
      .split('')
      // Chars are only digits
      // Each even char column index is multiply by 3
      // And we make the sum
      .reduce((acc, digit, index) => acc + (index % 2 ? 3 : 1) * parseInt(digit, 10), 0) % 10;
  // If the result is 0 the control key is 0
  // Else it's the complement to 10 of the result (10 - result)
  return sumCtrl === 0 ? 0 : 10 - sumCtrl;
};
/**
 * EAN and UPC control key system based on the Luhn formula
 * @param value
 */
const eanKeyController = (value: string): boolean => {
  // The calculated control key has to be the same as the last char in value
  return parseInt(value.slice(value.length - 1), 10) === getEanControlKey(value.slice(0, value.length - 1));
};
/**
 * Is the value an EAN with specified length ?
 * @param value
 * @param length
 */
const isEan = (value: string, length: 8 | 13): boolean => isOnlyDigits(value, length) && eanKeyController(value);
/**
 * Is the value an UPC with specified length ?
 * @param value
 */
const isUpc = (value: string): boolean => isOnlyDigits(value, 12) && eanKeyController(`0${value}`);
/**
 * List of definers
 */
const definersList: IBarcodeTypeDefiner[] = [
  { method: value => isEan(value, 13), type: BarcodeType.EAN_13 },
  { method: value => isUpc(value), type: BarcodeType.UPC_A },
  { method: value => isEan(value, 8), type: BarcodeType.EAN_8 },
];
/**
 * Detect the barcode type
 * @param value
 */
export const detectBarcodeType = (value: string) => {
  return definersList
    .filter(definer => definer.method(value))
    .reduce((type, curr) => (type === BarcodeType.UNKNOWN ? curr.type : type), BarcodeType.UNKNOWN);
};
