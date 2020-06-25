import { detectBarcodeType } from '../barcode-type-detector';
import { BarcodeType } from '../enums';

test('EAN_13 Validation', () => {
  expect(detectBarcodeType('9782212125085')).toBe(BarcodeType.EAN_13);
  expect(detectBarcodeType('0887232690540')).toBe(BarcodeType.EAN_13);
  expect(detectBarcodeType(']E00887232690540')).toBe(BarcodeType.EAN_13);
  expect(detectBarcodeType(']E30887232690540')).toBe(BarcodeType.EAN_13);
});

test('EAN_8 Validation', () => {
  expect(detectBarcodeType('78635708')).toBe(BarcodeType.EAN_8);
});

test('UPC_A Validation', () => {
  expect(detectBarcodeType('123456789104')).toBe(BarcodeType.UPC_A);
  expect(detectBarcodeType('887232690540')).toBe(BarcodeType.UPC_A);
  expect(detectBarcodeType(']E0887232690540')).toBe(BarcodeType.UPC_A);
});

test('Code 128 Validation', () => {
  expect(detectBarcodeType(']C101978221212508500300009324908')).toBe(BarcodeType.CODE_128);
});
