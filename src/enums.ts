/**
 * Barcode types
 */
export enum BarcodeType {
  EAN_13 = 'EAN_13',
  UPC_A = 'UPC_A',
  EAN_8 = 'EAN_8',
  UPC_E = 'UPC_E',
  UNKNOWN = 'UNKNOWN',
  CODE_128 = 'CODE_128',
}
/**
 * Special keyboard keys
 */
export enum SpecialKeys {
  ALT = 'Alt',
  SHIFT = 'Shift',
  ENTER = 'Enter',
  CTRL = 'Control',
  CAPS = 'CapsLock',
  ALT_GR = 'AltGraph',
  OS = 'OS',
  NUM_LOCK = 'NumLock',
}

export enum AIMSymbology {
  CODE_39,
  TELEPEN,
  CODE_128,
  UPC_EAN,
  CODABAR,
  CODE_93,
  CODE_11,
  I2_OF_5,
  PDF_417,
  MSI_PLESSEY,
  CODABLOCK,
  STD_PLESSEY,
  QR_CODE,
  STD_2_OF_5,
  D2_OF_5,
  CODE_49,
  MAXICODE,
  TRIOPTIC_CODE_39,
  DATA_MATRIX,
  GS1,
  AZTEC,
  UNKNOWN,
}
