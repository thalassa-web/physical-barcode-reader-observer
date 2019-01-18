import {Observable} from "rxjs";
import {buffer, bufferCount, bufferTime, bufferToggle, filter, map, withLatestFrom} from "rxjs/operators";
import {BarcodeResult} from "./barcode-result";

/**
 * Keypress event on document to Observable
 */
const onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
/**
 * Keydown event on document to Observable
 */
const onKeydown$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keydown');
/**
 * Keypress on printable values on document to Observable
 */
const onPrintableKeypress$: Observable<string> = onKeypress$.pipe(
    map(ev => ev.key),
    filter(key => key.length === 1),
);
/**
 * Emit the last pressed key when no key was pressed during a certain amount of time
 * @param time
 */
const lastKeypressAfterTime: (number) => Observable<KeyboardEvent> = (time: number) => onKeypress$.pipe(
    map(ev => ev.key),
    bufferTime(time),
    filter(keys => keys.length === 0),
    withLatestFrom(onKeypress$, (v1,v2) => v2)
);
/**
 * Emit an array of printable keys until no keys was pressed during a certain amount of time
 * @param time
 */
const bufferPrintableKeypressUntilTime = (time: number) => {
  return onPrintableKeypress$.pipe(
      buffer(lastKeypressAfterTime(time)),
      filter(keys => keys.length > 0)
  );
};
/**
 * Emit an array of printable keys when prefixes were detected
 * until no key was pressed during a certain amount of time
 * If prefixes is empty, return bufferPrintableKeypressUntilTime
 * Useful to detect barcode reading with an HID barcode reader
 * @param prefixes
 * @param time
 */
const bufferPrintableKeypressStartWith = (prefixes: string[] = [], time: number = 200) => {
  if (prefixes.length === 0) {
    return bufferPrintableKeypressUntilTime(time);
  }
  return onPrintableKeypress$.pipe(
      bufferToggle(
          onKeydown$.pipe(
              map(ev => ev.key),
              bufferCount(prefixes.length, 1),
              filter(keys => keys.join() === prefixes.join()),
          ),
          _ => lastKeypressAfterTime(time),
      ),
  );
};
/**
 * Emit the read barcode between prefixes and until no key was pressed during a certain amount of time
 * If there is no defined prefix, emit the read barcode between the first pressed key and until no key was pressed during a certain amount of time
 * @see SpecialKeys for prefixes
 * @param prefixes
 * @param time
 */
export const onBarcodeRead = (prefixes: string[] = [], time: number = 200) => bufferPrintableKeypressStartWith(prefixes, time)
    .pipe(map(keys => new BarcodeResult(keys)));