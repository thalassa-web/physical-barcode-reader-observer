import { Observable } from 'rxjs';
import { buffer, bufferCount, bufferTime, bufferToggle, filter, map, withLatestFrom } from 'rxjs/operators';
import { BarcodeResult } from './barcode-result';
import { AIM_PREFIXES } from './barcode-type-detector';
import { AIMSymbology } from './enums';

/**
 * Keypress event on document to Observable
 */
const onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
/**
 * Keyup event on document to Observable
 */
const onKeyup$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keyup');

const onEnterPress$: Observable<KeyboardEvent> = onKeypress$.pipe(
  filter(ev => ev.code === 'Enter' || ev.which === 13 || ev.charCode === 13),
);

/**
 * Keypress on printable values on document to Observable
 * Emit a KeyboardEvent
 */
const onPrintableKeypress$ = onKeypress$.pipe(filter(ev => ev.key.length === 1));
/**
 * Emit the last pressed key when no key was pressed during a certain amount of time
 * @param time
 */
const lastKeypressAfterTime = (time: number) =>
  onKeypress$.pipe(
    map(ev => ev.key),
    bufferTime(time),
    filter(keys => keys.length === 0),
    withLatestFrom(onKeypress$, (v1, v2) => v2),
  );
/**
 * Emit an array of printable keys until no keys was pressed during a certain amount of time
 * @param time
 */
const bufferPrintableKeypressUntilTime = (time: number) => {
  return onPrintableKeypress$.pipe(
    buffer(Observable.merge(lastKeypressAfterTime(time), onEnterPress$)),
    filter(keys => keys.length > 0),
  );
};
/**
 * Emit a buffer of upped keys if there was stroke in the same order defined in keys
 * @param keys
 */
const onKeysup = (keys: string[]) =>
  onKeyup$.pipe(
    map(ev => ev.key),
    bufferCount(keys.length, 1),
    filter(buf => buf.join() === keys.join()),
  );
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
  return onPrintableKeypress$.pipe(bufferToggle(onKeysup(prefixes), () => lastKeypressAfterTime(time)));
};

export const aimBarcodDetection$: Observable<AIMSymbology> = onKeypress$.pipe(
  map(ev => ev.key),
  bufferCount(3),
  map(start => AIM_PREFIXES.get(start.join(''))),
  filter(type => !!type),
);

/**
 * Emit the read barcode between prefixes and until no key was pressed during a certain amount of time
 * If there is no defined prefix, emit the read barcode between the first pressed key and until no key was pressed during a certain amount of time
 * @see SpecialKeys for prefixes
 * @param prefixes
 * @param time
 */
export const onBarcodeRead = (prefixes: string[] = [], time: number = 200) =>
  bufferPrintableKeypressStartWith(prefixes, time).pipe(map(keys => new BarcodeResult(keys)));
