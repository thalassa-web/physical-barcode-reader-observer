import { AIMSymbology, BarcodeType } from './enums';

/**
 * Define how to determine a barcode type
 */
interface IBarcodeTypeDefiner {
  method: (value: string) => boolean;
  type: BarcodeType;
}

/**
 * Liste des symbologies en fonction du préfixe AIM
 * @see https://support.honeywellaidc.com/s/article/List-of-barcode-symbology-AIM-Identifiers
 */
export const AIM_PREFIXES = new Map<string, AIMSymbology>([
  [']A0', AIMSymbology.CODE_39],
  [']A1', AIMSymbology.CODE_39],
  [']A2', AIMSymbology.CODE_39],
  [']A4', AIMSymbology.CODE_39],
  [']A5', AIMSymbology.CODE_39],
  [']A7', AIMSymbology.CODE_39],
  [']B0', AIMSymbology.TELEPEN],
  [']B1', AIMSymbology.TELEPEN],
  [']B2', AIMSymbology.TELEPEN],
  [']B4', AIMSymbology.TELEPEN],
  [']C0', AIMSymbology.CODE_128],
  [']C1', AIMSymbology.CODE_128],
  [']C2', AIMSymbology.CODE_128],
  [']C4', AIMSymbology.CODE_128],
  [']E0', AIMSymbology.UPC_EAN],
  [']E1', AIMSymbology.UPC_EAN],
  [']E2', AIMSymbology.UPC_EAN],
  [']E3', AIMSymbology.UPC_EAN],
  [']E4', AIMSymbology.UPC_EAN],
  [']F0', AIMSymbology.CODABAR],
  [']F1', AIMSymbology.CODABAR],
  [']F3', AIMSymbology.CODABAR],
  [']G0', AIMSymbology.CODE_93],
  [']H0', AIMSymbology.CODE_11],
  [']H1', AIMSymbology.CODE_11],
  [']H3', AIMSymbology.CODE_11],
  [']I0', AIMSymbology.I2_OF_5],
  [']I1', AIMSymbology.I2_OF_5],
  [']I3', AIMSymbology.I2_OF_5],
  [']L0', AIMSymbology.PDF_417],
  [']L1', AIMSymbology.PDF_417],
  [']L2', AIMSymbology.PDF_417],
  [']L3', AIMSymbology.PDF_417],
  [']L4', AIMSymbology.PDF_417],
  [']L5', AIMSymbology.PDF_417],
  [']M0', AIMSymbology.MSI_PLESSEY],
  [']M1', AIMSymbology.MSI_PLESSEY],
  [']M2', AIMSymbology.MSI_PLESSEY],
  [']M3', AIMSymbology.MSI_PLESSEY],
  [']O1', AIMSymbology.CODABLOCK],
  [']O4', AIMSymbology.CODABLOCK],
  [']O5', AIMSymbology.CODABLOCK],
  [']O6', AIMSymbology.CODABLOCK],
  [']Om', AIMSymbology.CODABLOCK],
  [']P0', AIMSymbology.STD_PLESSEY],
  [']Q0', AIMSymbology.QR_CODE],
  [']Q1', AIMSymbology.QR_CODE],
  [']Q2', AIMSymbology.QR_CODE],
  [']Q3', AIMSymbology.QR_CODE],
  [']Q4', AIMSymbology.QR_CODE],
  [']Q5', AIMSymbology.QR_CODE],
  [']Q6', AIMSymbology.QR_CODE],
  [']R0', AIMSymbology.STD_2_OF_5],
  [']R1', AIMSymbology.STD_2_OF_5],
  [']R2', AIMSymbology.STD_2_OF_5],
  [']S0', AIMSymbology.D2_OF_5],
  [']T0', AIMSymbology.CODE_49],
  [']T1', AIMSymbology.CODE_49],
  [']T2', AIMSymbology.CODE_49],
  [']T4', AIMSymbology.CODE_49],
  [']U0', AIMSymbology.MAXICODE],
  [']U1', AIMSymbology.MAXICODE],
  [']U2', AIMSymbology.MAXICODE],
  [']U3', AIMSymbology.MAXICODE],
  [']X0', AIMSymbology.TRIOPTIC_CODE_39],
  [']d0', AIMSymbology.DATA_MATRIX],
  [']d1', AIMSymbology.DATA_MATRIX],
  [']d2', AIMSymbology.DATA_MATRIX],
  [']d3', AIMSymbology.DATA_MATRIX],
  [']d4', AIMSymbology.DATA_MATRIX],
  [']d5', AIMSymbology.DATA_MATRIX],
  [']d6', AIMSymbology.DATA_MATRIX],
  [']e0', AIMSymbology.GS1],
  [']e1', AIMSymbology.GS1],
  [']e2', AIMSymbology.GS1],
  [']e3', AIMSymbology.GS1],
  [']z0', AIMSymbology.AZTEC],
  [']z1', AIMSymbology.AZTEC],
  [']z2', AIMSymbology.AZTEC],
  [']z3', AIMSymbology.AZTEC],
  [']z4', AIMSymbology.AZTEC],
  [']z5', AIMSymbology.AZTEC],
  [']z6', AIMSymbology.AZTEC],
  [']z7', AIMSymbology.AZTEC],
  [']z8', AIMSymbology.AZTEC],
  [']z9', AIMSymbology.AZTEC],
  [']zA', AIMSymbology.AZTEC],
  [']zB', AIMSymbology.AZTEC],
  [']zC', AIMSymbology.AZTEC],
]);

/**
 * Récupère la symbologie suivant le préfixe AIM
 * Si c'est une symbologie AIM, le préfixe est enlevé de la valeur initiale
 * Sinon la symbologie sera UNKNOWN
 * @param value
 */
export const getAIMSymbology = (value: string): { value: string; aim: AIMSymbology } => {
  if (value.startsWith(']')) {
    for (const entry of Array.from(AIM_PREFIXES.entries())) {
      const [prefix, symbology] = entry;
      if (value.startsWith(prefix)) {
        return { value: value.slice(prefix.length), aim: symbology };
      }
    }
  }
  return { value, aim: AIMSymbology.UNKNOWN };
};

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
const isEan = (value: string, length: 8 | 13): boolean => {
  const aimSymbology = getAIMSymbology(value);
  return (
    (aimSymbology.aim === AIMSymbology.UNKNOWN && isOnlyDigits(value, length) && eanKeyController(value)) ||
    (aimSymbology.aim === AIMSymbology.UPC_EAN && isEan(aimSymbology.value, length))
  );
};
/**
 * Is the value an UPC with specified length ?
 * @param value
 */
const isUpc = (value: string): boolean => {
  const aimSymbology = getAIMSymbology(value);
  return (
    (aimSymbology.aim === AIMSymbology.UNKNOWN && isOnlyDigits(value, 12) && eanKeyController(`0${value}`)) ||
    (aimSymbology.aim === AIMSymbology.UPC_EAN && isUpc(aimSymbology.value))
  );
};
/**
 * List of definers
 */
const definersList: IBarcodeTypeDefiner[] = [
  { method: value => isEan(value, 13), type: BarcodeType.EAN_13 },
  { method: value => isUpc(value), type: BarcodeType.UPC_A },
  { method: value => isEan(value, 8), type: BarcodeType.EAN_8 },
  { method: value => getAIMSymbology(value).aim === AIMSymbology.CODE_128, type: BarcodeType.CODE_128 },
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
