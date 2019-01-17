import { Observable } from 'rxjs';
import { buffer, bufferCount, bufferToggle, filter, map } from 'rxjs/operators';
import { BarcodeType } from './barcode-type';
import { IBarcodeResult } from './i-barcode-result';
import { SpecialKeys } from './special-keys';

/**
 * Keypress event on document to Observable
 */
const onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
/**
 * Keydown event on document to Observable
 */
const onKeyDown$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keydown');
/**
 * Keypress on Enter event on document to Observable
 */
const onEnter$: Observable<KeyboardEvent> = onKeypress$.pipe(filter(ev => ev.key === SpecialKeys.ENTER));
/**
 * Keypress on printable values on document to Observable
 */
const onPrintableKeypress$: Observable<string> = onKeypress$.pipe(
  map(ev => ev.key),
  filter(key => key.length === 1),
);
/**
 * Buffer of printable keys until Enter is pressed
 */
const noPrefixBuffer$: Observable<string[]> = onPrintableKeypress$.pipe(buffer(onEnter$));
/**
 * Buffer of printable keys between prefixes are «key downed» and Enter is pressed
 * @param prefixes
 */
const prefixesBuffer = (prefixes: string[]) => {
  return onPrintableKeypress$.pipe(
    bufferToggle(
      onKeyDown$.pipe(
        map(ev => ev.key),
        bufferCount(prefixes.length, 1),
        filter(keys => keys.join() === prefixes.join()),
      ),
      _ => onEnter$,
    ),
  );
};
/**
 * Transform array of keys into a IBarcodeResult
 * @param keys
 */
const keysToBarcodeResult = (keys: string[]) => {
  const result: IBarcodeResult = { barcode: keys.join(), type: BarcodeType.UNKNOWN };
  if (/\d{13}/.test(result.barcode)) {
    result.type = BarcodeType.EAN_13;
  }
  return result;
};

/**
 * Class for observe physical barcode reading
 */
export class PhysicalBarcodeReaderObserver {
  /**
   * The usable observable to subscribe to
   */
  public onBarcodeRead$: Observable<IBarcodeResult> = this.onBarcodeRead();
  /**
   * Getting reader with specific prefix
   * @param prefixes
   * @param debug
   */
  constructor(private prefixes: string[] = []) {}

  /**
   * Get the observable for barcode reading with specific prefixes
   */
  public onBarcodeRead(): Observable<IBarcodeResult> {
    const bufferized: Observable<string[]> =
      this.prefixes.length === 0 ? noPrefixBuffer$ : prefixesBuffer(this.prefixes);
    return bufferized.pipe(map(keys => keysToBarcodeResult(keys)));
  }
}
