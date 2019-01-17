import {Observable} from 'rxjs';
import {buffer, bufferCount, bufferToggle, filter, map} from 'rxjs/operators';
import {SpecialKeys} from "./special-keys";
import {BarcodeResult} from "./barcode-result";
import {BarcodeType} from "./barcode-type";

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
    filter(key => key.length === 1)
);
/**
 * Buffer of printable keys until Enter is pressed
 */
const noPrefixBuffer$: Observable<Array<string>> = onPrintableKeypress$.pipe(buffer(onEnter$));
/**
 * Buffer of printable keys between prefixes are «key downed» and Enter is pressed
 * @param prefixes
 */
const prefixesBuffer = (prefixes: Array<string>) => {
    return onPrintableKeypress$.pipe(bufferToggle(
        onKeyDown$.pipe(
            map(ev => ev.key),
            bufferCount(prefixes.length, 1),
            filter(keys => keys.join() === prefixes.join())
        ),
        _ => onEnter$
    ));
}
/**
 * Transform array of keys into a BarcodeResult
 * @param keys
 */
const keysToBarcodeResult = (keys: Array<string>) => {
    const result: BarcodeResult = {barcode: keys.join(), type: BarcodeType.UNKNOWN};
    if (/\d{13}/.test(result.barcode)) {
        result.type = BarcodeType.EAN_13;
    }
    return result;
}

/**
 * Class for observe physical barcode reading
 */
export class PhysicalBarcodeReaderObserver {
    /**
     * The usable observable to subscribe to
     */
    public onBarcodeRead$: Observable<BarcodeResult> = this.onBarcodeRead();
  /**
   * Getting reader with specific prefix
   * @param prefixes
   * @param debug
   */
  constructor(private prefixes: Array<string> = []) {}

    /**
     * Get the observable for barcode reading with specific prefixes
     */
    public onBarcodeRead(): Observable<BarcodeResult> {
        const bufferized: Observable<Array<string>> = this.prefixes.length === 0 ? noPrefixBuffer$ : prefixesBuffer(this.prefixes);
        return bufferized.pipe(map(keys => keysToBarcodeResult(keys)));
    }
}
