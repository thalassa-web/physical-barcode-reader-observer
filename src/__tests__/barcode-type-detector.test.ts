import { BarcodeTypeDetector } from '../barcode-type-detector';
import { BarcodeType } from '../enums';

test('EAN_13', () => {
  expect(BarcodeTypeDetector.detect('3614950268099')).toBe(BarcodeType.EAN_13);
});

test('EAN_8', () => {
  expect(BarcodeTypeDetector.detect('78635708')).toBe(BarcodeType.EAN_8);
});

test('UPC_A', () => {
  expect(BarcodeTypeDetector.detect('012345678905')).toBe(BarcodeType.UPC_A);
});

test('UPC_E', () => {
  expect(BarcodeTypeDetector.detect('8635709')).toBe(BarcodeType.UPC_E);
});
