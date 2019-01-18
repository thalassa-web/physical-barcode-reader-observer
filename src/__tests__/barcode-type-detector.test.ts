import { BarcodeTypeDetector } from '../barcode-type-detector';
import { BarcodeType } from '../enums';

test('EAN_13 Validation', () => {
  expect(BarcodeTypeDetector.detect('3614950268099')).toBe(BarcodeType.EAN_13);
});

test('EAN_8 Validation', () => {
  expect(BarcodeTypeDetector.detect('78635708')).toBe(BarcodeType.EAN_8);
});

test('UPC_A Validation', () => {
  expect(BarcodeTypeDetector.detect('123456789104')).toBe(BarcodeType.UPC_A);
});
